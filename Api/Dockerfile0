FROM ubuntu:latest

MAINTAINER Evan French "etfrench[at]vcu.edu"
RUN apt-get update -y
RUN apt-get install -y python3-pip python3-dev build-essential

RUN mkdir /app

COPY ./requirements.txt /app

WORKDIR /app

RUN pip3 install -r requirements.txt

COPY . /app

ENTRYPOINT ["python3"]

CMD ["api.py"]
