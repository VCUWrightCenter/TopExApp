import gensim
from gensim import corpora, models, matutils
import matplotlib.pyplot as plt
import internal
import preprocessing
import numpy as np
import os
import pandas as pd
from pandas import DataFrame, Series
import plotly
import plotly.express as px
from sklearn.manifold import MDS, TSNE
from sklearn.metrics import silhouette_score, pairwise_distances
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD
import umap.umap_ as umap

def import_data(raw_docs:DataFrame, save_results:bool=False, file_name:str=None, stop_words_file:str=None,
                stop_words_list:list=None, custom_stopwords_only:bool=False, ner:bool=False):
    """
    Imports and pre-processes the documents from the `raw_docs` dataframe

    Document pre-processing is handled in [`tokenize_and_stem`](/topex/preprocessing#tokenize_and_stem).
    `path_to_file_list` is a path to a text file containing a list of files to be processed separated by line breaks.

    Returns (DataFrame, DataFrame)
    """

    raw_docs['id'] = range(len(raw_docs))
    data, doc_df = preprocessing.preprocess_docs(raw_docs, save_results, file_name, stop_words_file=stop_words_file,
                               stop_words_list=stop_words_list, custom_stopwords_only=custom_stopwords_only, ner=ner)

    # Optionally save the results to disk
    if save_results:
        internal.sentences_to_disk(data, file_name)

    return data, doc_df

def import_from_files(path_to_file_list:str, save_results:bool = False, file_name:str = 'output/DocumentSentenceList.txt',
               stop_words_file:str = None, stop_words_list:list=None, custom_stopwords_only:bool=False):
    """
    Imports and pre-processes a list of documents contained in `path_to_file_list`.
    Returns (DataFrame, DataFrame)
    """
    # Extract list of files from the text document
    with open(path_to_file_list, encoding="utf-8") as file:
        file_list = file.read().strip().split('\n')

    # 1) Import raw text documents
    docs = []
    for file in file_list:
        # Read documents
        with open(file, encoding="utf-8") as file_content:
            doc_text = file_content.read()
            docs.append(doc_text)

    raw_docs = DataFrame(dict(id=range(len(docs)), doc_name=file_list, text=docs))
    data, doc_df = preprocessing.preprocess_docs(raw_docs, save_results, file_name, stop_words_file=stop_words_file,
                               stop_words_list=stop_words_list, custom_stopwords_only=custom_stopwords_only)
    return data, doc_df

def import_from_csv(path_to_csv:str, save_results:bool = False, file_name:str = 'output/DocumentSentenceList.txt',
               stop_words_file:str = None, stop_words_list:list=None, custom_stopwords_only:bool=False):
    """
    Imports and pre-processes documents from a pipe-demilited csv file. File should be formatted with two columns:
    "doc_name" and "text"

    Returns (DataFrame, DataFrame)
    """
    raw_docs = pd.read_csv(path_to_csv, sep='|')
    raw_docs['id'] = range(len(raw_docs))
    data, doc_df = preprocessing.preprocess_docs(raw_docs, save_results, file_name, stop_words_file=stop_words_file,
                               stop_words_list=stop_words_list, custom_stopwords_only=custom_stopwords_only)
    return data, doc_df

def create_tfidf(tfidf_corpus:str='both', doc_df:DataFrame=None, path_to_expansion_file_list:str=None,
                 path_to_expansion_csv:str=None, expansion_df:DataFrame=None):
    """
    Creates a dense TF-IDF matrix from the tokens in some combination of the clustering corpus and/or expansion corpus.
    This combination is determined by `tfidf_corpus` which has possible values (both, clustering, expansion).

    `path_to_seed_topics_file_list` is a path to a text file containing a list of files with sentences corresponding to
    known topics. Use the `path_to_seed_topics_csv` if you would prefer to load all seed topics documents from a single,
    pipe-delimited csv file. If the `doc_df` is passed, the input corpus will be used along with the seed topics documents
    to generate the TF-IDF matrix.

    Returns (numpy.ndarray, gensim.corpora.dictionary.Dictionary)
    """
    # Bag of Words (BoW) is a list of all tokens by document
    bow_docs = []

    # Add clustering corpus to BoW
    if tfidf_corpus in ('both','clustering'):
        assert doc_df is not None, f"Optional parameter: 'doc_df' is required for tfidf_corpus: {tfidf_corpus}."
        bow_docs = bow_docs + list(doc_df.tokens)

    # Add expansion corpus to BoW
    if tfidf_corpus in ('both','expansion'):
        expansion_docs_df = None
        if path_to_expansion_file_list is not None:
            _, expansion_docs_df = import_from_files(path_to_expansion_file_list)
        elif path_to_expansion_csv is not None:
            _, expansion_docs_df = import_from_csv(path_to_expansion_csv)
        elif expansion_df is not None:
            _, expansion_docs_df = import_data(expansion_df)

        assert expansion_docs_df is not None, f"Unable to load expansion docs. Check expansion parameter or set tfidf_corpus to 'clustering'."

        bow_docs = bow_docs + list(expansion_docs_df.tokens)

    # Create a dense TF-IDF matrix using document tokens and gensim
    dictionary = corpora.Dictionary(bow_docs)
    corpus = [dictionary.doc2bow(text) for text in bow_docs]
    tfidf = models.TfidfModel(corpus)
    corpus_tfidf = tfidf[corpus]
    num_terms = len(corpus_tfidf.obj.idfs)
    tfidf_dense = matutils.corpus2dense(corpus_tfidf, num_terms)

    return tfidf_dense, dictionary

