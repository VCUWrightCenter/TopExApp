FROM python:3.8
RUN mkdir /backend
WORKDIR /backend
COPY requirements.txt /backend/requirements.txt
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
#RUN python -m spacy download en_core_web_sm
RUN pip install pip install https://s3-us-west-2.amazonaws.com/ai2-s2-scispacy/releases/v0.4.0/en_core_sci_sm-0.4.0.tar.gz
EXPOSE 8080
COPY . .
CMD ["gunicorn", "app:app", "-w 2", "-b 0.0.0.0:8080", "-t 90"]
