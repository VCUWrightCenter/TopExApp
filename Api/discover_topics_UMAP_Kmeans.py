# Copyright (c) 2018 
# Amy L. Olex, Virginia Commonwealth University
# alolex at vcu.edu
# discover_topics is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 3
# of the License, or (at your option) any later version.
#
# discover_topics is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with discover_topics; if not, write to 
#
# The Free Software Foundation, Inc., 
# 59 Temple Place - Suite 330, 
# Boston, MA  02111-1307, USA.

## This is the main driver program that runs discover_topics.  
import argparse
import os

import nltk
import re
import string
from nltk.tokenize import WhitespaceTokenizer
from nltk.corpus import stopwords
import math
import datetime, re, sys
from sklearn.feature_extraction.text import TfidfVectorizer
import gensim
import numpy
from sklearn.metrics.pairwise import euclidean_distances
from sklearn.metrics import pairwise_distances
from sklearn.metrics import silhouette_score
from scipy import cluster
from scipy.cluster.hierarchy import ward, dendrogram, linkage
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics.pairwise import cosine_similarity
import gensim, logging
logging.basicConfig(format='%(asctime)s : %(levelname)s : %(message)s', level=logging.ERROR)
import matplotlib.pyplot as plt
import os  # for os.path.basename
import matplotlib as mpl
from sklearn.manifold import MDS
from textblob import TextBlob
from gensim import corpora, models, similarities
from gensim import matutils
import scipy
import plotly.express as px
import umap.umap_ as umap
import numpy as np
import plotly
from sklearn.decomposition import TruncatedSVD

    

## define function to remove contractions.  
## Obtainined from https://stackoverflow.com/questions/19790188/expanding-english-language-contractions-in-python
def decontracted(phrase):
    # specific
    phrase = re.sub(r"won\'t", "will not", phrase)
    phrase = re.sub(r"can\'t", "can not", phrase)
    phrase = re.sub(r"hadn\'t", "had not", phrase)
    phrase = re.sub(r"doesnt", "does not", phrase)
    phrase = re.sub(r"youre", "you are", phrase)
    phrase = re.sub(r"dont", "do not", phrase)
    phrase = re.sub(r"im\s", "i am", phrase)
    phrase = re.sub(r"ive\s", "i have", phrase)
    
    phrase = re.sub(r"won\’t", "will not", phrase)
    phrase = re.sub(r"can\’t", "can not", phrase)
    phrase = re.sub(r"hadn\’t", "had not", phrase)
    phrase = re.sub(r"dont\s", "do not", phrase)
    

    # general
    #phrase = re.sub(r"n\'t", " not", phrase)
    #phrase = re.sub(r"\'re", " are", phrase)
    #phrase = re.sub(r"\'s", " is", phrase)
    #phrase = re.sub(r"\'d", " would", phrase)
    #phrase = re.sub(r"\'ll", " will", phrase)
    #phrase = re.sub(r"\'t", " not", phrase)
    #phrase = re.sub(r"\'ve", " have", phrase)
    #phrase = re.sub(r"\'m", " am", phrase)
    
    phrase = re.sub(r"n\’t", " not", phrase)
    phrase = re.sub(r"\’re", " are", phrase)
    phrase = re.sub(r"\’s", " is", phrase)
    phrase = re.sub(r"\’d", " would", phrase)
    phrase = re.sub(r"\’ll", " will", phrase)
    phrase = re.sub(r"\’t", " not", phrase)
    phrase = re.sub(r"\’ve", " have", phrase)
    phrase = re.sub(r"\’m", " am", phrase)
    
    phrase = re.sub(r"/", " ", phrase) ### I added this line
    return phrase

def tokenize_and_stem2(text):
    split_sent, split_sent_pos, split_sent_loc, my_tokens, my_pos_tags, my_loc, full_sent, full_pos, full_loc, raw_sent = tokenize_and_stem(text)
    return my_tokens


