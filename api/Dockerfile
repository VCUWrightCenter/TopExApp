FROM python:3.8
RUN mkdir /backend
WORKDIR /backend
COPY requirements.txt /backend/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
RUN python -m nltk.downloader stopwords punkt averaged_perceptron_tagger wordnet
COPY . .
