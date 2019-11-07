import flask
from flask import request
from datetime import datetime
from discover_topics_UMAP_Kmeans import main as script


app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    return "This is the api working"

@app.route('/test', methods=['POST'])
def file_content():
    data = request.files
    for file in data:
        fileob = data[file]
        print(fileob.read().decode())
        now = datetime. now()
        current_time = now. strftime("%H:%M:%S")
        print("done. File received at ", current_time)
    return 'data'

@app.route('/runScript', methods=["POST"])
def runScript():
    data = request.files

    fileList = []
    for file in data:
        fileob = data[file]
        fileText = fileob.read().decode()
        fileList.append(fileText)
        #print(fileList[0])
    #print(fileList)
    script(fileList)
    return 'a'

app.run()