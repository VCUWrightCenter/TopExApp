# Locally Installing TopExApp

- [Introduction](#intro)
- [Installation](#install)
  * [End-Users](#enduser)
  * [Developers](#developers)

# Introduction <a name="intro">

TopExApp provides a graphical user interface for the [TopEx Python library](https://pypi.org/project/topex/), and is an application designed for the exploration of topics in large sets of text. Originally designed to identify common challenges experienced by acting interns through their reflective writing responses [(Olex et al 2020)](#paper), this application can also be used for the exploration of topics in any set of texts.

# Installation <a name="install">
  
TopExApp runs as a web app within a Docker container and can be run as an end-user, or set up to run for UI development.  Any changes to the TopEx library must be made through the [TopEx python package GitHub repository](https://github.com/VCUWrightCenter/TopEx).

## End-Users <a name="enduser">

### Requirements

* [Docker Desktop](https://www.docker.com/products/docker-desktop) or [Docker Toolbox/Docker Machine](https://docs.docker.com/toolbox/toolbox_install_mac/) for advanced Docker users.

  * Mac OSX 10.13 or higher with 2010 hardware or newer required. See specifications [here](https://docs.docker.com/docker-for-mac/install/).
 
  * Widnows 10 or higher required. See specifications [here](https://docs.docker.com/docker-for-windows/install/).
 
 * Internet Browser

### Install Instructions

1) Install Docker Desktop for Mac or Windows from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop).

2) Download the TopExApp GitHub Repository:
    
    > git clone https://github.com/VCUWrightCenter/TopExApp.git

3) Navigate into the Git Repo using the terminal/command line.

4) Build the TopExApp Docker container (Note: this can take several minutes to complete):
    
    > docker-compose up --build

5) Once built, TopEx should show up as a container in your Docker Desktop Dashboard.  From here it can be turned on and off without returning to the command line.  Once running, go to the following URL in your browser to start TopEx:

    > http://localhost:3000

### Update Instructions

When an updated version of TopExApp is released, navigate to the TopExApp GitHub repository using your terminal and download the updated application using:

 > git pull

Then open the Docker Desktop Dashboard and restart the TopEx container.

#### Troubleshooting Updates

If after an update TopEx fails to compile and run, you may need to re-generate your Docker image, volume, and container.  This can happen if a new feature was added requireing new modules that are not already installed in the current Docker volume.  For detailed instructions, please see this [Docker Tutorial](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes#removing-docker-images).  All of the following should be run in the command line.  Before starting you must stop and delete the TopEx container from the Docker Desktop Dashboard (press Stop and Trash Can buttons).

1) List all Docker images:
 
    > docker images
 
2) Identify the TopEx image name, then delete it:

    > docker rmi <IMAGENAME>
 
3) List all Docker containers (this list may be empty):

    > docker ps

4) If a TopEx container exists, delete it:

    > docker rm <CONTAINERNAME>
 
5) List all Docker volumes:

    > docker volume ls
    
6) Identify the TopEx volume name, then delete it:

    > docker volume rm VOLUMENAME
    
7) Change directory to the TopEx GitHub repository if you are not already there, and follow the install instructions listed above to rebuild the TopEx Docker volume, container, and image.


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

    ~/api> python -m spacy download en_core_web_sm

    ~/api> gunicorn app:app -w 2 -b localhost:8080 -t 90

    ~/web> npm install

    ~/web> npm run local
