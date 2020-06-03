from discover_topics_UMAP_Kmeans import returnObject
import pandas as pd
import random
import core

def dummy():
    sent_count = 20
    just_phrase_ids = [f'doc.{i}.sent{j}' for i in range(4) for j in range(5)]
    cluster_assignments = [random.randint(0,4) for i in range(sent_count)]
    just_phrase_text = [['test','phrases'] for i in range(sent_count)]
    x = [random.random() * (1 if random.random() < 0.5 else -1) for i in range(sent_count)]
    y = [random.random() * (1 if random.random() < 0.5 else -1) for i in range(sent_count)]

    finalObject = returnObject()
    finalObject.df1 = pd.DataFrame(dict(label=just_phrase_ids, UMAP_cluster=cluster_assignments, phrase=just_phrase_text, x=x, y=y)).to_json()
    finalObject.df2 = pd.DataFrame(dict(label=just_phrase_ids, MDS_cluster=cluster_assignments, phrase=just_phrase_text, x=x, y=y)).to_json()
    finalObject.df3 = pd.DataFrame(dict(label=just_phrase_ids, SVD_cluster=cluster_assignments, phrase=just_phrase_text, x=x, y=y)).to_json()
    finalObject.main_cluster_topics = [[f'topic{i}{j}' for i in range(2)] for j in range(5)]
    finalObject.raw_sent = [[f'raw sentence{i}{j}' for i in range(2)] for j in range(5)]
    return dict(finalObject)

def process(fileList):
    data, doc_df = core.import_docs('2019.03.12_SEED_TOPICS_AMY/FILELIST.txt')
    tfidf, dictionary = core.create_tfidf(doc_df, '2019.03.12_SEED_TOPICS_AMY/FILELIST.txt')
    data = core.get_phrases(data, dictionary.token2id, tfidf, include_input_in_tfidf = True)
    data = core.get_vectors("tfidf", data, dictionary = dictionary, tfidf = tfidf)
    data = core.assign_clusters(data, method = "kmeans", k=4)
    cluster_df = core.get_cluster_topics(data, doc_df)

    #Just for testing
    sent_count = 55
    just_phrase_ids = [f'doc.{i}.sent{j}' for i in range(4) for j in range(14)]
    del just_phrase_ids[-1]
    cluster_assignments = [random.randint(0,3) for i in range(sent_count)]
    just_phrase_text = [['test','phrases'] for i in range(sent_count)]
    full_text = ['full text' for i in range(sent_count)]
    x = [random.random() * (1 if random.random() < 0.5 else -1) for i in range(sent_count)]
    y = [random.random() * (1 if random.random() < 0.5 else -1) for i in range(sent_count)]

    finalObject = returnObject()
    finalObject.df1 = pd.DataFrame(dict(label=just_phrase_ids, cluster=cluster_assignments, phrase=just_phrase_text, text=full_text, x=x, y=y)).to_json()
    # finalObject.df1 = core.visualize_clustering(data, method = "umap", show_chart = False, return_data = True)
    finalObject.df2 = core.visualize_clustering(data, method = "mds", show_chart = False, return_data = True).to_json()
    finalObject.df3 = core.visualize_clustering(data, method = "svd", show_chart = False, return_data = True).to_json()
    finalObject.main_cluster_topics = list(cluster_df.topics)
    finalObject.count = len(data)
    return dict(finalObject)