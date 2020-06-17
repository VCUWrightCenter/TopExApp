FROM python:latest
COPY . /app
WORKDIR /app
RUN python --version
RUN pip install -r requirements.txt
EXPOSE 5001
ENTRYPOINT [ "python" ]
CMD [ "api.py" ]
