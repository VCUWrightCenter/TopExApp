import json
import medtop.core as medtop
import pandas as pd
from flask import request

class returnObject():
    "Return object accepted by the MedTop application."
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

def process(request: request):
    "Processes input files into clusters."
    data = request.files
    names = []
    docs = []
    for file in data:
        fileob = data[file]
        print(f"File: {fileob}")
        if fileob.content_type == 'application/json':
            scriptArgs = json.loads(fileob.stream.read())
        else:
            fileText = fileob.read().decode()
            docs.append(fileText)
            names.append(fileob.filename)
    df = pd.DataFrame(dict(doc_name=names, text=docs))
    return cluster(df)

def cluster(df: pd.DataFrame):
    "Clusters the sentences in a dataframe"
    data, doc_df = medtop.import_data(df, save_results=False, file_name=None, stop_words_file=None)
    tfidf, dictionary = medtop.create_tfidf(doc_df)
    data = medtop.get_phrases(data, dictionary.token2id, tfidf, include_input_in_tfidf = True)
    data = medtop.get_vectors("tfidf", data, dictionary = dictionary, tfidf = tfidf)
    data = medtop.assign_clusters(data, method = "kmeans", k=4)
    cluster_df = medtop.get_cluster_topics(data, doc_df)

    finalObject = returnObject()
    finalObject.df1 = medtop.visualize_clustering(data, method = "umap", show_chart = False, return_data = True).to_json()
    finalObject.df2 = medtop.visualize_clustering(data, method = "mds", show_chart = False, return_data = True).to_json()
    finalObject.df3 = medtop.visualize_clustering(data, method = "svd", show_chart = False, return_data = True).to_json()
    finalObject.main_cluster_topics = list(cluster_df.topics)
    finalObject.count = len(data)
    return dict(finalObject)