def get_phrases(data:DataFrame, vocab:dict, tfidf:np.ndarray, window_size:int = 6,
                tfidf_corpus:str='clustering', include_sentiment:bool=True):
    """
    Extracts the most expressive phrase from each sentence.

    `feature_names` should be `dictionary.token2id` and `vocab` should be `dictionary.token2id` from the output of
    `create_tfidf`. `window_size` is the length of phrase extracted, if a -1 is passed, all tokens will be included
    (IMPORTANT: this option requires aggregating vectors in the next step.)
    When `tfidf_corpus='clustering'`, token_scores are calculated using the TF-IDF, otherwise, token_scores
    are calculated using `max_token_scores` (max scores for each token in all documents. When `include_sentiment` is False,
    sentiment and token part of speech are ignored when scoring phrases.

    Returns DataFrame
    """
    if window_size > 0:
        max_token_scores = np.max(tfidf, axis=1)

        # Remove records where len(tokens) < window_size
        filtered_df = data[data.tokens.map(len)>=window_size].copy().reset_index(drop=True)
        print(f"Removed {len(data) - len(filtered_df)} sentences without phrases.")

        # Find the most expressive phrase for each sentence and add to dataframe
        lambda_func = lambda sent: internal.get_phrase(sent, window_size, vocab, tfidf_corpus, tfidf,
                                                       max_token_scores, include_sentiment)
        phrases = filtered_df.apply(lambda_func, axis=1)
        filtered_df['phrase'] = phrases
    else:
        # Remove records with no tokens
        filtered_df = data[data.tokens.map(len)>=0].copy().reset_index(drop=True)
        print(f"Removed {len(data) - len(filtered_df)} sentences without phrases.")

        filtered_df['phrase'] = filtered_df.tokens

    return filtered_df

