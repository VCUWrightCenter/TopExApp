import flask
from flask import request
from datetime import datetime
from discover_topics_UMAP_Kmeans import main as script
import json
import sys

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
    #print('Data')
    #print(data)
    fileList = []
    for file in data:
        fileob = data[file]
        print()
        if fileob.content_type == 'application/json':
            scriptArgs = json.loads(fileob.stream.read())
            print(scriptArgs)
        else:

            fileText = fileob.read().decode()
            fileList.append(fileText)
        #print(fileList[0])
    #print(fileList)
    print(scriptArgs)
    try:
        result = script(inputFile = fileList, w2vBinFile=scriptArgs["w2vBinFile"], outputdir=scriptArgs["outputdir"], tfidfcorpus = scriptArgs["tfidfcorpus"], scatter_plot = scriptArgs["scatter_plot"], threshold = int(scriptArgs["threshold"]), wordVectorType = scriptArgs["wordVectorType"], prefix=scriptArgs["prefix"], windowSize=scriptArgs["windowSize"], goldStandard=scriptArgs["goldStandard"], dimensions=scriptArgs["dimensions"], umap_neighbors=scriptArgs["umap_neighbors"], distmetric=scriptArgs["DistanceMetric"], include_input_in_tfidf=scriptArgs['include_input_in_tfidf'],output_labeled_sentences=scriptArgs['output_labeled_sentences'], use_kmeans=scriptArgs['use_kmeans']  )
    except:
        return ("Unexpected error: ", sys.exc_info()[0])
    #print(type(result))
    else:
        return result

app.run()