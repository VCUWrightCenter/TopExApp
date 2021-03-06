import json
import numpy as np
import pandas as pd
from response import Response
from pymed import PubMed
import threading
import topex.core as topex

def cast_int(param: str):
    "Casts valid int parameter"
    return int(param) if param.isdigit() else None

def str_valid(param: str):
    "Casts valid str parameter"
    return param if param != 'null' or param == '' else None

class ClusterThread(threading.Thread):
    def __init__(self, params, files):
        self.status = 'Initializing'
        self.result = {}
        self.params = params
        self.files = files
        super().__init__()

    def run(self):
        res = Response()
        params = self.params
        files = self.files

        # Process input from request
        self.status = 'Loading files'
        names = []
        docs = []
        df = None
        
        if len(files)==0 and len(params['query'])>0:
            # Query PubMed
            results = PubMed().query(params['query'], max_results=int(params['maxResults']))
            data = [(p.pubmed_id,p.abstract) for p in results if len(p.abstract or "")>0]
            df = pd.DataFrame(data, columns=["doc_name","text"])
        elif len(files)>0:
            # User loads input corpus
            for file in files:
                fileob = files[file]
                print(f"File: {fileob}")
                if fileob.content_type == 'application/json':
                    scriptArgs = json.loads(fileob.stream.read())
                elif fileob.content_type == 'application/vnd.ms-excel':
                    # Skip the header row and overwrite columns names
                    df = pd.read_csv(fileob,sep='|',names=['doc_name','text'],skiprows=1)
                else:
                    fileText = fileob.read().decode()
                    docs.append(fileText)
                    names.append(fileob.filename)
        
        # Skip if user directly loaded a .csv file
        if df is None:
            docs = [doc.replace('\n',' ').replace('\r',' ') for doc in docs]
            df = pd.DataFrame(dict(doc_name=names, text=docs))

        self.status = 'Parsing params'
        stopwords = [s.strip() for s in params['stopwords'].split('\n')] if str_valid(params['stopwords']) else None
        window_size = cast_int(params['windowSize'])
        vectorization_method = params['wordVectorType'] if str_valid(params['wordVectorType']) else 'svd'
        dimensions = cast_int(params['dimensions'])
        tfidf_corpus = params['tfidfCorpus'] if str_valid(params['tfidfCorpus']) else 'both'
        include_sentiment = params['include_sentiment'] != 'false'
        custom_stopwords_only = params['custom_stopwords_only'] != 'false'

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
        self.status = 'Importing data'
        data, doc_df = topex.import_data(df, save_results=False, file_name=None, stop_words_list=stopwords, custom_stopwords_only=custom_stopwords_only)
        self.status = 'Creating TF-IDF'
        tfidf, dictionary = topex.create_tfidf(tfidf_corpus, doc_df, expansion_df=expansion_df)

        if dimensions is None or dimensions >= tfidf.shape[1]:
            new_dim = min(200,tfidf.shape[1]-1)
            res.msg += f"Dimensions changed from {dimensions} to {new_dim}.\n"
            dimensions = 2 if vectorization_method == 'umap' else new_dim    

        self.status = 'Getting phrases'
        data = topex.get_phrases(data, dictionary.token2id, tfidf, tfidf_corpus=tfidf_corpus, window_size=window_size, include_sentiment=include_sentiment)
        self.status = 'Vectorizing phrases'
        data = topex.get_vectors(vectorization_method, data, dictionary = dictionary, tfidf = tfidf, dimensions=dimensions, umap_neighbors=umap_neighbors)

        if clustering_method == 'kmeans' and k > len(data):
            res.msg += f"k exceeds number of sentences. Changed from {k} to {len(data)}.\n"
            k = len(data)

        self.status = 'Clustering sentences'
        data, linkage_matrix, max_thresh, thresh = topex.assign_clusters(data, method=clustering_method, k=k, height=height, dist_metric=cluster_dist_metric)
        self.status = 'Visualizing sentences'
        viz_df = topex.visualize_clustering(data, method = visualization_method, dist_metric=viz_dist_metric, show_chart = False, return_data = True, umap_neighbors=umap_neighbors)
        viz_df['valid'] = True
        data['valid'] = True # Show all points on the first run
        cluster_df = topex.get_cluster_topics(data, doc_df)

        res.viz_df = viz_df.to_json()
        res.data = data[['id','text','tokens','phrase','vec','cluster', 'valid']].to_json() #only return the needed subset of data columns
        res.linkage_matrix = [list(row) for row in list(linkage_matrix)] if linkage_matrix is not None else []
        res.main_cluster_topics = list(cluster_df.topics)
        res.count = len(data)
        res.max_thresh = max_thresh
        res.thresh = thresh
        self.result = dict(res)
        self.status = 'Complete'

class ReclusterThread(threading.Thread):
    def __init__(self, params):
        self.status = 'Initializing'
        self.result = {}
        self.params = params
        super().__init__()

    def run(self):
        res = Response()
        params = self.params

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
        self.status = 'Reclustering...'
        data, cluster_df = topex.recluster(data, viz_df, linkage_matrix=linkage_matrix, cluster_method=cluster_method, height=height, k=k, 
                                            min_cluster_size=min_cluster_size, topics_per_cluster=topics_per_cluster, show_chart=False)
        viz_df.cluster = data.cluster
        viz_df['valid'] = data.valid

        # Return
        res = Response()
        res.viz_df = viz_df.to_json()
        res.data = data[['id','text','tokens','phrase','vec','cluster','valid']].to_json() #only return the needed subset of data columns
        res.linkage_matrix = [list(row) for row in list(linkage_matrix)] if linkage_matrix is not None else []
        res.main_cluster_topics = list(cluster_df.topics)
        res.count = len(data)
        res.max_thresh = max_thresh
        res.thresh = height if cluster_method == "hac" else k

        self.result = dict(res)
        self.status = 'Complete'