def get_vectors(method:str, data:DataFrame, dictionary:gensim.corpora.dictionary.Dictionary = None,
                tfidf:np.ndarray = None, dimensions:int = 2, umap_neighbors:int = 15,
                path_to_w2v_bin_file:str = None, doc_df:DataFrame = None):
    """
    Creates a word vector for each phrase in the dataframe.

    Options for `method` are ('tfidf', 'svd', 'umap', 'pretrained', 'local'). Options for `method` are ('tfidf', 'svd', 'umap', 'pretrained', 'local').`tfidf` and `dictionary` are output from
    `create_tfidf`. `dimensions` is the number of dimensions to which SVD or UMAP reduce the TF-IDF matrix.
    `path_to_w2v_bin_file` is the path to a pretrained Word2Vec .bin file.

    Returns DataFrame
    """

    # Create word vectors with TF-IDF
    if method == "tfidf":
        assert dictionary is not None, "Optional parameter: 'dictionary' is required for method: 'tfidf'."
        assert tfidf is not None, "Optional parameter: 'tfidf' is required for method: 'tfidf'."
        lambda_func = lambda sent: internal.get_vector_tfidf(sent, dictionary, tfidf)

    # Create word vectors with SVD transformed TF-IDF
    elif method == "svd":
        assert dictionary is not None, "Optional parameter: 'dictionary' is required for method: 'svd'."
        assert tfidf is not None, "Optional parameter: 'tfidf' is required for method: 'svd'."
        svd =  TruncatedSVD(n_components = dimensions, random_state = 42)
        tfidf_transf = svd.fit_transform(tfidf)
        lambda_func = lambda sent: internal.get_vector_tfidf(sent, dictionary, tfidf_transf)

    # Create word vectors with UMAP transformed TF-IDF
    elif method == "umap":
        assert dictionary is not None, "Optional parameter: 'dictionary' is required for method: 'umap'."
        assert tfidf is not None, "Optional parameter: 'tfidf' is required for method: 'umap'."
        reducer = umap.UMAP(n_neighbors=umap_neighbors, min_dist=.1, metric='cosine', random_state=42, n_components=dimensions)
        embed = reducer.fit_transform(tfidf)
        lambda_func = lambda sent: internal.get_vector_tfidf(sent, dictionary, embed)

    # Create word vectors using a pre-trained Word2Vec model
    elif method == "pretrained":
        assert path_to_w2v_bin_file is not None, "Optional parameter: 'path_to_w2v_bin_file' is required for method: 'pretrained'."
        model = internal.w2v_pretrained(path_to_w2v_bin_file)
        lambda_func = lambda sent: internal.get_vector_w2v(sent, model)

    # Generate a Word2Vec model from the input corpus and use it to create word vectors for each phrase
    elif method == "local":
        assert doc_df is not None, "Optional parameter: 'doc_df' is required for method: 'local'."
        large_sent_vec = list(doc_df.tokens)
        model = models.Word2Vec(sg=1, window = 6, max_vocab_size = None, min_count=1, size=10, iter=500)
        model.build_vocab(large_sent_vec)
        model.train(large_sent_vec, total_examples=model.corpus_count, epochs=model.epochs)
        lambda_func = lambda sent: internal.get_vector_w2v(sent, model)

    # Invalid input paramter
    else:
        raise Exception(f"Unrecognized method: '{method}'")

    # Create a word vector for each phrase and append it to the dataframe
    vectors = data.apply(lambda_func, axis=1)
    data['vec'] = vectors

    return data

def assign_clusters(data:DataFrame, method:str = "kmeans", dist_metric:str = "euclidean", k:int = None,
                    height:int = None, show_chart:bool = False, show_dendrogram:bool = False):
    """
    Clusters the sentences using phrase vectors.

    Options for `method` are ('kmeans', 'hac'). Options for `dist_metric` are ('cosine' or anything accepted by
    sklearn.metrics.pairwise_distances). `k` is the number of clusters for K-means clustering. `height` is the height
    at which the HAC dendrogram should be cut. When `show_chart` is True, the chart of silhoute scores by possible k or
    height is shown inline. When `show_dendrogram` is True, the HAC dendrogram is shown inline.

    Returns (DataFrame, np.ndarray, int, int)
    """
    max_thresh = len(data)
    linkage_matrix = None

    # Cluster using K-means algorithm
    if method == "kmeans":
        cluster_assignments, cluster_thresh = internal.get_clusters_kmeans(data, k, show_chart = show_chart)

    # Cluster using Hierarchical Agglomerative Clustering (HAC)
    elif method == "hac":
        cluster_assignments, linkage_matrix, max_thresh, cluster_thresh = internal.get_clusters_hac(data, dist_metric = dist_metric,
                                                        height = height, show_chart = show_chart,
                                                        show_dendrogram = show_dendrogram)

    # Invalid input parameter
    else:
        raise Exception(f"Unrecognized method: '{method}'")

    data['cluster'] = cluster_assignments
    return data, linkage_matrix, max_thresh, cluster_thresh

def reassign_hac_clusters(linkage_matrix:np.ndarray, height:int):
    """
    Reassigns HAC clusters using a different height.
    """
    return internal.get_cluster_assignments_hac(linkage_matrix, height)

def reassign_kmeans_clusters(phrase_vecs:list, k:int):
    """
    Reassigns clusters using a different # of clusters.
    """
    return internal.get_cluster_assignments_kmeans(phrase_vecs, k)

