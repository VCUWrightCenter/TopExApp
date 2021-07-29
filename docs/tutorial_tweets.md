# TopEx Tutorial: Exploring COVID-19 Tweets

Detailed usage instructions can be found in the [TopEx User's Manual](https://github.com/VCUWrightCenter/TopExApp/docs/manual.md).

This tutorial uses a random sample of public Tweets about COVID-19 from March-December 2020 to identify shifts in topics over the course of the pandemic.  Upon completion of this tutorial you will be able to:

 * Import data via a set of text files.
 * Set clustering parameters, run an analysis, and re-cluster data as needed.
 * Use a stopwords file.
 * Use an expansion corpus.
 * Identify main topic shifts in COVID-19 Tweets between months.
 * Download results.
 
### Input Files

A sample of Tweets from March and December 2020 are provided as a zip file in the TopExApp GitHub repository under the [tutorial_data](https://github.com/VCUWrightCenter/TopExApp/tutorial_data_tweets) folder.  Before starting the tutorial, download and unzip the Tweets to a folder of your choice on your local machine.  Be sure you can navigate to this folder.

### Starting TopEx

Go to [topex.cctr.vcu.edu](topex.cctr.vcu.edu) to start TopEx.  You may open TopEx in multiple browser windows as well if you want to run and compare multiple text corpora, such as different months of Tweets.

Once loaded, you should see a window similar to the following:

<img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_1.png" alt="TopEx welcome screen." width="200"/>

### Loading Data

To start uploading data, click on "Get Started", then click on the hamburger menu in the upper left corner of the TopEx window.

<img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_2.png" alt="Hamburger Button" width="200"/>

You should see a pop-out menu as shown below.

<img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_3.png" alt="Load Data Tab" width="200"/>

Under the "Documents to Cluster" section click on the "upload docs to cluster" button.

<img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_4.png" alt="Upload Docs button" width="200"/>

Navigate to the folder containing the March 2020 COVID-19 Tweets.

<img src="img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_5.png" alt="Data upload screen." width="200"/>

Select the "March 2020" folder, then click "Upload".  It will ask you if you want to upload 1,657 files - select "upload" again to import the data.  Once imported you will see the list of files appear in your menu bar.

<img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_6.png" alt="Load Data tab with input files listed." width="200"/>

### Clustering Sentences

Once your files have been imported, click on the "Parameters" tab in the left side menu bar. This tab provides you many options for tuning the various stages of transforming each sentence into a numerical vector.  For a detailed explanation of each option, please read the [TopEx User's Manual](https://github.com/VCUWrightCenter/TopExApp/docs/manual.md).  For this tutorial, set the options as shown below:

<img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_7.png" alt/tutorial_7="Parameters Tab" width="200"/>

Now navigate back to the "Load Data" tab and click the "Run Topex!" button.  When the analysis is complete the scatter plot should pop up and look similar to the following:

<img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_8.png" alt/tutorial_7="Parameters Tab" width="200"/>

### Navigating TopEx Results

TopEx displays results in two ways: an interactive scatter plot and word clouds.  The scatter plot is shown by default, however you can switch to the word cloud view using the toggle at the center top of the page.

<img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_9.png" alt/tutorial_7="Parameters Tab" width="200"/>

#### Exploring the scatter plot

In the scatter plot view, each dot represents one sentence from your input. The location of each dot is determined by reducing the distance matrix from the Sentence Clustering step down to 2 dimensions using one of the reduction methods listed under the "Vizualization Method" parameter in the Parameters tab (UMAP, tSNE, SVD, or MDS).  For this tutorial we chose to use UMAP, which is the default and recommended method.  In a UMAP plot, the closer in space two dots are, the more similar they should be.  In the scatter plot results for COVID-19 Tweets in March 2020 we can see one large cluster in the center with several smaller clusters farther out.  The colors of each dot represent the cluster they are in, which is reflected in the information on the right side panel.

Hovering your mouse over a dot displays the information about that sentence in a panel to the right of the plot.  This information includes:

 - The document and sentence IDs.
 - The cluster ID.
 - The phrase used by TopEx to numerically represent this sentence.
 - The full original sentence.
 - This cluster's topic with the top N topic words present in the cluster (can be adjusted using the Re-Cluster Tab).

For example, hovering over the orange Cluster 3 at the center top displays the Cluster Topic that includes key words "coronavirus" and "spread".  Looking around there are several distinct groupings of sentences; however, they are not all assiged to the same cluster (i.e. have the same color).  This is an indication that we may have too many clusters, or need to change our visualization parameters to reflect the clusters that are present (See Re-Clustering section below).  

#### Word Clouds
 
 Another way to explore the topics present in a set of texts is thorugh the Word Cloud visualization.  Click on the "Word Cloud" toggle at the top of the scatter plot.  You should see a screen similar to the following:
 
 <img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_10.png" alt="Word Cloud view." width="200"/>
 
 Word Clouds show word frequencies in a set of texts with the largest words being those that are the most frequent.  You can toggle between the different clusters using the drop down at the top of the page.  Scanning through all the clusters you can get a general idea of what each is about just by looking at the most frequent words in each Word Cloud.

### Re-Clustering

In the current results there are too many clusters as some of our breakout groups of sentences are assigned to different clusters.  Ideally we would like to see these breakout groups in the scatter plot all be placed in the same cluster (like orange cluster 3), so lets go to the "Re-Cluster" tab and group sentences into fewer clusters. 
 
The Re-Cluster tab allows you to re-group sentences into a different number of clusters, and re-run the topic analysis for each cluster without having to re-run the costly NLP analysis. Once on the Re-Cluster tab, enter in the values as shown below.
 
 <img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_11.png" alt="Recluster Tab" width="200"/>
 
 The first option "Height or K" allows you to choose the number of clusters you want (K) the data grouped into if using K-means, or the height of the dendrogram if using Hierarchical clustering (Height).  For Hierarchical clustering, smaller numbers will results in MORE clusters and larger numbers will results in FEWER clusters, while for K-means the number you enter is the number of clusters that will be returned.
 
 The second option determins the number of key words to display for the cluster topic.  The default is 10, so we will use that, however, if you want more or fewer that can be adjusted here.
 
 The third option aids in cleaning up the scatter plot to remove clusters that only contain a few sentences.  For example, if set to 10 then only clusters with at least 10 sentences will be displayed.  For this tutorial we will set it at 1, which includes all clusters.
 
 Once the new parameters are set you can press the Re-Cluster button and your scatter plot and word clouds will be updated momentarily.  You should get a scatter plot that looks something like the following:
 
 <img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_12.png" alt="Reclustered scatter plot." width="200"/>
 
 Notice that now many of the sentence groupings that were assigned to multiple clusters are now assigned to a single cluster and the plot looks much cleaner!
 
### Using Stopwords
 
 While re-clustering helped a bit, there are still some issues with the current analysis.  Using the Word Cloud visualization, we can see that many of the clusters are dominated by uninformative words, including "coronavirus" in Cluster 7, "covid19" in Cluster 2, and "people" in Cluster 11.
 
<img src="https://github.com/VCUWrightCenter/TopExApp/docs/figs/tutorial_13.png" alt="Example Word Clouds" width="200"/>

These terms are uninformative because the Tweets were selected specifically because they were in response to the pandemic.  Thus, having clusters of sentences dominated by these terms is not helpful in this situation.  

Stopwords are words that are uninfomrative for a particular analysis and are removed from an analysis.  TopEx by default removes a host of standard stopwords such as "the" or "and", however, there are generally domain-specific stopwords, such as "covid19", that also need to be removed.  Thus, we need to create and upload a custom stopwords file for this analysis so that TopEx will ignore terms like "coronavirus" during it's analysis.

A Stopword file is simply a text file with one term per line.  As TopEx does not yet do any concept mapping, you will need to enter in all variations of a term in order for it to be removed.  For example, the file should contain both "COVID-19" and "COVID19".  For this tutorial we have already created a stopwords file named "CovidTweetCustomStopWords.txt".  Navigate back to the Parameters tab, and scroll down to the "Custom stopwords file" section.  Click on the "Upload stopwords file" button, then navigate to the file and select it.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

A successful upload will results in the file name appearing below the "Reset" button.  If uploading a stopwords file, then the NLP algorithm has to be run again.  Navigate to the "Load Data" tab and run TopEx. You should get a scatter plot that looks like the following, which is different from the first one.  

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Note that with the first scatter plot 30 clusters looked like too many, however, 30 clusters for this plot looks ok.  They are small, but reading through the Word Clouds finds a few that are informative.  For example, Cluster 7 is all about helping to stop the spread of the virus. Cluster 1 is about new case confirmations while the closly related Cluster 5 focuses more on the death toll and Cluster 21 is about testing positive. Continue to explore the other clusters to see what else you can identify.  Also, remember that there are no "correct" number of clusters here.  Feel free to play with the reclustering and the NLP parameters to see how that affects your results!  You can also upload different months to see how they change.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>


### Using an Expansion Corpus

The results from the steps above utilize the input texts as the background corpus to generate numerical representations for each sentence; however, sometimes your input corpus may at times be small and you need additional background context in order to get good sentence representations, or you want to use the same documents as your background for clustering multiple input corpora. This is where the Expansion corpus comes in.  For this tutorial, we are going to import the December Tweets as our expansion corpus and generate the sentences representations using both the Tweets from March and December.

To get started, navigate to the "Load Data" tab and clear all your previous files by clicking on the "Reset Input Corpus" button.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Scroll down to the "Expansion Corpus" section and click on the "Upload Expansion Docs" button.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Navigate to the folder that contains the data for this tutorial and select the "December2020" folder, then select "Upload" when it asks you to upload the files.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Your files should population below the Expansion Corpus section.

Next, lets reload the Clustering Corpus (i.e. the Tweets from March we want to analyze) as we did in the first part of this tutorial.  All of the parameters are going to stay the same EXCEPT the Background Corpus, which needs to be changed to "Both". Now all we need to do is click the "Run TopEx!" button!

Your scatter plot should produce something similar to the following:

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Having 30 clusters again looks like too many, so lets use the Re-Cluster tab to bring this down to 15 clusters.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Exploring this data reveals similar clusters to the original results using only the March data; however, we now have more compact clusters and a nicer figure.  Note that including additional data in an expansion corpus can be beneficial or detrimental to your analysis.  As this is an exploratory tool there is no right or wrong way, so try a few variations and pick which you think is the most helpful!

### Topic Comparisons Between Months

Now that we have our March Tweets analyzed we need to run the same analysis for December.  Open up a new TopEx instance in your browser, and run the same analysis with the similar settings on the December Tweets, using the March Tweets as our Expansion Corpus, and change the number of clusters to 8 this time.  Make sure you set the Background Corpus to use Both the Clustering and Expansion Corpus.  You should end up with a scatter plot similar to the following with 8 clusters:

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Notice the number of clusters is reduced from 15 to 8.  This is because in December there were fewer main focal points of discussion.  Explore the data and try to identify which cluster of Tweets discuss the following:

 - New cases/death toll
 - Vaccinations
 - New UK variant
 - Covid-19 Stimulus Bill

In comparing these topics to those from March it is easy to quickly identify how the main topics have shifted over the course of the pandemic.


### Downloading Data

Now that we have analyzed our Tweets we will want to save this data for future analysis.  TopEx has multiple ways to export data on the Import/Export tab that are described below:

 1) Export Clustering (.topex): The .topex file allows you to export the current TopEx settings and data view.  You can export then import this file back into TopEx at a later data and have re-clustering functionality and well as data export capabilities.
 2) Export Sentences (.csv): This option just exports a list of all the sentences that were analyzed.
 3) Export Row-Level Results (.txt): This is the most useful file for further analysis of TopEx results.  This option downloads a pipe-delimited text file that can be uploaded into programs like Excel.  Data includes the raw text, assigned cluster, chosen phrase, and topic key words for each sentence that was processed.  Sentence clusters can be analyzed in detail using this output option.
 4) Export Scatterplot Data (.txt): This option exports a delimited text file with the coordinates and cluster assignment for each sentence so you can re-create the scatterplot in external tools like R for publications.
 5) Export Word Cloud Data (.txt): This is similar to the scatterplot file where the raw word frequencies are saved in a delimied file so that word clouds can be generated in external tools for publication.

Finally, on each of the visualization screens you can export a low resolution snapshot of the scatterplot or word clouds for documentation purposes.

### Parameter Exploration

This tutorial didn't explore all the parameters that you have the ability to change.  For example, the "Windoe Size" parameter affects the sentence representations by using more or fewer words to represent a sentence.  As Tweets are generally shorter that normal sentences you could try to adjust this parameter down to get more Tweets in your analysis (TopEx ignores sentences that are too short to meet the minimum phrase length).  Now that you have a general understanding of how TopEx works, play with some of these parameters to see if they are helpful in analyzing these Tweets.