## Parse out sentences, remove contractions, tokenize by white space, and remove all punctuation, and lemmatize tokens
## https://stackoverflow.com/questions/31387905/converting-plural-to-singular-in-a-text-file-with-python
## Need to pass one document text at a time.
## Returns the list of all tokens
## Returns the list of tokenizes sentences
def tokenize_and_stem(text):
    lemmatizer = nltk.WordNetLemmatizer()
    my_tokens = []
    my_pos_tags = []
    my_loc = []
    
    full_sent = []
    full_pos = []
    full_loc = []
    
    raw_sent = []
    
    
    stop_words = set(stopwords.words('english')) | {"patient","mrs","hi","ob","1am","4month","o2","ed",
                                                    "ecmo","m3","ha","3rd","ai","csicu","wa","first",
                                                    "second","third","fourth","etc","eg","thus",
                                                    ",",".","'","(",")","!","...","'m","'s",'"',"?", "`",
                                                    "say","many","things","new","much","get","really","since",
                                                    "way","also","one","two","three","four","five","six","week","day",
                                                    "month","year","would","could","should","like","im","thing","v","u","d","g"}
    table  = str.maketrans(' ', ' ', string.punctuation+"“"+"”")
    sent = nltk.sent_tokenize(text)
    split_sent = []
    split_sent_pos = []
    split_sent_loc = []
    for s in sent:   ##for each sentence in document get back the list of tokenized words with contractions normalized and punctuation removed
        raw_sent.append(s)
        tokenized = WhitespaceTokenizer().tokenize(decontracted(s).translate(table))
        tags = nltk.pos_tag(tokenized)
        lemma = [lemmatizer.lemmatize(t) for t in tokenized]
        #convert all remaining tokens to lowercase
        f2 = [w.lower() for w in lemma]
        
        loc2 = list(range(0, len(f2)))
        #print(loc2)
        #remove stopwords and some punctuation
        #f3 = [w for w in f2 if not w in stop_words]
        f3 = []
        t3 = []
        loc3 = []
        for w in range(0,len(f2)):
            if f2[w] not in stop_words:
                f3.append(f2[w])
                t3.append(tags[w])
                loc3.append(loc2[w])
            
        #print(loc3)
        # filter out any tokens not containing letters (e.g., numeric tokens, raw punctuation)
        filtered_tokens = []
        filtered_tags = []
        filtered_loc = []
        for t in range(0, len(f3)):
            if re.search('[a-zA-Z]', f3[t]):
                filtered_tokens.append(f3[t])
                filtered_tags.append(t3[t])
                filtered_loc.append(loc3[t])
        #print(filtered_loc)
        
        split_sent.append(filtered_tokens)
        split_sent_pos.append(filtered_tags)
        split_sent_loc.append(filtered_loc)
        my_tokens = my_tokens + filtered_tokens
        my_pos_tags = my_pos_tags + filtered_tags
        my_loc = my_loc + filtered_loc
        
        full_sent.append(f2)
        full_pos.append(tags)
        full_loc.append(loc2)
        
        #print(split_sent_loc)
    return split_sent, split_sent_pos, split_sent_loc, my_tokens, my_pos_tags, my_loc, full_sent, full_pos, full_loc, raw_sent

def get_term_averages(tdm):
    #print(len(tdm))
    #print(len(tdm[0]))
    
    avg_vec = numpy.zeros(len(tdm))
    for i in range(0,len(tdm)):
        for j in range(0,len(tdm[0])):
            avg_vec[i] = avg_vec[i] + tdm[i,j]
        avg_vec[i] = avg_vec[i]/len(tdm[0])
    
    return(avg_vec)

def get_term_max(tdm):
    #print(len(tdm))
    #print(len(tdm[0]))
    
    avg_vec = numpy.zeros(len(tdm))
    for i in range(0,len(tdm)):
        avg_vec[i] = max(tdm[i])
    
    return(avg_vec)

## Gets top phrase for each sentence and returns them as a list of lists
## One entry for each sentence.  If there are no phrases then a "none" is returned for that sentences value.
def get_top_phrases(text_id, text, feature_names, tdm, size, include_input_in_tfidf):
    
    if not include_input_in_tfidf:
        token_averages = get_term_max(tdm)
    
    
    top_sent_phrases = []
    #print("Processing Doc: " + str(text_id))
    for sentence in nltk.sent_tokenize(text):
        
        sent_tokens, sent_tokens_pos, sent_tokens_loc, my_tokens, my_pos_tags, my_loc, d1, d2, d3, d4 = tokenize_and_stem(sentence)
        
        sent_token_scores = []
        phrase_scores = []
        for p in range(size,len(my_tokens)+1):
            phrase = my_tokens[p-size:p]
            phrase_pos = my_pos_tags[p-size:p]
            phrase_loc = my_loc[p-size:p]
            weight = 1 + abs(TextBlob(" ".join(phrase)).sentiment.polarity)
            score = 0
            #print("Processing Phrase: " + str(phrase))
            
            ## get tokens and associated POS tags that are in the TF-IDF matrix
            avaliable_tokens = []
            avaliable_pos = []
            avaliable_loc = []
            
            for n in range(0, len(phrase)):
                if phrase[n] in list(feature_names.keys()):
                    avaliable_tokens.append(phrase[n])
                    avaliable_pos.append(phrase_pos[n])
                    avaliable_loc.append(phrase_loc[n])
                #else:
                    #print("Token not in TF-IDF: " + str(phrase[n]))
            
            #new_vec = dictionary.doc2bow(phrase[1]) #convert phrase to a vector of ids and counts
            #vec_ids = [x[0] for x in new_vec]  #get word IDs in dictionary
            
            for t in range(0, len(avaliable_tokens)):
                
                if avaliable_pos[t][1] in ["JJ","JJR", "JJS", "RB", "RBR", "RBS"]:
                    #print("Found adverb or adjective")
                    index = feature_names[avaliable_tokens[t]]
                    #print(str(tdm[index, text_id]))
                    if include_input_in_tfidf:
                        #print("executing1")
                        score += tdm[index, text_id]*3
                    else:
                        score += token_averages[index]*3       
                else:
                    #print("not JJ or RB")
                    index = feature_names[avaliable_tokens[t]]
                    #print(str(tdm[index, text_id]))
                    if include_input_in_tfidf:
                        #print("executing2")
                        score += tdm[index, text_id]
                    else:
                        score += token_averages[index]
            
            phrase_scores.append((score*weight, phrase, phrase_loc))  #*weight, phrase))
            #print("Phrase Score: " + str(score))
            
        ## sort phrase scores for this sentence and choose the highest to represent sentence
        phrase_scores.sort(key=lambda sent: sent[0], reverse=True)
        #if len(phrase_scores) > 0:
            #print(sentence)
            #print(phrase_scores[0])
        top_sent_phrases.append(phrase_scores[0]) if len(phrase_scores) > 0 else top_sent_phrases.append("none")
    

    return top_sent_phrases