def visualize_clustering(data:DataFrame, method:str = "umap", dist_metric:str = "cosine", umap_neighbors:int = 15,
                         show_chart = True, save_chart = False, return_data = False,
                         chart_file = "output/cluster_visualization.html"):
    """
    Visualize clustering in two dimensions.

    Options for `method` are ('umap', 'tsne', 'mds', 'svd'). Options for `dist_metric` are ('cosine' or anything accepted by
    sklearn.metrics.pairwise_distances). When `show_chart` is True, the visualization is shown inline.
    When `save_chart` is True, the visualization is saved to `chart_file`.

    Returns DataFrame
    """

    # Calculate distances between all pairs of phrases
    dist = pairwise_distances(list(data.vec), metric=dist_metric)

    # Visualize the clusters using UMAP
    if method == "umap":
        reducer = umap.UMAP(n_neighbors=umap_neighbors, min_dist=.1, metric='cosine', random_state=42)
        embedding = reducer.fit_transform(dist)
        x, y = embedding[:, 0], embedding[:, 1]

    elif method == "tsne":
        vec = [list(x) for x in data.vec]
        tsne2d = TSNE(n_components=2).fit_transform(vec)
        x, y = tsne2d[:, 0], tsne2d[:, 1]

    # Visualize the clusters using Multi-Dimensional Scaling (MDS)
    elif method == "mds":
        mds = MDS(n_components=2, dissimilarity="precomputed", random_state=42)
        pos = mds.fit_transform(dist)
        x, y = pos[:, 0], pos[:, 1]

    # Visualize the clusters using Singular Value Decomposition (SVD)
    elif method == "svd":
        svd2d =  TruncatedSVD(n_components = 2, random_state = 42).fit_transform(dist)
        x, y = svd2d[:, 0], svd2d[:, 1]

    # Invalid input parameter
    else:
        raise Exception(f"Unrecognized method: '{method}'")

    visualization_df = DataFrame(dict(label=list(data.id), cluster=list(data.cluster), phrase=list(data.phrase),
                                      text=list(data.text), x=x, y=y, doc_id=list(data.doc_id)))
    # To keep the visualization legible, limit
    max_phrase = 10
    vis_df = visualization_df.copy()
    vis_df.phrase = vis_df.apply(lambda x: x.phrase[:max_phrase] + ['...'] if len(x.phrase)>max_phrase else x.phrase, axis=1)

    # Produce visualization
    visualize_df(vis_df, show_chart=show_chart, save_chart=save_chart, chart_file=chart_file)

    # Return the data to display clusters
    if return_data:
        return vis_df

def visualize_df(vis_df:DataFrame, cluster_df:DataFrame=None, show_chart = True, save_chart = False, min_cluster_size = 0,
                 chart_file = "output/cluster_visualization.html"):
    """
    Visualize clustering in two dimensions. This method takes in the vis_df produced by visualize_clustering.
    The cluster column can be updated to dynamically try different clustering thresholds without the overhead of
    recomputing the (x, y) coordinates.

    `min_cluster_size` is the minimum # of points for a cluster to be displayed.
    When `show_chart` is True, the visualization is shown inline.
    When `save_chart` is True, the visualization is saved to `chart_file`.
    """
    if min_cluster_size > 0 and cluster_df is not None:
        # List of "valid" clusters containing the min_cluster_size points
        valid = list(cluster_df[cluster_df.sent_count >= min_cluster_size].cluster)
    else:
        valid = list(vis_df.cluster)

    # Only display clusters containing the min_cluster_size points
    fig = px.scatter(vis_df[vis_df.cluster.isin(valid)], x="x", y="y", hover_name="label", color="cluster",
                     hover_data=["phrase","cluster"], color_continuous_scale='rainbow')

    # Print visualization to screen by default
    if show_chart:
        fig.show()

    # Optionally save the chart to a file
    if save_chart:
        # Create the output directory if it doesn't exist
        os.makedirs(os.path.dirname(chart_file), exist_ok=True)

        plotly.offline.plot(fig, filename=chart_file)

def get_cluster_topics(data:DataFrame, doc_df:DataFrame = None, topics_per_cluster:int = 10, save_results:bool = False,
                       file_name:str = 'output/TopicClusterResults.txt'):
    """
    Gets the main topics for each cluster.

    `topics_per_cluster` is the number of main topics per cluster. When `save_results` is True, the resulting dataframe
    will be saved to `file_name`.

    Returns DataFrame
    """

    # Iterate distinct clusters
    rows = []
    for c in set(data.cluster):
        cluster_tokens = [t for t in data[data.cluster == c].tokens]
        topics = internal.get_topics_from_docs(cluster_tokens, topics_per_cluster)
        rows.append(Series([c, topics, len(cluster_tokens)], index=["cluster", "topics", "sent_count"]))

    cluster_df = DataFrame(rows)

    # Optionally save clusters to disk
    if save_results:
        assert doc_df is not None, "Optional parameter: 'doc_df' is required when save_results = True."
        internal.clusters_to_disk(data, doc_df, cluster_df, file_name)

    return cluster_df

