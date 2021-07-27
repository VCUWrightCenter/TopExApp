# TopEx Tutorial: Exploring COVID-19 Tweets

Detailed usage instructions can be found in the [TopEx User's Manual](https://github.com/VCUWrightCenter/TopExApp/docs/manual.md).

This tutorial uses a random sample of public Tweets about COVID-19 from March-December 2020 to identify shifts in topics over the course of the pandemic.  Upon completion of this tutorial you will be able to:

 * Import data via a set of text files.

 * Set clustering parameters and run an analysis.

 * Use the re-cluster functionality.

 * Be able to download results in a variety of formats.

 * Create and use a stopwords file to obtain more relevant results.

 * Use a background corpus for your analysis.

 * Identify main topic shifts in COVID-19 Tweets between months.
 
### Input Files

A sample of Tweets from 2020 are provided in the TopExApp GitHub repository under the [tutorial_data](https://github.com/VCUWrightCenter/TopExApp/tutorial_data_tweets) folder.  Tweets are divided into individual months, along with a folder containing all Tweets.

Before starting the tutorial, download the Tweets to a folder of your choice on your local machine.  Be sure you can navigate to this folder.

### Starting TopEx

Go to [topex.cctr.vcu.edu](topex.cctr.vcu.edu) to start TopEx.  You may open TopEx in multiple browser windows as well if you want to run and compare multiple text corpora, such as different months of Tweets.  For this tutorial, open TopEx in 2 browser windows so we can compare Tweets from March and December.

Once loaded, you should see a window similar to the following:

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

### Loading Data

To start uploading data, click on "Get Started", then click on the hamburger menu in the upper left corner of the TopEx window.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

You should see a pop-out menu as shown below.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Under the "Documents to Cluster" section click on the "upload docs to cluster" button.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>


Navigate to the folder containing the March 2020 COVID-19 Tweets.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Select the "March 2020" folder, then click "Upload".  It will ask you if you want to upload 1,657 files - select "upload" again to import the data.  Once imported you will see the list of files appear in your menu bar.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>


You can also upload an expansion corpus from this tab, but we will use this feature later in the tutorial.

### Clustering Sentences

Once your files have been imported, click on the "Parameters" tab in the left side menu bar.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>


This tab provides you many options for tuning the various stages of transforming each sentence into a numerical vector.  For a detailed explanation of each option, please read the [TopEx User's Manual](https://github.com/VCUWrightCenter/TopExApp/docs/manual.md).  For this tutorial, set the options as shown below:

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Now navigate back to the "Load Data" tab and click the "Run Topex!" button.  Wait a few seconds and the scatter plot should pop up and look similar to the following:

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

### Navigating TopEx Results

TopEx displays results in two ways: an interactive scatter plot and word clouds.  The scatter plot is shown by default, however you can switch to the word cloud view using the toggle at the center top of the page.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

#### Exploring the scatter plot

In the scatter plot view, each dot represents one sentence from your input. The location of each dot is determined by reducing the distance matrix from the Sentence Clustering step down to 2 dimensions using one of the reduction methods listed under the "Vizualization Method" parameter in the Parameters tab (UMAP, tSNE, SVD, or MDS).  For this tutorial we chose to use UMAP, which is the default and recommended method.  In a UMAP plot, the closer in space two dots are, the more similar they should be.  In the scatter plot results for COVID-19 Tweets in March 2020 we can see one large cluster in the center with several smaller clusters farther out.

Hovering your mouse over a dot displays the information about that sentence in a panel to the right of the plot.  This information includes:

 - The document and sentence IDs.
 - The cluster ID.
 - The phrase used by TopEx to numerically represent this sentence.
 - The full original sentence.
 - This cluster's topic with the top N topic words present in the cluster (can be adjusted using the Re-Cluster Tab).

<add more here on the specific results>

#### Word Clouds
 
 Another way to explore the topics present in a set of texts is thorugh the Word Cloud visualization.  Click on the "Word Cloud" toggle at the top of the scatter plot.  You should see a screen similar to the following:
 
 <img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>
 
 Word Clouds show word frequencies in a set of texts with the largest words being those that are the most frequent.  You can toggle between the different clusters using the drop down at the top of the page.  Scanning through all the clusters you can get a general idea of what each is about just by looking at the most frequent words in each Word Cloud.

### Re-Clustering

In the current results there are a lot of clusters to really make sense of, and some of our breakout groups of sentences are assigned to different clusters.  Ideally we would like to see these breakout groups in the scatter plot all be laced in the same cluster, so lets go to the "Re-Cluster" tab and group sentences into fewer clusters. 
 
  <img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>
 
 The Re-Cluster tab allows you to re-group sentences into a different number of clusters, and re-run the topic analysis for each cluster without having to re-run the costly NLP analysis. Once on the Re-Cluster tab, enter in the values as shown below.
 
 <img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>
 
 The first option allows you to choose the number of clusters you want the data grouped into if using K-means, or the height of the dendrogram if using Hierarchical.  For Hierarchical clustering, smaller numbers will results in MORE clusters and larger numbers will results in FEWER clusters, while for K-means the number you enter is the number of clusters that will be returned.
 
 Once the new parameters are set you can press the Re-Cluster button and your scatter plot and word clouds will be updated momentarily.
 
 <img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>
 
 
 




