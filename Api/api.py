import flask
from flask import request
from datetime import datetime
from discover_topics_UMAP_Kmeans import main, returnObject
import json
import sys
import med

app = flask.Flask(__name__)
app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    return "This is the api working"

@app.route('/process', methods=["POST"])
def process():
    data = request.files
    fileList = []
    for file in data:
        fileob = data[file]
        print(f"File: {fileob}")
        if fileob.content_type == 'application/json':
            scriptArgs = json.loads(fileob.stream.read())
        else:

            fileText = fileob.read().decode()
            fileList.append(fileText)
    try:
        result = med.process(fileList)
    except:
        return ("Unexpected error: ", sys.exc_info()[0])
    else:
        return result

@app.route('/runScript', methods=["POST"])
def runScript():
    data = request.files
    fileList = []
    for file in data:
        fileob = data[file]
        print(f"File: {fileob}")
        if fileob.content_type == 'application/json':
            scriptArgs = json.loads(fileob.stream.read())
        else:

            fileText = fileob.read().decode()
            fileList.append(fileText)
    print(scriptArgs)
    try:
        result = main(inputFile = fileList, w2vBinFile=scriptArgs["w2vBinFile"], outputdir=scriptArgs["outputdir"], tfidfcorpus = scriptArgs["tfidfcorpus"], scatter_plot = scriptArgs["scatter_plot"], threshold = int(scriptArgs["threshold"]), wordVectorType = scriptArgs["wordVectorType"], prefix=scriptArgs["prefix"], windowSize=scriptArgs["windowSize"], goldStandard=scriptArgs["goldStandard"], dimensions=scriptArgs["dimensions"], umap_neighbors=scriptArgs["umap_neighbors"], distmetric=scriptArgs["DistanceMetric"], include_input_in_tfidf=scriptArgs['include_input_in_tfidf'],output_labeled_sentences=scriptArgs['output_labeled_sentences'], use_kmeans=scriptArgs['use_kmeans']  )
    except:
        return ("Unexpected error: ", sys.exc_info()[0])
    else:
        return result

if __name__ == "__main__":
    app.run()