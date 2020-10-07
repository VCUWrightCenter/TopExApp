import json
import topex.core as topex
import pandas as pd
from flask import request
import numpy as np

class returnObject():
    "Return object accepted by the TopEx application."
    def __init__(self, viz_df = None, data = None, linkage_matrix = None, main_cluster_topics = None, count = None, max_thresh=None, thresh = None):
        self.viz_df = viz_df
        self.data = data
        self.linkage_matrix = linkage_matrix
        self.main_cluster_topics = main_cluster_topics
        self.count = count
        self.max_thresh = max_thresh
        self.thresh = thresh

    def __iter__(self):
        yield 'viz_df', self.viz_df
        yield 'data', self.data
        yield 'linkage_matrix', self.linkage_matrix
        yield 'main_cluster_topics', self.main_cluster_topics
        yield 'count', self.count
        yield 'max_thresh', self.max_thresh
        yield 'thresh', self.thresh

def cast_int(param: str):
    "Casts valid int parameter"
    return int(param) if param.isdigit() else None

def str_valid(param: str):
    "Casts valid str parameter"
    return param if param != 'null' or param == '' else None

def cluster(request: request):
    "Processes input files into clusters."
    # Process input from request
    params = request.form
    files = request.files
    names = []
    docs = []
    for file in files:
        fileob = files[file]
        print(f"File: {fileob}")
        if fileob.content_type == 'application/json':
            scriptArgs = json.loads(fileob.stream.read())
        else:
            fileText = fileob.read().decode()
            docs.append(fileText)
            names.append(fileob.filename)
    df = pd.DataFrame(dict(doc_name=names, text=docs))

    stopwords = params['stopwords'].split('\r\n') if str_valid(params['stopwords']) else None

    window_size = cast_int(params['windowSize'])
    vectorization_method = params['wordVectorType'] if str_valid(params['wordVectorType']) else 'svd'
    dimensions = cast_int(params['dimensions'])
    tfidf_corpus = params['tfidfCorpus'] if str_valid(params['tfidfCorpus']) else 'both'
    include_sentiment = params['include_sentiment'] != 'false'

    clustering_method = params['clusteringMethod']
    cluster_dist_metric = params['cluster_dist_metric'] if str_valid(params['cluster_dist_metric']) else 'euclidean'
    height = cast_int(params['threshold']) if clustering_method == "hac" else None
    k = cast_int(params['threshold']) if clustering_method == "kmeans" else None

    visualization_method = params['visualizationMethod'] if str_valid(params['visualizationMethod']) else 'umap'
    viz_dist_metric = params['viz_dist_metric'] if str_valid(params['viz_dist_metric']) else 'cosine'
    umap_neighbors = cast_int(params['umap_neighbors'])

    if str_valid(params['expansionCorpus']):
        expansionCorpus = params['expansionCorpus'].rstrip("<newdoc>")
        expansion_docs = expansionCorpus.split("<newdoc>") if len(expansionCorpus) > 0 else []
        expansion_names = [f"expansion_{i}" for i in range(len(expansion_docs))]
        expansion_df = pd.DataFrame(dict(doc_name=expansion_names, text=expansion_docs))
    else:
        expansion_df = None
        tfidf_corpus = 'clustering'

    # Cluster the sentences in a dataframe
    data, doc_df = topex.import_data(df, save_results=False, file_name=None, stop_words_list=stopwords)
    tfidf, dictionary = topex.create_tfidf(tfidf_corpus, doc_df, expansion_df=expansion_df)

    if dimensions is None or dimensions >= tfidf.shape[1]:
        dimensions = 2 if vectorization_method == 'umap' else min(200,tfidf.shape[1]-1)

    data = topex.get_phrases(data, dictionary.token2id, tfidf, tfidf_corpus=tfidf_corpus, window_size=window_size, include_sentiment=include_sentiment)
    data = topex.get_vectors(vectorization_method, data, dictionary = dictionary, tfidf = tfidf, dimensions=dimensions, umap_neighbors=umap_neighbors)
    data, linkage_matrix, max_thresh, thresh = topex.assign_clusters(data, method=clustering_method, k=k, height=height, dist_metric=cluster_dist_metric)
    viz_df = topex.visualize_clustering(data, method = visualization_method, dist_metric=viz_dist_metric, show_chart = False, return_data = True, umap_neighbors=umap_neighbors)
    viz_df['valid'] = True
    data['valid'] = True # Show all points on the first run
    cluster_df = topex.get_cluster_topics(data, doc_df)

    finalObject = returnObject()
    finalObject.viz_df = viz_df.to_json()
    finalObject.data = data[['id','text','tokens','phrase','vec','cluster', 'valid']].to_json() #only return the needed subset of data columns
    finalObject.linkage_matrix = [list(row) for row in list(linkage_matrix)] if linkage_matrix is not None else []
    finalObject.main_cluster_topics = list(cluster_df.topics)
    finalObject.count = len(data)
    finalObject.max_thresh = max_thresh
    finalObject.thresh = thresh
    return dict(finalObject)

def recluster(request: request):
    "Re-clusters data"
    # Format params
    params = request.form
    max_thresh = cast_int(params['max_thresh'])
    n = cast_int(params['n'])
    data = pd.DataFrame.from_dict(json.loads(params['data']))
    viz_df = pd.DataFrame.from_dict(json.loads(params['viz_df']))
    cluster_method = params['clusteringMethod']
    linkage_matrix = np.array([float(x) for x in params['linkage_matrix'].split(',')] ).reshape(n-1,4) if cluster_method == "hac" else None
    height = cast_int(params['threshold']) if cluster_method == "hac" else None
    k = cast_int(params['threshold']) if cluster_method == "kmeans" else None
    min_cluster_size = cast_int(params['minClusterSize'])
    topics_per_cluster = cast_int(params['topicsPerCluster'])

    # Recluster
    data, cluster_df = topex.recluster(data, viz_df, linkage_matrix=linkage_matrix, cluster_method=cluster_method, height=height, k=k, 
                                        min_cluster_size=min_cluster_size, topics_per_cluster=topics_per_cluster, show_chart=False)
    viz_df.cluster = data.cluster
    viz_df['valid'] = data.valid

    # Return
    finalObject = returnObject()
    finalObject.viz_df = viz_df.to_json()
    finalObject.data = data[['id','text','tokens','phrase','vec','cluster','valid']].to_json() #only return the needed subset of data columns
    finalObject.linkage_matrix = [list(row) for row in list(linkage_matrix)] if linkage_matrix is not None else []
    finalObject.main_cluster_topics = list(cluster_df.topics)
    finalObject.count = len(data)
    finalObject.max_thresh = max_thresh
    finalObject.thresh = height if cluster_method == "hac" else k
    return dict(finalObject)