# Running locally with Docker
~/> docker-compose up --build


# Running locally for development

## Requirements 
- Python 3.8
- node 6.9.0

## Run Script
~/api> virtualenv env

~/api> env\Scripts\activate (Windows)

~/api> source env/bin/activate (Mac/Linux)

~/api> pip install -r requirements.txt

~/api> python -m nltk.downloader all

~/api> flask run 

~/web> npm install

~/web> npm start
