import csv
import gensim
from gensim import corpora, models
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
from pandas import DataFrame, Series
from scipy.cluster import hierarchy
from scipy.cluster.hierarchy import ward, cut_tree, dendrogram
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, pairwise_distances
from sklearn.metrics.pairwise import cosine_similarity
from textblob import TextBlob

def score_phrase(phrase:list, score:float, include_sentiment:bool):
    "Gets the numerical polarity of a list of tokens"
    weight = 1

    # Optionally weight the polarity of the phrase
    if include_sentiment:
        weight += abs(TextBlob(" ".join(phrase)).sentiment.polarity)

    return score * weight

def score_token(token:str, pos:str, doc_id:int, vocab:dict, tfidf:np.ndarray, max_token_scores:np.ndarray,
                tfidf_corpus:str, include_sentiment:bool):
    "Calculates the importance of a single token"
    score = 0
    weight = 1

    # Only score tokens in vocabulary
    if token in vocab:
        # Token score comes from TF-IDf matrix if tfidf_corpus='clustering' is set, otherwise, use max token score
        token_ix = vocab[token]
        score = tfidf[token_ix, doc_id] if tfidf_corpus=='clustering' else max_token_scores[token_ix];

        # Scale token_score by 3x if including sentiment and the token is an adjective or adverb
        if include_sentiment and pos in ['ADJ', 'ADV']:
            score *= 3

    return score

def get_phrase(sent:Series, window_size:int, vocab:dict, tfidf_corpus:str, tfidf:np.ndarray,
                                                       max_token_scores:np.ndarray, include_sentiment:bool):
    """
    Finds the most expressive phrase in a sentence. This function is called in a lambda expression in `core.get_phrases`.
    Passing `include_sentiment=False` will weight all tokens equally, ignoring sentiment and part of speech.

    Returns list
    """
    tokens = sent.tokens

    # Score each token in the sentence
    token_scores = [
        score_token(t, sent.pos_tags[i], sent.doc_id, vocab, tfidf, max_token_scores, tfidf_corpus, include_sentiment)
        for i, t in enumerate(tokens)]

    # Score each phrase in the sentence
    window_cnt = len(tokens) - window_size + 1
    windows = [slice(w, w + window_size) for w in range(window_cnt)]
    phrase_scores = [score_phrase(tokens[w], sum(token_scores[w]), include_sentiment) for w in windows]

    # Find the phrase with the highest score
    phrase = sent.tokens[windows[np.argmax(phrase_scores)]]

    return phrase

def get_vector_tfidf(sent:Series, dictionary:gensim.corpora.dictionary.Dictionary, term_matrix:np.ndarray):
    """
    Create a word vector for a given sentence using a term matrix.
    This function is called in a lambda expression in `core.get_vectors`.

    Returns list
    """
    vec_ids = [x[0] for x in dictionary.doc2bow(sent.phrase)]
    return term_matrix[vec_ids].sum(axis=0)

def get_vector_w2v(sent:Series, model:gensim.models.keyedvectors.Word2VecKeyedVectors):
    """
    Create a word vector for a given sentence using a Word2Vec model.
    This function is called in a lambda expression in `core.get_vectors`.

    Returns list
    """
    tokens = [token for token in sent.phrase if token in model.wv.vocab]
    return model[tokens].sum(axis=0)

def w2v_pretrained(bin_file:str):
    """
    Load a pre-trained Word2Vec model from a bin file.

    Returns gensim.models.keyedvectors.Word2VecKeyedVectors
    """
    return gensim.models.KeyedVectors.load_word2vec_format(bin_file, binary=True)

def get_cluster_assignments_hac(linkage_matrix:np.ndarray, height:int):
    """
    Assigns clusters by cutting the HAC dendrogram at the specified height.

    Returns list
    """
    return [x[0] for x in cut_tree(linkage_matrix, height=height)]

