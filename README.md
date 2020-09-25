# Table of Contents

- [Introduction](#intro)
- [Installation](#install)
  * [End-Users](#enduser)
  * [Developers](#developers)
- [TopEx Overview](#overview)
- [Usage Instructions](#usage)
  * [1: Importing Document Corpus or Previous Analysis File](usage1)
    + [Import Document Corpus](#usage11)
    + [Import Previous Analysis](#usage12)
  * [2: Setting Analysis and Visualization Parameters](#usage2)
    + [TF-IDF Corpus File Input](#usage11)
    + [Sentence Embedding Parameters](#usage12)
    + [Sentence Clustering Parameters](#usage13)
    + [Visualization Parameters](#usage14)
  * [3: Run Analysis](#usage3)
  * [4: Explore and Export Results](#usage4)
    + [Scatter Plot](#usage41)
    + [Word Cloud](#usage42)
- [Acknowledgements](#thanks)
- [References](#paper)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents partially generated with markdown-toc</a></i></small>



# Introduction <a name="intro">

TopExApp provides a graphical user interface for the [TopEx Python library](https://pypi.org/project/topex/), and is an application designed for the exploration of topics in large sets of text. Originally designed to identify common challenges experienced by acting interns through their reflective writing responses [(Olex et al 2020)](#paper), this application can also be used for the exploration of topics in any set of texts.

# Installation <a name="install">
TopExApp runs as a web app within a Docker container and can be run as an end-user, or set up to run for UI development.  Any changes to the TopEx library must be made through the [TopEx python package GitHub repository](https://github.com/VCUWrightCenter/TopEx).

## End-Users <a name="enduser">

### Requirements

    - [Docker Desktop](https://www.docker.com/products/docker-desktop) or [Docker Toolbox/Docker Machine](https://docs.docker.com/toolbox/toolbox_install_mac/) for advanced Docker users.
    -- Mac OSX 10.13 or higher with 2010 hardware or newer required. See specifications [here](https://docs.docker.com/docker-for-mac/install/).
    -- Widnows 10 or higher required. See specifications [here](https://docs.docker.com/docker-for-windows/install/).
    - Internet Browser

### Install Instructions

1) Install Docker Desktop for Mac or Windows from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).

2) Download the TopExApp GitHub Repository:
    
    > git clone https://github.com/VCUWrightCenter/TopExApp.git

3) Navigate into the Git Repo using the terminal/command line.

4) Build the TopExApp Docker container (Note: this can take several minutes to complete):
    
    > docker-compose up --build

5) In an internet browser go to the follwoing to start TopEx:

    > http://localhost:3000

### Update Instructions

When an updated version of TopExApp is released, navigate to the TopExApp GitHub repository using your terminal and download the updated application using:

 > git pull

Then open the Docker Desktop Dashboard and restart the TopEx container.

## Developers <a name="developers">

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

# TopEx Overview <a name="overview">

The TopExApp was built as a graphical user interface for the TopEx python package (link to GitHub).  This application allows users to explore the topics present in a set of documents without having to program or be an NLP expert.  The algorithms behind TopEx are described in detail in [(Olex et al 2020)](#paper).  The 20,000 foot view is that TopEx assumes each sentence in a document discusses a different topic.  Sentences are summarized by extracting the most informative phrase for each sentence. These phrases are then embedded into a numerical representation and clustered into groups of similar phrases.  Sentences discussing similar topics should have numerically similar representations and be grouped in the same cluster.  A topic analysis is then run on each cluster to identify the key words associated with that group of sentences.  Clustering results are visualized as a scatter plot where each dot represents one sentence, or as a word cloud to aid in identifying which word are the most frequent in a given group a sentences.

# Usage Instructions <a name="usage">

The general workflow for TopEx is as follows:

 1) Import document corpus or previous analysis
 2) Set algorithm and visualization parameters
 3) Run analysis
 4) Explore results

## 1: Importing Document Corpus or Previous Analysis File <a name="usage1">

### Import Document Corpus <a name="usage11">
 
#### Clustering Corpus (Required)
 
Document corpora are required to be saved in a single directory as text (.txt) files for import into TopEx.  During import you will point to the directory where these files are and not to the individual files.  

In TopEx, you are required to submit a Clustering Corpus.  This is the set of documents containing the sentences you want analyzed and clustered.  To do this follow these steps:     

 1) Select the "File Manager" tab in TopEx.
 2) Click the "Upload docs to cluster" button.
 3) Navigate to the directory with the corpus.
 4) Select the directory and the click "Upload".
 
A Clustering Corpus is required, and must contain a minimum of 3 documents, however, a larger set is recommended.  By default, the imported Clustering Corpus is automatically used as the Background Corpus as well.  The Background Corpus is the set of documents used to create the TF-IDF matrix that contains the distribution of each word across a set of documents.  This matrix is used in two ways by TopEx: 1) Identification of the most informative phrase for each sentence to be used for sentence representation. 2) Creation of word embeddings, which generate the final sentence embeddings (i.e. numerical sentence representations) for clustering.  Thus, the source corpus of the TF-IDF is very important as it is the backdrop for TopEx.

#### Expansion Corpus (Optional)

In TopEx you have the option of expanding the set of documents used to create the background TF-IDF matrix, which we call the Expansion Corpus.  Users are given a choice as to what documents create the TF-IDF matrix: 1) Use only the Clustering Corpus. 2) Use the Clustering Corpus plus additional documents (i.e. the Expansion Corpus). 3) Use a completely different corpus.  TopEx was designed to explore niche corpora that may have different focal points or properties than general domain text collections like Wikipedia.  For this usage, users will want to either use only the Clustering Corpus for the TF-IDF, or use the Clustering Corpus plus Expansion Corpus.  If users want to compare their corpus to a larger more general domain, then they may wish to import a separate corpus for TF-IDF creation. 

To include an Expansion Corpus in your analysis, make sure all of the documents are again saved in a single directory as text files.  Then do the following: 

 1) Select the "File Manager" tab in TopEx.
 2) Click the "Background Corpus Expansion" button.
 3) Navigate to the directory with the expansion corpus.
 4) Select the directory and the click "Upload".
 
These documents will now be appended to the list of docuemnts in the Clustering Corpus to create the Background Corpus for TF-IDF creation.  Note: Any documents uploaded as the Expansion Corpus are NOT clustered.  They are only used for creating the TF-IDF matrix.

Finally, you have the option of using one corpus for clustering and a completely differnt corpus as the Background Corpus.  To do this, follow the directions for uploading the Clustering and Expansion Corpora above, then uncheck the "include input in tfidf" checkbox.  This will ensure only the Expansion Corpus is used as the background.
    
### Import Previous Analysis <a name="usage12">

Analyses can be saved into a TopEx formatted file.  If you need to import an analysis file do the following:

 1) Select the "Import/Export" tab in TopEx.
 2) Click on "Upload file for import".
 3) Navigate to the TopEx formatted file and click "Open".

