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

def process(request: request):
    "Processes input files into clusters."
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

    if str_valid(params['tfidfcorpus']):
        tfidfcorpus = params['tfidfcorpus'].rstrip("<newdoc>")
        seed_docs = tfidfcorpus.split("<newdoc>") if len(tfidfcorpus) > 0 else []
        seed_names = [f"seed_{i}" for i in range(len(seed_docs))]
        seed_topics_df = pd.DataFrame(dict(doc_name=seed_names, text=seed_docs))
    else:
        seed_topics_df = None

    clustering_method = params['clusteringMethod']
    visualization_method = params['visualizationMethod'] if str_valid(params['visualizationMethod']) else 'umap'
    height = cast_int(params['threshold']) if clustering_method == "hac" else None
    k = cast_int(params['threshold']) if clustering_method == "kmeans" else None
    vectorization_method = params['wordVectorType'] if str_valid(params['wordVectorType']) else 'tfidf'
    #TODO: w2vBinFile
    window_size = cast_int(params['windowSize'])
    dimensions = cast_int(params['dimensions'])
    umap_neighbors = cast_int(params['umap_neighbors'])
    dist_metric = params['DistanceMetric'] if str_valid(params['DistanceMetric']) else 'euclidean'
    include_input_in_tfidf = bool(params['include_input_in_tfidf'])
    include_sentiment = bool(params['include_sentiment'])

    return cluster(df, seed_topics_df, clustering_method, height, k, vectorization_method, window_size, dimensions, umap_neighbors, dist_metric, 
                include_input_in_tfidf, include_sentiment, visualization_method)

def cluster(df:pd.DataFrame, seed_topics_df:pd.DataFrame, clustering_method:str, height:int, k:int, vectorization_method:str, window_size:int, dimensions:int, 
            umap_neighbors:int, dist_metric:str, include_input_in_tfidf:bool, include_sentiment:bool, visualization_method:str):
    "Clusters the sentences in a dataframe"
    data, doc_df = topex.import_data(df, save_results=False, file_name=None, stop_words_file=None)
    tfidf, dictionary = topex.create_tfidf(doc_df, seed_topics_df=seed_topics_df)
    data = topex.get_phrases(data, dictionary.token2id, tfidf, window_size, include_input_in_tfidf, include_sentiment)
    data = topex.get_vectors(vectorization_method, data, dictionary = dictionary, tfidf = tfidf)
    data, linkage_matrix, max_thresh, thresh = topex.assign_clusters(data, method=clustering_method, k=k, height=height, dist_metric=dist_metric)
    cluster_df = topex.get_cluster_topics(data, doc_df)

    finalObject = returnObject()
    finalObject.viz_df = topex.visualize_clustering(data, method = visualization_method, show_chart = False, return_data = True).to_json()
    finalObject.data = data[['id','text','tokens','phrase','vec','cluster']].to_json() #only return the needed subset of data columns
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

    # Return
    finalObject = returnObject()
    finalObject.viz_df = viz_df.to_json()
    finalObject.data = data[['id','text','tokens','phrase','vec','cluster']].to_json() #only return the needed subset of data columns
    finalObject.linkage_matrix = [list(row) for row in list(linkage_matrix)] if linkage_matrix is not None else []
    finalObject.main_cluster_topics = list(cluster_df.topics)
    finalObject.count = len(data)
    finalObject.max_thresh = max_thresh
    finalObject.thresh = height if cluster_method == "hac" else k
    return dict(finalObject)