def get_silhouette_score_hac(phrase_vecs:list, linkage_matrix:np.ndarray, height:int):
    """
    Assigns clusters to a list of word vectors for a given `height` and calculates the silhouette score of the clustering.

    Returns float
    """
    cluster_assignments = get_cluster_assignments_hac(linkage_matrix, height)

    # Getting weird errors for trying invalid ranges for unknown reasons. Wrapping in try/except to handle
    try:
        score = silhouette_score(phrase_vecs, cluster_assignments)
    except:
        score = -1

    return score

def get_tree_height(root:hierarchy.ClusterNode):
    """
    Recursively finds the height of a binary tree.

    Returns int
    """
    if root is None:
        return 1
    return max(get_tree_height(root.left), get_tree_height(root.right)) + 1

def get_optimal_height(data:DataFrame, linkage_matrix:np.ndarray, max_h:int, show_chart:bool = True,
                       save_chart:bool = False, chart_file:str = "HACSilhouette.png"):
    """
    Clusters the top phrase vectors and plots the silhoute coefficients for a range of dendrograph heights.
    Returns the optimal height value (highest silhoute coefficient)

    Returns int
    """
    h_range = range(2,max_h)
    phrase_vecs = list(data.vec)
    h_scores = [get_silhouette_score_hac(phrase_vecs, linkage_matrix, h) for h in h_range]

    # Optionally display the graph of silhouette score by height
    if show_chart:
        fig = plt.plot(h_range, h_scores)
        plt.show()

    # Optionally save the graph of silhouette score by height to disk
    if save_chart:
        plt.savefig(chart_file, dpi=300)

    # optimal_h is height value with the highest silhouette score
    optimal_height = h_range[np.argmax(h_scores)]
    return optimal_height

def get_clusters_hac(data:DataFrame, dist_metric:str, height:int = None, show_dendrogram:bool = False,
                     show_chart:bool = False):
    """
    Use Hierarchical Agglomerative Clustering (HAC) to cluster phrase vectors

    Returns (list, np.ndarray, int)
    """
    # Create a linkage matrix
    if dist_metric == "cosine":
        dist = 1 - cosine_similarity(list(data.vec))
    else:
        dist = pairwise_distances(list(data.vec), metric=dist_metric)
    linkage_matrix = ward(dist)

    # Maximum cut point height is the height of the tree
    max_h = get_tree_height(hierarchy.to_tree(linkage_matrix)) + 1

    # Use optimal height if no height is specified
    if height is None:
        height = get_optimal_height(data, linkage_matrix, max_h, show_chart)

    cluster_assignments = get_cluster_assignments_hac(linkage_matrix, height)

    # Optionally display the clustering dendrogram
    if show_dendrogram:
        dendrogram(linkage_matrix)
        plt.show()

    return cluster_assignments, linkage_matrix, max_h, height

def get_silhouette_score_kmeans(phrase_vecs:list, k:int):
    """
    Assigns clusters to a list of word vectors for a given `k` and calculates the silhouette score of the clustering.

    Returns float
    """
    cluster_assignments = KMeans(k).fit(phrase_vecs).predict(phrase_vecs)
    return silhouette_score(phrase_vecs, cluster_assignments)

def get_optimal_k(data:DataFrame, show_chart:bool = True, save_chart:bool = False,
                  chart_file:str = "KmeansSilhouette.png"):
    """
    Calculates the optimal k-value (highest silhoute coefficient).
    Optionally prints a chart of silhouette score by k-value or saves it to disk.

    Returns int
    """
    phrase_vecs = list(data.vec)
    max_k = min(len(phrase_vecs), 100)
    k_range = range(2, max_k)
    score = [get_silhouette_score_kmeans(phrase_vecs, i) for i in k_range]

    # Optionally display the graph of silhouette score by k-value
    if show_chart:
        fig = plt.plot(k_range, score)

    # Optionally save the graph of silhouette score by k-value to disk
    if save_chart:
        plt.savefig(chart_file, dpi=300)

    # optimal_k is k value with the highest silhouette score
    optimal_k = k_range[np.argmax(score)]
    return optimal_k

