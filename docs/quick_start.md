# TopEx Quick Start Guide

- [STOP!! Read Me First](#stop)
- [Running TopEx](#run)
  * [1) Data Cleaning and Formatting](#clean)
  * [2) Loading Data](#load)
  * [3) Adjusting Basic Parameters](#param)
  * [4) Run Analysis](#analyze)
  * [5) Navigating Results](#results)
  * [6) Downloading Results](#download)
- [Troubleshooting](#help)

# STOP!! Read Me First <a name="stop">
  This guide is meant to get users up and running with TopEx quickly using _BASIC_ parameters. All other parameters are left at their default settings.  It is recommended when changing other parameters the user should have a basic knowledge of NLP concepts and consult the detailed [TopEx User's Manual](https://vcuwrightcenter.github.io/TopExApp/manual).  

# Running TopEx <a name="run">
  
## 1) Data Cleaning and Formatting <a name="clean">
  Having your data in the right format and cleaned is a very important step in successfully running TopEx.  
  
### Data Cleaning

 Some files may require cleaning and pre-processing that is project specific.  In general, you want to ensure there are no odd characters in the data, and remove text that could skew your results.  For example, if analyzing responses to a survey question, make sure the actual survey question text is NOT included in the text that is input into TopEx. If importing using an Excel or delimited file, make sure all rows with a document ID have text in the second column. If not, then delete that row as it will cause TopEx to fail.
  
### File Formats

 The two recommended data format options for TopEx are an MS Excel file or a text file with MEDLINE formatted PubMed search results (see descriptions below). 
  
  **Excel File:** An Excel formatted file must contain 2 columns, with the first row containing the column titles, and have the extension of ".xlsx".  The document ID should be in the first column and the entire text of the document in a single cell in the second column. _Note that all IDs must have some sort of text in the second column._  If a document ID is present, but the text column is empty TopEx will throw an error.  Additionally, the extension must be ".xlsx" as the older ".xls" extension will not be recognized. 

  **MEDLINE File:** The MEDLINE format is provided for those who want to explore topics in a set of PubMed search results.  When you are in PubMed, select to save your search results in a MEDLINE format.  This will save the publication information, including the abstract.  Once uploaded to TopEx, the abstract will be automatically extracted and run through TopEx, and no pre-processing is required.
  
## 2) Loading Data <a name="load">
  To load data, click on the hamburger menu button in the top left corner of the TopEx window and go to the "Load Data" tab. Press the button that matches the format you have your data saved in, then navigate to the file and upload it.  The "Run TopEx!" button should change to GREEN at this time.  If you do not want to change default parameters you may press it to run the analysis at this time.
  
  __Note:__ Your file name(s) should appear below the button when sucessfully loaded.  If it doesn't double check your file extension(s).
  
## 3) Adjusting Basic Parameters <a name="param">
  Click on the "Parameters" tab.  There are only two basic parameters beginning users should adjust.  They are the number of clusters and uploading a stopwords list.
  
  **Cluster Number:** This parameters dictates how many groups your sentences will be clustered into. Default is 20, but you can change if desired (this can be changed after analysis as well).  Navigate to the "Threshold" option under the "Sentence Clustering Parameters" section and edit the number to your desired number of sentence clusters.
  
  **Stopwords:** Easily the _most influential_ setting for a TopEx analysis!  Stopwords are essentially a list of uninformative words that you want the algorithm to ignore.  This list includes words like "the", "and", "or", as well as domain-specific words such as "COVID-19" or "patient".  In TopEx you have three options related to the utilization of stopwords:
  
 1) Use the default stopword list that contains domain-agnostic stopword (default behavior).
 
 2) Add additional domain-specific stopwords (upload a stopwords text file).
 
 3) Only use domain-specific stopwords without the default stopword list (upload a stopwords text file and check the "Custom stopwords only?" box).
 
 Stopwords are specified in a text file with one word per line. If you have a stopwords file, click the button and navigate to the files, then click upload. Your file name should appear below the stopword button if it was successfully imported.
  
## 4) Run Analysis <a name="analyze">
  Once parameters are set, navigate back to the "Load Data" tab and click on the GREEN "Run TopEx!" button to initiate a TopEx analysis.
  
## 5) Navigating Results <a name="results">
  Your results will automatically appear in the center TopEx panel. You can toggle between the scatterplot and wordcloud views by using the toggle buttons at the top of the panel.
 
  **Scatterplot:** Each dot in the scatter plot is an individual sentence clustered by TopEx.  You can hover over the dots to see information about that sentence appear in the right-hand panel, including the original raw sentence and the clustering topic assigned to that sentences cluster.
  
  **Wordclouds:** Wordclouds are numbers from zero (0) to N. Each wordcloud plots the count of each term that is present in the cluster of sentences. With wordclouds you can easily see terms that dominate a particular cluster.  Depending on the use case these may be words you want to exclude from the analysis.  If this is the case, you can update your stopwords list, re-upload it, and re-run the TopEx analysis.
  
## 6) Downloading Results <a name="download">
  Results from a TopEx analysis can be exported from the Import/Export tab.  To export the row-level results that include each sentence's text, key phrase, cluster it was assigned to, and the cluster topic words click on the "Export row-level results (.tsv).  A pipe "|" delimited text file that can be opened in Excel will be downloaded. To open this file in Excel, open Excel and select "Import File", then navigate to the .tsv file just downloaded. Through the import wizard, select a custom delimiter and change it to be the pipe character "|". 
  
  From the Import/Export tab you can also export the scatter plot and wordcloud raw data as pipe delimited files to re-create it in other programs for customization.
  
# Troubleshooting <a name="help">
  If you get a Network Error, Error 500, another error message, or a blank white screen after hitting the "Run TopEx!" button then TopEx has failed.  Please try the following before contact the TopEx team:
  
   - Reload TopEx using your browser's refresh button and double check to ensure your input data is in the correct format, has no spurious characters, and no missing data.  
   - Try running TopEx without editing any of the parameters (just load and hit run). If that works, add in one parameter at a time to identify which option is malfunctioning, then report it to the TopEx team (see below).
   - If data is in the right format and you are still having trouble it may be due to too much data that is overloading the server.  Try a small subset (like 5 documents) to see if you can get that to work. If yes, increase the size until you find an error. TopEx should be able to handle over 3000 small (4-5 sentences) documents, however, it is currently known to crash or run forever on larger documents.  
  
  If you still have issues, please submit a ticket using the [TopExApp GitHub page](https://github.com/VCUWrightCenter/TopExApp/issues) and a TopEx team member will assist you.
  
