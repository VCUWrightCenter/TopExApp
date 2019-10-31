import flask
from flask import request

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
    return 'data'

app.run()