## 2: Setting Analysis and Visualization Parameters <a name="usage2">

TopEx has a variety of parameters that can be set to customize your analysis.  There parameters are associated with how sentences are represented, how clustering is performed, and how the scatter plot is visualized.  To change the default parameters go to the "Cluster" tab in TopEx.  The list below explains what each parameter's function is.

### Sentence Embedding Parameters <a name="usage12">

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

#### Dimensions
Determines the number of dimensions a word embedding will be for sentence representation and clustering.  Default is 200 or one less than the total number of documents, whichever is smaller.  This must be set no larger than the total number of documents!  For example, if you uploaded 100 documents your dimensions cannot be greater than 99.  Additionally, you must have at least 3 documents minimum.

### Sentence Clustering Parameters <a name="usage13">
The sentence clustering parameters control how sentence embeddings are grouped together. By default, the K-means clustering algorithm is used, which requires Euclidean distance as the distance metric, to group sentences into 20 clusters.

#### Clustering Method
Determines the method used for clustering setnences. Options are:

* **kmeans:** Requires a pre-specified number of cluster to create. (Default)
* **hac:** Hierarchical Agglomerative Clustering requires a height at which to cut the generated dendrogram to create distinct clusters.

#### Clustering Distance Metric:
Specifies the method used for determining sentence similarity. Options include:

* **euclidean:** Uses Euclidean distance, which primarily considered similar magnitude of vector elements. Is required for K-Means clustering method. (Default)
* **correlation:** Calculates the absolute value of Pearson's correlation coefficient, which primary looks at similar patterns of vector elements and ignores magnitude.
* **cosine:** Treats embeddings as vectors and calculated the angle between the two vectors. This metric is frequently used in NLP.