def get_vec(term, dictionary, u):
    p_vec = numpy.zeros(len(u[0]))
    new_vec = dictionary.doc2bow([term]) #convert phrase to a vector of ids and counts
    vec_ids = [x[0] for x in new_vec]  #get word IDs in dictionary
    for i in vec_ids:
        # get the SVD vector for this word ID
        p_vec = p_vec + u[i]
    
    return p_vec

def get_phrase_vec_tfidf(doc_top_phrases, dictionary, term_matrix):  
    doc_phrase_vecs = []  
    for doc in doc_top_phrases:
        phrases_vec = []
        for phrase in doc:
            p_vec = numpy.zeros(len(term_matrix[0]))
        
            if phrase is not "none":
                new_vec = dictionary.doc2bow(phrase[1]) #convert phrase to a vector of ids and counts
                vec_ids = [x[0] for x in new_vec]  #get word IDs in dictionary
                for i in vec_ids:
                    p_vec = p_vec + term_matrix[i]
                
            phrases_vec.append(p_vec)#/len(phrase))
        doc_phrase_vecs.append(phrases_vec)
    return(doc_phrase_vecs)


def get_phrase_vec_w2v(doc_top_phrases, model2):
    doc_phrase_vecs = []

    for doc in doc_top_phrases:
        phrases_vec = []
        for phrase in doc:
            p_vec = 0
        
            if phrase is not "none":
                for tok in phrase[1]:
                    if tok in model2.wv.vocab:
                        p_vec = p_vec + model2.wv[tok] 
                    else:
                        print(tok + ": not in Corpus")
                
            phrases_vec.append(p_vec)#/len(phrase))
        doc_phrase_vecs.append(phrases_vec)
    return doc_phrase_vecs

def average_sent_size(my_docs):
    doc_sum = 0

    for doc in my_docs:
        sent_sum = 0
        #print("Doc Length" + str(len(doc)))
        for sent in doc:
            sent_sum = sent_sum + len(sent)
            #print("Sent Length" + str(len(sent)))
            #print("Sentence:" + str(sent))
        
        if len(doc) > 0:
            doc_sum = doc_sum + sent_sum/len(doc)

    total_average = doc_sum/len(my_docs)
    return(total_average)
    
def w2v_from_corpus(file_content, my_docs):
    ##extract all sentences from each doc into one large sentence vector
    ## so each document is just a bag of words
    large_sent_vec = []
    for doc in file_content:
        flattened_list = [y for x in tokenize_and_stem(doc)[6] for y in x]
        large_sent_vec.append(flattened_list)
    
    sent_avg_size = average_sent_size(my_docs)

    model2 = gensim.models.Word2Vec(sg=1, window = 6, max_vocab_size = None, min_count=1, size = 10, iter=500)
    model2.build_vocab(large_sent_vec)
    model2.train(large_sent_vec, total_examples=model2.corpus_count, epochs=model2.iter)
    return(model2)

def w2v_pretrained(bin_file):
    return gensim.models.KeyedVectors.load_word2vec_format(bin_file, binary=True)


def merge_doc_lists(doc1, doc2):
    file_list1 = open(doc1).read().strip().split('\n')
    file_list2 = open(doc2).read().strip().split('\n')
    
    return(file_list1 + file_list2)


## Input: the path to and name of a files containing the list of documents to use for the tf-idf matrix creation.
def create_tfidf(documents1, documents2="none"):
    ### import documents
    if documents2 == "none":
        file_list = open(documents1).read().strip().split('\n')
    else:
        file_list = merge_doc_lists(documents1, documents2)

    file_content = []
    for file_path in file_list:
        if file_path is not '':
            file = open(file_path, "r")
            text = file.read()
            file_content.append(text)    

    ### Pre-processing corpus
    my_docs = []
    
    for doc in file_content:
        split_sent, split_sent_pos, split_sent_loc, tokens, pos, loc, full_sent, full_pos, full_loc, raw_sent = tokenize_and_stem(doc)   
        my_docs.append(split_sent)
    
    ### Get the TF-IDF matrix
    bog_docs = []
    for doc in my_docs:
        bog = [y for x in doc for y in x]
        bog_docs.append(bog)

    dictionary = corpora.Dictionary(bog_docs)
    corpus = [dictionary.doc2bow(text) for text in bog_docs]
    tfidf = models.TfidfModel(corpus)
    corpus_tfidf=tfidf[corpus]
    num_terms = len(corpus_tfidf.obj.idfs)
    tfidf_dense = matutils.corpus2dense(corpus_tfidf, num_terms)
    
    return(tfidf_dense, dictionary)




#####################
### START MAIN
#####################

# if __name__ == "__main__":
    