def get_cluster_assignments_kmeans(phrase_vecs:list, k:int):
    """
    K-means clustering.

    Returns list
    """
    # Assign clusters
    kmeans = KMeans(n_clusters=k, random_state=42).fit(phrase_vecs)
    cluster_assignments = kmeans.predict(phrase_vecs)
    return cluster_assignments

def get_clusters_kmeans(data:DataFrame, k:int = None, show_chart:bool = False):
    """
    Use K-means algorithm to cluster phrase vectors

    Returns list
    """

    # Use optimal k if no k-value is specified
    if k is None:
        k = get_optimal_k(data, show_chart)

    return get_cluster_assignments_kmeans(list(data.vec), k), k

def get_topics_from_docs(docs:list, topic_count:int):
    """
    Gets a list of `topic_count` topics for each list of tokens in `docs`.

    Returns list
    """
    dictionary = corpora.Dictionary(docs)
    corpus = [dictionary.doc2bow(text) for text in docs]

    # Use Latent Dirichlet Allocation (LDA) to find the main topics
    lda = models.LdaModel(corpus, num_topics=1, id2word=dictionary)
    topics_matrix = lda.show_topics(formatted=False, num_words=topic_count)
    topics = list(np.array(topics_matrix[0][1])[:,0])
    return topics

def df_to_disk(df:DataFrame, file_name:str, mode:str="w", header:bool=True, sep='\t'):
    """
    Writes a dataframe to disk as a tab delimited file.

    Returns None
    """
    # Create the output directory if it doesn't exist
    os.makedirs(os.path.dirname(file_name), exist_ok=True)

    df.to_csv(file_name, sep=sep, mode=mode, header=header, encoding='utf-8', index=False, quoting=csv.QUOTE_NONE, quotechar="",  escapechar="\\")
    if mode == "w":
        print(f"Results saved to {file_name}")

def sentences_to_disk(data:DataFrame, file_name:str = 'output/DocumentSentenceList.txt'):
    """
    Writes the raw sentences to a file organized by document and sentence number.

    Returns None
    """
    df = data[["id", "text"]].copy()
    df_to_disk(df, file_name)


def write_cluster(cluster_rows:DataFrame, file_name:str, mode:str = 'a', header:bool=False):
    """
    Appends the rows for a single cluster to disk.

    Returns None
    """
    df_to_disk(cluster_rows, file_name, mode=mode, header=header)


def clusters_to_disk(data:DataFrame, doc_df:DataFrame, cluster_df:DataFrame,
                     file_name:str = 'output/TopicClusterResults.txt'):
    """
    Writes the sentences and phrases to a file organized by cluster and document.

    Returns None
    """
    # Create a dataframe containing the data to be saved to disk
    df = data[["cluster", "doc_id", "sent_id", "text", "phrase"]].copy()
    doc_names = [doc_df.loc[c].doc_name for c in data.doc_id]
    df.insert(loc=3, column='doc_name', value=doc_names)
    df.sort_values(by=["cluster", "doc_id", "sent_id"], inplace=True)

    # Write document header
    cluster_rows = pd.DataFrame(None, columns=df.columns)
    write_cluster(cluster_rows, file_name, mode = 'w', header=True)

    # Write each cluster
    for c in set(data.cluster):
        # Write a cluster header containing the main topics for each cluster
        with open(file_name, encoding="utf-8", mode = 'a') as file:
            keywords = ', '.join(cluster_df.loc[c, 'topics'])
            file.write(f"Cluster: {c}; Keywords: [{keywords}]\n")

        # Write the sentences in each cluster
        cluster_rows = df[df.cluster == c].copy()
        write_cluster(cluster_rows, file_name)