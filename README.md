# Overview

TopExApp provides a graphical user interface for the [TopEx Python library](https://pypi.org/project/topex/), and is an application designed for the exploration of topics in large sets of text. Originally designed to identify common challenges experienced by acting interns through their reflective writing responses [(Olex et al 2020)](#paper), this application can also be used for the exploration of topics in any set of texts.

# Installation
TopExApp runs as a web app within a Docker container and can be run as an end-user, or set up to run for UI development.  Any changes to the TopEx library must be made through the [TopEx python package GitHub repository](https://github.com/VCUWrightCenter/TopEx).

## End-Users:

### Requierments:

    - Docker Desktop [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
    - Internet Browser

### Instructions:

1) Install Docker Desktop for Mac or Windows from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).

2) Download the TopExApp GitHub Repository:
    
    > git clone https://github.com/VCUWrightCenter/TopExApp.git

3) Navigate into the Git Repo using the terminal/command line.

4) Build the TopExApp Docker container:
    
    > docker-compose up --build


## Developers

### Requirements 
- Python 3.8
- node 6.9.0

### Run Script
From the command line, run the following:
    
    ~/api> virtualenv env

    ~/api> env\Scripts\activate (Windows)

    ~/api> source env/bin/activate (Mac/Linux)

    ~/api> pip install -r requirements.txt

    ~/api> python -m nltk.downloader all

    ~/api> flask run 

    ~/web> npm install

    ~/web> npm start

# TopEx Overview

The TopExApp was built as a graphical user interface for the TopEx python package (link to GitHub).  This application allows users to explore the topics present in a set of documents without having to program or be an NLP expert.  The algorithms behind TopEx are described in detail in [(Olex et al 2020)](#paper).  The 20,000 foot view is that TopEx assumes each sentence in a document discusses a different topic.  Sentences are then embedded into a numerical representation and clustered.  Sentences discussing similar topics should have numerically similar representations and be grouped in the same cluster.  A topic analysis is them run on each cluster to identify the key words associated with that group of sentences.  Clustering results are visualized as a scatter plot where each dot represents one sentence, or as a word cloud to aid in identifying which word are the most frequent in a given group a sentences.

# Usage Instructions

The general workflow for TopEx is as follows:

 1) Import document corpus or previous analysis
 2) Set algorithm and visualization parameters
 3) Run analysis
 4) Explore results

## 1: Importing Document Corpus or Previous Analysis File

### Import Document Corpus

To import documents into TopEx, each document must be saved as a text file and all text files should be saved in a single directory with no other files.  

 1) Select the "File Manager" tab in TopEx.
 2) Click the "Upload files for processing" button.
 3) Navigate to the directory with the corpus.
 4) Select the directory and the click "Upload".
    
### Import Previous Analysis

Analyses can be saved into a TopEx formatted file.  If you need to import an analysis file do the following:

 1) Select the "Import/Export" tab in TopEx.
 2) Click on "Upload file for import".
 3) Navigate to the TopEx formatted file and click "Open".

## 2: Setting Analysis and Visualization Parameters

TopEx has a variety of parameters that can be set to customize your analysis.  There parameters are associated with how sentences are represented, how clustering is performed, and how the scatter plot is visualized.  To change the default parameters go to the "Parameters" tab in TopEx.  The list below explains what each parameter's function is.

### TF-IDF Corpus File Input

The TF-IDF matrix is used in two ways by TopEx: 1) Identification of most informative phrase for each sentence to be used for sentence representation. 2) Creation of word embeddings, which generate the final sentence embeddings (i.e. numerical sentence representations) for clustering.  Thus, the source corpus of the TF-IDF is very important as it is the backdrop for TopEx.  