def main(fileList): #fileList contains the contents of the files, but not metadata
    for file in fileList:
        print(file)
    sys.exit()

    ## Parse input arguments
    parser = argparse.ArgumentParser(description='Parse a directory of files to identify top sentence phrases and cluster them to create topic clusters.')
    parser.add_argument('-i', metavar='inputfile', type=str, help='Path and name of input file list, listing the document names to process. One text file per document in .txt format is required.', required=True)
    parser.add_argument('-c', metavar='tfidfcorpus', type=str, help='Path and name of file containing a list of documents to use for creating the TF-IDF matrix. One text file per document in .txt format is required.', required=True)
    parser.add_argument('-v', metavar='wordVectorType', type=str, help='The type of word vector to use. Options are tfidf, svd, umap, pretrained, local.', required=False, default="tfidf")
    parser.add_argument('-b', metavar='w2vBinFile', type=str, help='The location and name of the pre-trained word2vec bin file.', required=False, default="")
    parser.add_argument('-o', metavar='outputdir', type=str, help='Path to the output directory where results should be saved., Default is current working directory.', required=False, default='./')
    parser.add_argument('-p', metavar='prefix', type=str, help='The unique output file name prefix to uniquely identify files.', required=False, default='analysis')
    parser.add_argument('-w', metavar='windowSize', type=int, help='An integer representing the window size for sentence phrases feature extraction. Default is 6.', required=False, default=6)
    parser.add_argument('-g', metavar='goldStandard', type=str, help='The path and file name of the gold standard file for the analyzed corpus.', required=False, default='')
    parser.add_argument('-t', metavar='threshold', type=float, help='The threshold to use for cutting the dendrogram to make clusters.', required=False, default=0)
    parser.add_argument('-d', metavar='dimensions', type=int, help='The number of dimentions to reduce the TF-IDF or WordVec to.', required=False, default=2)
    parser.add_argument('-s', metavar='scatter-plot', type=str, help='The scatter plots you would like output. Valid values are umap, svd, mds, all. Default = umap', required=False, default='umap')
    parser.add_argument('-u', metavar='umap-neighbors', type=int, help='The number of neighbors to use for UMAP dimension reduction. Default = 15', required=False, default=15)
    parser.add_argument('-m', metavar='distmetric', type=str, help='The distance metric to use for HAC clustering.  Can be any accepted by pdist: ‘braycurtis’, ‘canberra’, ‘chebyshev’, ‘cityblock’, ‘correlation’, ‘cosine’, ‘dice’, ‘euclidean’, ‘hamming’, ‘jaccard’, ‘kulsinski’, ‘mahalanobis’, ‘matching’, ‘minkowski’, ‘rogerstanimoto’, ‘russellrao’, ‘seuclidean’, ‘sokalmichener’, ‘sokalsneath’, ‘sqeuclidean’, ‘yule’.', required=False, default='cosine')
    
    parser.add_argument('--include_input_in_tfidf', help='Whether or not the input corpus should be included in the tf-idf matrix. If no then the average score across all documents is used for a words significance when generating phrases.', required=False, action="store_true")
    
    parser.add_argument('--output_labeled_sentences', help='Specify if you want the labeled sentence file saved.', required=False, action="store_true")
    parser.add_argument('--use_kmeans', help='Specify if you want Kmeans to be run as the clustering algorithm. You will be asked to input the number of clusters dynamically after elbow plot generation. The default clustering algorithm is hierarchical agglomerative clustering. By using Kmeans, the distance metric is required to be Euclidean Distance, and any other distance metric specification will be ignored.', required=False, action="store_true")
        
    args = parser.parse_args()

    ## args.i used to be "file_list.txt"
    ### import documents
    file_list = open(args.i).read().strip().split('\n')

    file_content = []
    for file_path in file_list:
        file = open(file_path, "r")
        text = file.read()
        file_content.append(text)    

    ### Pre-processing corpus
    my_docs = []
    my_tokens = []
    my_pos = []
    my_docs_pos = []
    my_docs_loc = []
    
    full_docs = []
    full_docs_pos = []
    full_docs_loc = []
    
    raw_sentences = []
    
    for doc in file_content:
        split_sent, split_sent_pos, split_sent_loc, tokens, pos, loc, full_sent, full_pos, full_loc, raw_sent = tokenize_and_stem(doc)   
        my_docs.append(split_sent)
        my_docs_pos.append(split_sent_pos)
        my_docs_loc.append(split_sent_loc)
        
        full_docs.append(full_sent)
        full_docs_pos.append(full_pos)
        full_docs_loc.append(full_loc)
        
        my_tokens = my_tokens + tokens
        my_pos = my_pos + pos
        
        raw_sentences.append(raw_sent)
    
    print("Number of Documents Loaded: " + str(len(my_docs)))
    
    ### Print out list of numbered sentences 
    if args.output_labeled_sentences:  
        outfile_name = args.o + "/" + args.p + "_DocumentSentenceList.txt"
        outfile = open(outfile_name, "w")
        outfile.write("Sentence ID\tSentence Text\n")
        for doc in range(0,len(raw_sentences)):
            for sent in range(0,len(raw_sentences[doc])):
                outfile.write("doc." + str(doc) + ".sent." + str(sent) + "\t" + raw_sentences[doc][sent] + "\n")


    ## Get the TF-IDF matrix
    if args.include_input_in_tfidf:
        #print("executing")
        tfidf_dense, dictionary = create_tfidf(args.i, args.c)
    else:
        tfidf_dense, dictionary = create_tfidf(args.c)

    print("Size of TF-IDF: " + str(len(tfidf_dense[0])) + " Docs, " + str(len(tfidf_dense)) + " Tokens")
    ### Using the TF-IDF matrix, get the top phrases
    ## first create a token dictionary out of the unprocessed file content
    token_dict = {}
    for docNum in range(0,len(file_content)):
        token_dict[docNum] = file_content[docNum]
    token_dict = {}
    for docNum in range(0,len(file_content)):
        token_dict[docNum] = file_content[docNum]
    
    ## next, identify the top phrases for each sentence
    ## In this phrases method I re-parse each sentence.  I don't think I need to do that but can't figure out how to get it working at the moment using the pre-parsed data.
    doc_top_phrases = []
    
    for doc_id in range(0,len(token_dict)):
        doc_top_phrases.append(get_top_phrases(doc_id, token_dict[doc_id], dictionary.token2id, tfidf_dense, args.w, args.include_input_in_tfidf))
    
    
    ### Create the Phrase Vector representation
    ### Creating the sentence vectors for each document
    
    doc_phrase_vecs = []

    ## Using the tf-idf matrix or SVD transform
    if args.v == "tfidf":
        doc_phrase_vecs = get_phrase_vec_tfidf(doc_top_phrases, dictionary, tfidf_dense)
        
    elif args.v == "svd":
        print("Calculating SVD transform of TF-IDF...")
        #U, s, vt = scipy.linalg.svd(tfidf_dense, full_matrices=False)
        #doc_phrase_vecs = get_phrase_vec_tfidf(doc_top_phrases, dictionary, U)
        svd =  TruncatedSVD(n_components = args.d, random_state = 42)
        tfidf_transf = svd.fit_transform(tfidf_dense)
        doc_phrase_vecs = get_phrase_vec_tfidf(doc_top_phrases, dictionary, tfidf_transf)
    
    elif args.v == "umap":
        print("Calculating UMAP transform of TF-IDF...")
        reducer = umap.UMAP(n_neighbors=args.u, min_dist=.1, metric='cosine', random_state=42, n_components = args.d)
        embed = reducer.fit_transform(tfidf_dense)
        doc_phrase_vecs = get_phrase_vec_tfidf(doc_top_phrases, dictionary, embed)
    
    elif args.v == "pretrained":
        model = w2v_pretrained(args.b)
        doc_phrase_vecs = get_phrase_vec_w2v(doc_top_phrases, model)
        print("W2V Length: " + str(len(doc_phrase_vecs[0][0])))
        
    elif args.v == "local":
        print("Training word vectors...")
        print("my_docs:"+str(len(my_docs)))
        model = w2v_from_corpus(file_content, my_docs)
        doc_phrase_vecs = get_phrase_vec_w2v(doc_top_phrases, model)
        print("W2V Length: " + str(len(doc_phrase_vecs[0][0])))
    
    else:
        print("ERROR")
        exit(1)



    ### Get Dissimilarity Matrix
    ## get the phrase vectors and the sentence IDs
    ## Any sentence with a phrase of value 0 (i.e. length 1) should get skipped
    just_phrase_vecs = []
    just_phrase_ids = []
    just_phrase_text = []
    total_phrase_num = 0

    ##loop through all 14 documents
    for doc in range(0, len(doc_phrase_vecs)): 
    
        ##loop through all sentences in the document
        for phrase in range(0, len(doc_phrase_vecs[doc])):
            #print(doc_top_phrases[doc][phrase])
            total_phrase_num = total_phrase_num + 1
            phrase_id = "doc." + str(doc) + ".sent." + str(phrase)
            this_phrase = doc_phrase_vecs[doc][phrase]
            this_text = doc_top_phrases[doc][phrase]
            #If the phrase was "none" then the phrase vector will be set to all zeros, so test for all zeros
            #when using tfidf or svd methods
            if args.v == 'tfidf' or args.v == 'svd' or args.v == 'umap':
                if any(numpy.zeros(len(this_phrase)) != this_phrase):
                    just_phrase_vecs.append(list(this_phrase))
                    just_phrase_ids.append(phrase_id)
                    just_phrase_text.append(this_text[1])
            #If using w2v and the phrase is none        
            else:
                if isinstance(this_phrase, numpy.ndarray):
                    just_phrase_vecs.append(list(this_phrase))
                    just_phrase_ids.append(phrase_id)
                    just_phrase_text.append(this_text[1])
                    
                           
    ## Include manually created baseline topics?
    #confident = list((get_vec("confident", dictionary, tfidf_dense) + get_vec("confidence", dictionary, tfidf_dense))/2)
    #overwhelmed = list(get_vec("overwhelmed", dictionary, tfidf_dense))
    #sys_issue = list(get_vec("system", dictionary, tfidf_dense) + get_vec("issue", dictionary, tfidf_dense) + get_vec("computer", dictionary, tfidf_dense))
    #patient_complexity = list(get_vec("patient", dictionary, tfidf_dense) + get_vec("complex", dictionary, tfidf_dense))
    #environment = list((get_vec("support", dictionary, tfidf_dense) + get_vec("supportive", dictionary, tfidf_dense))/2 + get_vec("help", dictionary, tfidf_dense))

    #just_phrase_vecs = just_phrase_vecs + [confident, overwhelmed, sys_issue, patient_complexity, environment]
    #just_phrase_ids = just_phrase_ids + ["Confident", "Overwhelmed", "System Issue", "Patient Complexity", "Supportive Environment"]
    #just_phrase_text = just_phrase_text + ["Confident", "Overwhelmed", "System Issue", "Patient Complexity", "Supportive Environment"]

    ## now calculate the distance matrix
    #dist = 1 - cosine_similarity(just_phrase_vecs)  ## Note: I tested the output of this method versus the pairwise distance method below and they output the exact same data, so are interchangable.
    
    
    
    if args.use_kmeans:
        
        if args.t == 0:
            print("Running Kmeans Analysis...")
            Ks = range(2, 100)
            score = [(silhouette_score(just_phrase_vecs, KMeans(i).fit(just_phrase_vecs).predict(just_phrase_vecs))) for i in Ks]
            fig = plt.plot(Ks, score)
            titlek = args.o+"/"+args.p+"_KmeansSilhouette_"+args.v+".png"
            plt.savefig(titlek, dpi=300)
        
            print("Please review the Silhouette Width Plot named " + titlek + " and enter the number of desired clusters. The maximum value of SW is " + str(max(score)) + " at " + str(Ks[score.index(max(score))]) + " clusters: " )
            num_clusters = input()
            print("Thank You. Now Clustering...")
        else:
            print("Threshold specified, skipping silhouette analysis...")
            num_clusters = args.t
        
        kmeans = KMeans(n_clusters=int(num_clusters), random_state=42).fit(just_phrase_vecs)
        cluster_assignments = kmeans.predict(just_phrase_vecs)
        
        dist = pairwise_distances(just_phrase_vecs, metric='euclidean')
        
        
    else:    
        ### HAC Clustering

        #cluster = AgglomerativeClustering(n_clusters=2, affinity='euclidean', linkage='ward')  
        #cluster.fit_predict(data_scaled)
        if args.t == 0:
            print("Running HAC Analysis...")
            if args.m == "cosine":
                dist = 1 - cosine_similarity(just_phrase_vecs)
            else:
                dist = pairwise_distances(just_phrase_vecs, metric=args.m)
                
            linkage_matrix = ward(dist)
        
            Hs = range(1, 100)
            if args.m == "euclidean":
                Hscore = [(silhouette_score(just_phrase_vecs, [x[0] for x in cluster.hierarchy.cut_tree(linkage_matrix, height=i)] )) for i in Hs]
            else:
                #Hscore = [(silhouette_score(just_phrase_vecs, AgglomerativeClustering(i, affinity = args.m, linkage="average").fit(just_phrase_vecs).labels_)) for i in Hs]
                Hscore = [(silhouette_score(just_phrase_vecs, [x[0] for x in cluster.hierarchy.cut_tree(linkage_matrix, height=i)] )) for i in Hs]
            
            fig = plt.plot(Hs, Hscore)
            titleh = args.o+"/"+args.p+"_HACSilhouette_"+args.v+".png"
            plt.savefig(titleh, dpi=300)
        
            print("Please review the Silhouette Width named " + titleh + " and enter the cutree height. The maximum value of SW is " + str(max(Hscore)) + " at " + str(Hs[Hscore.index(max(Hscore))]) + " cutree: ")
            num_clusters = int(input())
            print("Thank You. Now Clustering...")
        else:
            print("Threshold specified, skipping silhouette analysis...")
            if args.m == "cosine":
                dist = 1 - cosine_similarity(just_phrase_vecs)
            else:
                dist = pairwise_distances(just_phrase_vecs, metric=args.m)
            linkage_matrix = ward(dist)
            num_clusters = args.t
        #if args.m == "euclidean":
        #    hac = AgglomerativeClustering(n_clusters = num_clusters, affinity = "euclidean", linkage='ward').fit(just_phrase_vecs)
        #else:
        #    hac = AgglomerativeClustering(n_clusters = num_clusters, affinity = args.m, linkage='average').fit(just_phrase_vecs)
        
        cluster_assignments = [x[0] for x in cluster.hierarchy.cut_tree(linkage_matrix, height=num_clusters)] #hac.labels_
        
        
        
        
        #threshold = args.t
        #linkage_matrix = ward(dist) #define the linkage_matrix using ward clustering pre-computed distances

        #fig, ax = plt.subplots(figsize=(15, 200)) # set size
        #ax = dendrogram(linkage_matrix, orientation="right", labels=just_phrase_ids, color_threshold = threshold);

        #cutree = cluster.hierarchy.cut_tree(linkage_matrix, height=threshold)
        #cluster_assignments = [x[0] for x in cutree]
        #cluster_dict = dict(zip(list(set(cluster_assignments)), ["Cluster" + str(x) for x in list(set(cluster_assignments))]))

        #title = args.o+"/"+args.p+"_HAC_"+args.v+".png"
        #plt.savefig(title, dpi=300)
   





    ###### For visualization purposes we only use the Cosine Similarity
    dist = pairwise_distances(just_phrase_vecs, metric='cosine')

    df = pd.DataFrame(dict(label=just_phrase_ids, cluster=cluster_assignments, phrase=just_phrase_text)) 


    if args.s == "umap" or args.s == "all":
        ### Create and save UMAP Scatter Plot
        #create the reducer
        reducer = umap.UMAP(n_neighbors=args.u, min_dist=.1, metric='cosine', random_state=42)
        #fit and transform the data
        embedding = reducer.fit_transform(dist)
        #create dataframe with metadata
        df1 = pd.DataFrame(dict(label=just_phrase_ids, UMAP_cluster=cluster_assignments, phrase=just_phrase_text, x=embedding[:, 0], y=embedding[:, 1])) 
    
       
        
        #create interactive plot
        fig1 = px.scatter(df1, x="x", y="y", hover_name="label", color="UMAP_cluster", hover_data=["phrase", "label","UMAP_cluster"], color_continuous_scale='rainbow')
        title1 = args.o+"/"+args.p+"_UMAP_"+args.v+".png"
        plotly.offline.plot(fig1, filename=title1+'.html')
        df1.to_pickle(title1+".pkl")


    ####DF1 is the file with the data we should return

    
    if args.s == "mds" or args.s == "all":

        ### Create the MDS scatter plot and save
        MDS()
        # two components as we're plotting points in a two-dimensional plane
        # "precomputed" because we provide a distance matrix
        # we will also specify `random_state` so the plot is reproducible.
        mds = MDS(n_components=2, dissimilarity="precomputed", random_state=42)
        pos = mds.fit_transform(dist)  # shape (n_components, n_samples)
        xs, ys = pos[:, 0], pos[:, 1]

        #create data frame that has the result of the MDS plus the cluster numbers and titles
        df2 = pd.DataFrame(dict(x=xs, y=ys, MDS_cluster=cluster_assignments, label=just_phrase_ids, phrase=just_phrase_text)) 

        #create interactive plot
        fig2 = px.scatter(df2, x="x", y="y", hover_name="label", color="MDS_cluster", hover_data=["phrase", "label","MDS_cluster"], color_continuous_scale='rainbow')
        title2 = args.o+"/"+args.p+"_MDS_"+args.v+".png"
        plotly.offline.plot(fig2, filename=title2+'.html')
    
    if args.s == "svd" or args.s == "all":
        ### Create and save SVD Scatter Plot
        svd2d =  TruncatedSVD(n_components = 2, random_state = 42).fit_transform(dist)
    
        #create dataframe with metadata
        df3 = pd.DataFrame(dict(label=just_phrase_ids, SVD_cluster=cluster_assignments, phrase=just_phrase_text, x=svd2d[:, 0], y=svd2d[:, 1])) 
    
        #create interactive plot
        fig3 = px.scatter(df3, x="x", y="y", hover_name="label", color="SVD_cluster", hover_data=["phrase", "label","SVD_cluster"], color_continuous_scale='rainbow')
        title3 = args.o+"/"+args.p+"_SVD_"+args.v+".png"
        plotly.offline.plot(fig3, filename=title3+'.html')
    
    
    

    

    
    ### Extract full sentence list from each cluster for LDA analysis
    print("Total Number of Sentences: " + str(total_phrase_num))
    print("Number of Clustered Sentences:" + str(len(df["label"])))
    print("Number of Clusters: " + str(len(numpy.unique(df["cluster"]))))
    
    num_clusters = set(df["cluster"])
    doc_names = file_list

    cluster_topics = []
    cluster_sentences = []
    cluster_docs = []

    for c in num_clusters:
        topic_labels = list(df[df["cluster"]==c]["label"])
        
        
        sent_coords = [[int(x.split(".")[1]), int(x.split(".")[3])] for x in topic_labels if len(x.split(".")) > 1 ]
    
        ## sent_coords has each element formatted as [doc number, sentence number]
        cluster_terms = []
        for s in sent_coords:
            tmp_term = []
            sent = my_docs[s[0]][s[1]]
            pos = my_docs_pos[s[0]][s[1]]
            for tidx in range(0,len(sent)):
                #if pos[tidx][1] in ["JJ","JJR", "JJS", "RB", "RBR", "RBS", "NN", "NNP", "NNPS", "NNS"]:
                tmp_term.append(sent[tidx])
            cluster_terms.append(tmp_term)
    
        cluster_topics.append(cluster_terms)
    
    
    ### Perform LDA analysis
    from gensim import corpora, models, similarities

    main_cluster_topics = []

    for r in range(0,len(cluster_topics)):
        #Latent Dirichlet Allocation implementation with Gensim
        dictionary = corpora.Dictionary(cluster_topics[r])
        #dictionary.filter_extremes(no_below=1, no_above=0.8)
        #print(dictionary)

        corpus = [dictionary.doc2bow(text) for text in cluster_topics[r]]
        #%time lda = models.LdaModel(corpus, num_topics=6, id2word=dictionary, update_every=60, chunksize=10000, passes=100)
        lda = models.LdaModel(corpus, num_topics=1, id2word=dictionary)

        topics_matrix = lda.show_topics(formatted=False, num_words=10)
        topics_ary = []
        for m in range(0,len(topics_matrix)):
            this = []
            for i in topics_matrix[m][1]:
                this.append(i[0])
            topics_ary.append(this)
        main_cluster_topics.append(topics_ary[0])
        #print("Cluster " + str(r) + " Keywords: " + str(topics_ary[0]))
    
    
    ### Print and Save Results
    raw_sent = []
    for doc in file_content:
        tmp = []
        sents = nltk.sent_tokenize(doc)
        for sent in sents:
            tmp.append(sent)
        raw_sent.append(tmp)

    title = args.o+"/"+args.p+"_TopicClusterResults_"+args.v+".txt" 
    outfile = open(title, "w")

    print("outfile: " + title)

    outfile.write("Cluster\tDocument.Num\tDocument.Name\tSentence.Num\tSentence.Text\nPhrase.Text")
    ## for each cluster
    for c in range(0,len(main_cluster_topics)):
        topic_labels = list(df[df["cluster"]==c]["label"])
        sent_coords = [[int(x.split(".")[1]), int(x.split(".")[3])] for x in topic_labels if len(x.split(".")) > 1]
        outfile.write("Cluster " + str(c) + " Keywords: " + ', '.join(main_cluster_topics[c]) + "\n")
    
        ## sent_coords has each element formatted as [doc number, sentence number]
        for s in sent_coords:
            if len(s) > 1:
                outfile.write(str(c) + "\t" + str(s[0]) + "\t" + doc_names[s[0]] + "\t" + str(s[1]) + "\t" + 
                          raw_sent[s[0]][s[1]] + "\t" + str(doc_top_phrases[s[0]][s[1]]) +"\n")
            else:
                outfile.write(str(c) + "\t" + str(s) + "\t" + str(s) + "\t" + str(s) + "\t" + 
                          str(s) + "\t" + str(s) +"\n")                  
    outfile.close()


    
    
    
    
    
    
    
    
    
    #### Calculate the Precision, Recall, and F1 if there is a gold file passed in.
    
    if args.g != '':
        gold_list = open(args.g).read().strip().split('\n')

        gold_list = [x.split('\t') for x in gold_list]
    
        ids = [x[0] for x in gold_list]
        group = [x[1] for x in gold_list]
        baseline = list(numpy.unique(group))
        
        gold_clusters = {}
        for b in baseline:
            members = []
            for i in range(0,len(ids)):
                if group[i] == b:
                    members.append(ids[i])
            gold_clusters[b] = members

        closest_to_gold = {}
        for g in gold_clusters.keys():
            max_overlap = 0
            max_overlap_cluster = -1
            for c in list(numpy.unique(df.cluster)):
                overlap = len(set(gold_clusters[g]).intersection(set(df.label[df.cluster==c])))
                if overlap > max_overlap:
                    max_overlap = overlap
                    max_overlap_cluster = c
            closest_to_gold[g] = max_overlap_cluster
    
        eval_output = args.o + "/" + args.p + "_EvaluationResults.txt"
        eout = open(eval_output, 'w')
        eout.write("Gold Concept\tGold Concept Members\tClosest Cluster Num\tClosest Cluster Members\tTP\tFP\tFN\tP\tR\tF1\n")
        
        dash = '-' * 70
        #print("Gold Concept\t\tClosestC\t\tTP\t\tFP\t\tFN\t\tP\t\tR\t\tF1\n")
        print(dash)
        print('{:^24s}{:^10s}{:^4s}{:^4s}{:^4s}{:^8s}{:^8s}{:^8s}'.format("Gold Concept","ClosestC","TP","FP","FN","P","R","F1"))
        print(dash)
        for g in gold_clusters.keys():
            ## we only want to do these calculations on sentences that are in the gold file.
            ## get closest cluster list of sentences that are ONLY in gold
            closest = set(df.label[df.cluster==closest_to_gold[g]]).intersection(set(ids))
            gold = set(gold_clusters[g])
            #print("Closest Cluster is " + str(closest_to_gold[g]) + ":  " + str(closest))
            #print("Gold Cluster: " + str(gold))
            
            TP = len(gold.intersection(closest))
            FP = len(closest - gold)
            FN = len(gold - closest)
            #FN results is negative when is should not be
            #print("\nBaseline Group: " + g + "  TP: " + str(TP)+ " FP: " + str(FP)+ " FN: " + str(FN) + "\n")
            
            P = round(TP/(TP+FP), 3)
            R = round(TP/(TP+FN), 3)
            F1 = round(2*((P*R)/(P+R)), 3)
    
            #print("Precision: " + str(P) + " Recall: " + str(R) + " F1: " + str(F1) + "\n\n")
            
            
            
            eout.write(str(g) + "\t" + str(gold) + "\t" + str(closest_to_gold[g]) + "\t" + str(closest) + "\t" + str(TP) + "\t" + str(FP) + "\t" + str(FN) + "\t" + str(P) + "\t" + str(R) + "\t" + str(F1) + "\n")
            #print( + "\t\t" + str(closest_to_gold[g]) + "\t\t" + str(TP) + "\t\t" + str(FP) + "\t\t" + str(FN) + "\t\t" + str(P) + "\t\t" + str(R) + "\t\t" + str(F1))
            print('{:<24s}{:^10s}{:^4s}{:^4s}{:^4s}{:^8s}{:^8s}{:^8s}'.format(str(g),str(closest_to_gold[g]),str(TP),str(FP),str(FN),str(P),str(R),str(F1)))
        print(dash)

################
## END MAIN
################


