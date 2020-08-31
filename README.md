# Overview

TopExApp provides a graphical user interface for the [TopEx Python library](https://pypi.org/project/topex/), and is an application designed for the exploration of topics in large sets of text. Originally designed to identify common challenges experienced by acting interns through their reflective writing responses [(Olex et al 2020)](#paper), this application can also be used for the exploration of topics in any set of texts.

# Installation
TopExApp runs as a web app within a Docker container and can be run as an end-user, or set up to run for development.

## End-Users:

### Requierments:
- Python 3.8
- Docker Desktop
- topex Python library

### Instructions:
1) Install the topex Python library:
    
    > pip install topex

2) Install Docker Desktop for Mac or Windows from (https://www.docker.com/products/docker-desktop).

3) Download the TopExApp GitHub Repository:
    
    > git clone https://github.com/VCUWrightCenter/TopExApp.git

4) Navigate into the Git Repo using the terminal/command line.

5) Build the TopExApp Docker container:
    
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

# Acknowledgements

TopExApp (previously MedTop) was initially developed as a web app through the 2019-2020 CapStone program by Seniors in VCU's Computer Science Department under the supervision of Dr. Bridget McInnes and Amy Olex. We wish to thank Sean Kotrola, Aidan Myers, and Suzanne Prince for their excellent work in getting this application up and running! Here are links to the team's CapStone [Poster](https://drive.google.com/file/d/1TGCaM7oXPxFwEJ5B5_nrGZqNnUetWPFB/view) and [Application Demonstration](https://drive.google.com/file/d/1xRYlLpiYnCnI9Pdi6vbE4eTDUu0e09qB/view). 

# References <a name="paper">

Olex A, DiazGranados D, McInnes BT, and Goldberg S. Local Topic Mining for Reflective Medical Writing. Full Length Paper. AMIA Jt Summits Transl Sci Proc 2020;2020:459–68. PMCID: [PMC7233034](https://www-ncbi-nlm-nih-gov.proxy.library.vcu.edu/pmc/articles/PMC7233034/)
