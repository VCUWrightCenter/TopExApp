from flask import request, Flask, jsonify, make_response
import sys
import service

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return "This is the api working"

@app.route('/cluster', methods=["POST"])
def cluster():
    try:
        result = service.cluster(request)
    except:
        response = make_response(jsonify("Unexpected error: ", sys.exc_info()[0]))
    else:
        response = make_response(result)

    # Add Access-Control-Allow-Origin header to allow cross-site request
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'

    return response

@app.route('/recluster', methods=["POST"])
def recluster():
    try:
        result = service.recluster(request)
    except:
        response = make_response(jsonify("Unexpected error: ", sys.exc_info()[0]))
    else:
        response = make_response(result)

    # Add Access-Control-Allow-Origin header to allow cross-site request
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'

    return response