def recluster(data:DataFrame, viz_df:DataFrame, cluster_method:str,
              linkage_matrix:np.ndarray=None, height:int=None, k:int=None, min_cluster_size:int=None,
              topics_per_cluster:int=10, show_chart = True):
    """
    Recomputes clusters with a new threshold using the output of a previous clustering.

    Returns DataFrame, DataFrame
    """
    # Assign new clusters
    if cluster_method == 'kmeans':
        viz_df.cluster = reassign_kmeans_clusters(list(data.vec),k=k)
    elif cluster_method == 'hac':
        viz_df.cluster = reassign_hac_clusters(linkage_matrix,height=height)
    else:
        raise Exception(f"Unrecognized cluster_method: '{cluster_method}'")

    # Update data
    data.cluster = viz_df.cluster

    # Compute cluster_df
    cluster_df = get_cluster_topics(data, topics_per_cluster=topics_per_cluster, save_results=False)

    if show_chart == True:
        visualize_df(viz_df, cluster_df, min_cluster_size=min_cluster_size, show_chart=show_chart)

    # Mark "valid" clusters containing the min_cluster_size points
    if min_cluster_size > 0 and cluster_df is not None:
        valid = list(cluster_df[cluster_df.sent_count >= min_cluster_size].cluster)
        data['valid'] = data.cluster.isin(valid)
    else:
        data['valid'] = True

    return data, cluster_df

def get_doc_topics(doc_df:DataFrame, topics_per_doc:int = 10, save_results:bool = False,
                       file_name:str = 'output/TopicDocumentResults.txt'):
    """
    Gets the main topics for each document.

    `topics_per_doc` is the number of topics extracted per document. When `save_results` is True, the resulting dataframe
    will be saved to `file_name`.

    Returns DataFrame
    """
    doc_df['topics'] = [internal.get_topics_from_docs([doc], topics_per_doc) for doc in doc_df.tokens]

    # Optionally save clusters to disk
    if save_results:
        internal.df_to_disk(doc_df, file_name)

    return doc_df

def evaluate(data, gold_file, save_results = False, file_name = "output/EvaluationResults.txt"):
    """
    Evaluate precision, recall, and F1 against a gold standard dataset.

    `gold_file` is a path to a text file containing a list IDs and labels. When `save_results` is True, the resulting
    dataframe will be saved to `file_name`.

    Returns DataFrame
    """

    # Import gold standard list of IDs (doc.#.sent.#) and labels
    gold_df = pd.read_csv(gold_file, names=["id", "label"], sep="\t", encoding="utf-8")

    # Inner join the actual labels with the assigned clusters for each document.
    eval_df = pd.merge(gold_df, data[["id", "cluster"]], on="id")

    # Iterate labels in the gold standard dataset
    rows = []
    for label in set(gold_df.label):
        cluster_rows = eval_df[eval_df.label == label]

        # Find the cluster with the most instances of each label in the gold standard dataset
        closest_cluster = cluster_rows.cluster.mode()[0] if len(cluster_rows) > 0 else -1

        # IDs assigned to a label in the gold standard dataset
        gold_examples = set(gold_df[gold_df.label == label].id)

        # IDs in the closest cluster
        closest_cluster_members = set(eval_df[eval_df.cluster == closest_cluster].id)

        # Calculate performance metrics
        tp = len(gold_examples.intersection(closest_cluster_members))
        fp = len(closest_cluster_members - gold_examples)
        fn = len(gold_examples - closest_cluster_members)
        precision = round(tp/(tp+fp), 3) if (tp+fp) > 0 else float("Nan")
        recall = round(tp/(tp+fn), 3) if (tp+fn) > 0 else float("Nan")
        f1 = round(2*((precision*recall)/(precision+recall)), 3) if (precision+recall) > 0 else float("Nan")

        rows.append(Series([label, gold_examples, closest_cluster, closest_cluster_members, tp, fp, fn, precision, recall, f1],
                              index=["label", "gold_examples", "closest_cluster", "closest_cluster_members", "tp", "fp", "fn", "precision", "recall", "f1"]))

    # Create results dataframe with a row for each label
    results_df = DataFrame(rows).sort_values(by=["label"])

    # Optionally save the results to disk
    if save_results:
        internal.df_to_disk(results_df, file_name)

    return results_df