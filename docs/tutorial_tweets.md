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


You can also upload a background corpus and a stopwords file from this tab.  We will use these features later in the tutorial.

### Clustering Sentences

Once your files have been imported, click on the "Parameters" tab in the left side menu bar.

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>


This tab provides you many options for tuning the various stages of transforming each sentence into a numerical vector.  For a detailed explanation of each option, please read the [TopEx User's Manual](https://github.com/VCUWrightCenter/TopExApp/docs/manual.md).  For this tutorial, set the options as shown below:

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

Now navigate back to the "Load Data" tab and click the "Run Analysis!" button.  Wait a few seconds and the scatter plot should pop up and look similar to the following:

<img src="https://octodex.github.com/images/yaktocat.png" alt="Image of Yaktocat" width="200"/>

### Navigating TopEx Results

#### Exploring the UMAP plot

#### Word Clouds



### Re-Clustering

In the current results there are a lot of clusters to really make sense of, so lets go to the "Re-Cluster" tab and group sentences into fewer clusters.  