Users are given a choice as to what documents create the TF-IDF matrix: 1) Use only the input corpus. 2) Use a completely different corpus. 3) Use the input corpus PLUS additional text documents (like the seed topics from [(Olex et al 2020)](#paper)).  TopEx was designed to explore niche corpora that may have different focal points or properties than general domain text collections like Wikipedia.  For this usage, users will want to either 1) use only the input documents for the TF-IDF, or 2) use the input documents PLUS some additional documents.  If users want to compare their corpus to a larger more general domain, then they may wish to import a separate corpus for TF-IDF creation.  Below are the step to follow for each of these 3 methods.

#### 1) Only use input corpus
No parameters need to be change to use the input corpus for TF-IDF creation as this is the default behavior.  Note that this is ok if you have a good sized corpus of over 50 or more documents; however, you may see odd behavior with fewer documents, such as all sentences in a document cluster together.  It is recommended that small corpora be supplemented with a larger set of documents for TF-IDF creation (see # 2 below).

#### 2) Use input corpus plus additional documents
To import additional documents for TF-IDF creation, select the "TFIDF Corpus File Input" button at the top of the Parameters tab.  Navigate to and select the directory with these text files.  Then hit "Upload".  Note that you must have all documents in separate text files and located in a single folder.  Additionally, once a TF-IDF corpus has been uploaded it cannot be removed and the page must be re-set.  This functionality is being improved upon for future releases.

#### 3) Use a different corpus for TF-IDF
To only use a different corpus for TF-IDF creation and NOT include the input corpus in the calculations, follow the directions for #2 above, then scroll to the bottom of the Parameters tab and UNCHECK the box for "Include input in tfidf?"

### Sentence Embedding Parameters

These parameters control how a sentence is embeded into a numerical vector.  By default, A TF-IDF matrix is created using all documents in the corpus. This TF-IDF is used to reduce sentences to their most informative 6 word phrase (see [Olex et al 2020](#paper) for details).  The TF-IDF is then compressed down to 200 (or the number of documents minus 1) dimensions using Singular Value Decomposition (SVD) to reduce sparsity.  The SVD row vectors associated with each word in the sentence phrase is summed to generate the sentence embedding.

#### Include sentiment?
The calculation to identify the most informative phrase of a sentence includes a weighting factor for words associated with positive or negative sentiment so that these words are more likely to end up in the chosen phrase to represent a sentence. By default, this sentiment weighting factor is included inthe calculation. To disable this feature and ignore the sentiment of words, UNCHECK the box beside "Include sentiment?".  Including sentiment in the phrase calculation is task specific.  In the use case discussed in [(Olex et al 2020)](#paper) words with sentiment were more likely to elucidate challenges faced by medical students during their intership; however, if exploring texts discussing medical symptoms or some other factual corpus, sentiment may not be as important, or even detrimental to identifying the most informative phrase with which to represent a sentence.

#### Window Size
Controls how many words are in the most informative phrase for each sentence. If a sentence is too short to contain a phrase of this length, then it is ignored and removed from analysis.  Default value is 6, and was determined base on the 1/2 time the average length of a sentence in the Acting Inter corpus from [Olex et al 2020](#paper).  

#### Embedding Method: SVD
Dictates the method used to obtain word vectors for each of the words in the selected phrase for each sentence.  Options are:

* **tfidf:** No compression performed. The raw TF-IDF matrix is used to get word vectors. Note: the "Dimensions" parameter is ignored.
* **svd:** Singular Value Decomposition of the TF-IDF matrix into the specific number of dimensions. (Default)
* **umap:** Compression done by the UMAP algorithm into the specified number of dimensions.
* **pretrained:** Option allows you to upload pre-trained word vectors, such as those from Word2Vec. Must also include a BIN file containing the embeddings. Extracts word embeddings to the specified dimensions.

#### Dimensions: 200
Determines the number of dimensions a word embedding will be for sentence representation and clustering.  Default is 200 or one less than the total number of documents, whichever is smaller.  This must be set no larger than the total number of documents!  For example, if you uploaded 100 documents your dimensions cannot be greater than 99.  Additionally, you must have at least 3 documents minimum.

### Sentence Clustering Parameters
The sentence clustering parameters control how sentence embeddings are grouped together. By default, the K-means clustering algorithm is used, which requires Euclidean distance as the distance metric, to group sentences into 20 clusters.

#### Clustering Method: Kmeans
Determines the method used for clustering setnences. Options are:

    * kmeans: Requires a pre-specified number of cluster to create. (Default)
    * hac: Hierarchical Agglomerative Clustering requires a height at which to cut the generated dendrogram to create distinct clusters.

#### Clustering Distance Metric: Euclidean
Specifies the method used for determining sentence similarity. Options include:

* **euclidean:** Uses Euclidean distance, which primarily considered similar magnitude of vector elements. Is required for K-Means clustering method. (Default)
* **correlation:** Calculates the absolute value of Pearson's correlation coefficient, which primary looks at similar patterns of vector elements and ignores magnitude.
* **cosine:** Treats embeddings as vectors and calculated the angle between the two vectors. This metric is frequently used in NLP.
* **others:** There are many other otions listed in the interface for distance metrics.

#### Threshold
The threshold is either 1) the number of clusters, k, for K-Means clustering, or 2) the height of the dendrogram to cut in HAC.  Note that if using k-means you will get exactly k clusters; however, using HAC may take sone trial and error as the max height of the tree changes with each data set.  Default is set to 20, which is reasonable for both methods, but it is recommended all users should play with this parameter to identify the optimal value for their corpus.

### Visualization Parameters
These parameters control how the scatter plot is created for visualization of the clusters.  The scatter plot data is a compression of the clustering distance matrix down to 2 dimensions.  It is NOT a direct vizualization of the compressed/raw TF-IDF.  Thus, the user may choose a different compression method for visualization.  Through many trials, we have found that UMAP using a cosine distance metric generates good visualizations that generally correspond to sentence clusters found using SVD compression; thus, UMAP is the default; however, other options can be explored.  Note, compression is always to 2 dimensions for 2-D scatter plot visualization.

#### Visualization Method
The method used to compress the distance matrix from the clustering step.  Options are:

* **umap:** UMAP compression into 2 dimensions (Default)
* **svd:** Singular Value Decomposition compression into 2 dimensions
* **tsne:** t-SNE reduction into 2 dimensions, method used in some NLP circles
* **mds:** Multidimensions Scaling reduction into 2 dimensions, a non-linear dimension reduction algorithm
    
#### Visualization Distance Metric
Users have the option to re-calculate the distance matrix using a different distance metric than was used for clustering.  Interestingly, using Euclidean for clustering and Cosine for visualization produces good visuals of the data.

* **euclidean:** Uses Euclidean distance, which primarily considered similar magnitude of vector elements. Is required for K-Means clustering method. 
* **correlation:** Calculates the absolute value of Pearson's correlation coefficient, which primary looks at similar patterns of vector elements and ignores magnitude.
* **cosine:** Treats embeddings as vectors and calculated the angle between the two vectors. This metric is frequently used in NLP. (Default)
* **others:** There are many other otions listed in the interface for distance metrics.
    
#### UMAP Neighbors
If choosing UMAP for visualization, you have the option of selecting the number of neighbors UMAP uses for its dimension reduction algorithm.  Defulat is set to 15, which is generally a good choice.  Lower values will create more tightly packed clusters, and larger numbers will create larger more spread out clusters on the scatter plot.

## 3: Run Analysis
Once all of the parameters have been set you are ready to run your analysis.  Navigate back over to the "File Manager" tab and hit "Run".  If you decide you want to exclude some files from a particular run, you can uncheck them in the File Manager tab before hitting "run" and they will be excluded.

## 4: Explore and Export Results
Results are shown in the center window as a scatter plot or word cloud.  

### Scatter Plot
In the scatter plot, each sentence that was clustered is represented by a dot.  Clicking on the dots in the scatter plot will bring up sentence and cluster information in the right most panel, including the key topic words for each cluster.  A tab delimited text file that can be opened in Excel is also saved that contains the cluster and topic analysis results.  To save the figures as images you can click on the "Save as PNG" buttons in the reight most panel.  Additionally, you can download the raw data for the scatter plot using the "Download Raw Data" button in the center console.  

### Word Cloud
The word cloud tab shows the frequency of the top words in each cluster if sentences.  Larger words are more frequent.  This allows on to get a quick view of the terms used most frequently in the cluster.  Similar download options are avaliabel for the word cloud as for the scatter plot.



# Acknowledgements

TopExApp (previously MedTop) was initially developed as a web app through the 2019-2020 CapStone program by Seniors in VCU's Computer Science Department under the supervision of Dr. Bridget McInnes and Amy Olex. We wish to thank Sean Kotrola, Aidan Myers, and Suzanne Prince for their excellent work in getting this application up and running! Here are links to the team's CapStone [Poster](https://drive.google.com/file/d/1TGCaM7oXPxFwEJ5B5_nrGZqNnUetWPFB/view) and [Application Demonstration](https://drive.google.com/file/d/1xRYlLpiYnCnI9Pdi6vbE4eTDUu0e09qB/view). 

# References <a name="paper">

Olex A, DiazGranados D, McInnes BT, and Goldberg S. Local Topic Mining for Reflective Medical Writing. Full Length Paper. AMIA Jt Summits Transl Sci Proc 2020;2020:459–68. PMCID: [PMC7233034](https://www-ncbi-nlm-nih-gov.proxy.library.vcu.edu/pmc/articles/PMC7233034/)