#### Threshold
The threshold is either 1) the number of clusters, k, for K-Means clustering, or 2) the height of the dendrogram to cut in HAC.  Note that if using k-means you will get exactly k clusters; however, using HAC may take sone trial and error as the max height of the tree changes with each data set.  Default is set to 20, which is reasonable for both methods, but it is recommended all users should play with this parameter to identify the optimal value for their corpus.

### Visualization Parameters <a name="usage14">
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

#### UMAP Neighbors
If choosing UMAP for visualization, you have the option of selecting the number of neighbors UMAP uses for its dimension reduction algorithm.  Defulat is set to 15, which is generally a good choice.  Lower values will create more tightly packed clusters, and larger numbers will create larger more spread out clusters on the scatter plot.

## 3: Run Analysis <a name="usage3">
Once all of the parameters have been set you are ready to run your analysis.  Navigate back over to the "File Manager" tab and hit "Run".  If you decide you want to exclude some files from a particular run, you can uncheck them in the File Manager tab before hitting "run" and they will be excluded.

## 4: Explore and Export Results <a name="usage4">
Results are shown in the center window as a scatter plot or word cloud.  

### Scatter Plot <a name="usage41">
In the scatter plot, each sentence that was clustered is represented by a dot.  Clicking on the dots in the scatter plot will bring up sentence and cluster information in the right most panel, including the key topic words for each cluster.  A tab delimited text file that can be opened in Excel is also saved that contains the cluster and topic analysis results.  To save the figures as images you can click on the "Save as PNG" buttons in the reight most panel.  Additionally, you can download the raw data for the scatter plot using the "Download Raw Data" button in the center console.  

### Word Cloud <a name="usage42">
The word cloud tab shows the frequency of the top words in each cluster if sentences.  Larger words are more frequent.  This allows on to get a quick view of the terms used most frequently in the cluster.  Similar download options are avaliabel for the word cloud as for the scatter plot.

### Reclustering <a name="usage43">
Generally, finding the best number of clusters is a manual processes or trial and error.  For large data sets that take some time to run it is not feasible to re-run the analysis with different clustering parameters.  The "Re-Cluster" tab offers a quick way to look at different numbers of clusters without re-running the entire NLP pipeline.  When using HAC, this tab will not re-calulate anything, it will simply move the threshold to identify a new set of clusters based on the current cluster information.  For Kmeans clustering, the data will be re-clustered, but the NLP pipeline will not be re-run.  Options for re-clustering are as follows:
 
 * **Height or K:** If HAC clustering, then this is the height at which to cut the dendrogram to obtain dicrete clusters. If using K-Means, then this is the number of clusters to group the data into.
 * **# of Topic Words Per Cluster:** After clustering is done, the topic analysis of the sentences in each cluster are re-calculated.  A single topic is returned for each cluster that contains N words describing the topic.  This setting tells TopEx how many summary words you want to describe the cluster topic.
 * **Minimum Cluster Size:** This setting is for visualization only.  To clean up the scatter plot you can choose to have only clusters larger than a specific size shown in the graphic.  The smaller clusters that are removed from teh scatter plot are still present in the data export of the results.
 

# Acknowledgements <a name="thanks">

TopExApp (previously MedTop) was initially developed as a web app through the 2019-2020 CapStone program by Seniors in VCU's Computer Science Department under the supervision of Dr. Bridget McInnes and Amy Olex. We wish to thank Sean Kotrola, Aidan Myers, and Suzanne Prince for their excellent work in getting this application up and running! Here are links to the team's CapStone [Poster](https://drive.google.com/file/d/1TGCaM7oXPxFwEJ5B5_nrGZqNnUetWPFB/view) and [Application Demonstration](https://drive.google.com/file/d/1xRYlLpiYnCnI9Pdi6vbE4eTDUu0e09qB/view). 

# References <a name="paper">

Olex A, DiazGranados D, McInnes BT, and Goldberg S. Local Topic Mining for Reflective Medical Writing. Full Length Paper. AMIA Jt Summits Transl Sci Proc 2020;2020:459–68. PMCID: [PMC7233034](https://www-ncbi-nlm-nih-gov.proxy.library.vcu.edu/pmc/articles/PMC7233034/)
