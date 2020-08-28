import json
import topex.core as topex
import pandas as pd
from flask import request

class returnObject():
    "Return object accepted by the TopEx application."
    def __init__(self, df1 = None, df2 = None, df3 = None, main_cluster_topics = None, count = None):
        self.df1 = df1
        self.df2 = df2
        self.df3 = df3
        self.main_cluster_topics = main_cluster_topics
        self.count = count

    def __iter__(self):
        yield 'df1', self.df1
        yield 'df2', self.df2
        yield 'df3', self.df3
        yield 'main_cluster_topics', self.main_cluster_topics
        yield 'count', self.count

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
                include_input_in_tfidf, include_sentiment)

def cluster(df:pd.DataFrame, seed_topics_df:pd.DataFrame, clustering_method:str, height:int, k:int, vectorization_method:str, window_size:int, dimensions:int, 
            umap_neighbors:int, dist_metric:str, include_input_in_tfidf:bool, include_sentiment:bool):
    "Clusters the sentences in a dataframe"
    data, doc_df = topex.import_data(df, save_results=False, file_name=None, stop_words_file=None)
    tfidf, dictionary = topex.create_tfidf(doc_df, seed_topics_df=seed_topics_df)
    data = topex.get_phrases(data, dictionary.token2id, tfidf, window_size, include_input_in_tfidf, include_sentiment)
    data = topex.get_vectors(vectorization_method, data, dictionary = dictionary, tfidf = tfidf)
    data, linkage_matrix, max_height, height = topex.assign_clusters(data, method=clustering_method, k=k, height=height, dist_metric=dist_metric)
    cluster_df = topex.get_cluster_topics(data, doc_df)

    finalObject = returnObject()
    #TODO: Only cluster once
    finalObject.df1 = topex.visualize_clustering(data, method = "umap", show_chart = False, return_data = True).to_json()
    finalObject.df2 = topex.visualize_clustering(data, method = "svd", show_chart = False, return_data = True).to_json()
    finalObject.df3 = topex.visualize_clustering(data, method = "svd", show_chart = False, return_data = True).to_json()
    finalObject.main_cluster_topics = list(cluster_df.topics)
    finalObject.count = len(data)
    return dict(finalObject)