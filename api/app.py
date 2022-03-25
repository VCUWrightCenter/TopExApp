from flask import request, Flask, jsonify, make_response
from flask_cors import CORS
import sys
import thread

threads = {}    
app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def home():
    return "This is the api working"

@app.route('/status/<int:thread_id>')
def status(thread_id):
    "Checks the status of (re)cluster request"
    global threads

    try:
        status = threads[thread_id].status if thread_id in threads else 'Initializing'
        response = make_response(status)
    except:
        response = make_response(jsonify("Unexpected error: ", sys.exc_info()[0]))        

    return response


@app.route('/cluster', methods=["POST"])
def cluster():
    "Processes input files into clusters."
    global threads
    tid = 1
    threads[tid] = thread.ClusterThread(params=request.form, files=request.files)
    threads[tid].start()
    threads[tid].join()
    response = make_response(dict(threads[tid].result))
    
    # Set thread status to idle
    threads[tid].status = 'Initializing'

    return response

@app.route('/recluster', methods=["POST"])
def recluster():
    "Re-clusters data"
    tid = 2
    threads[tid] = thread.ReclusterThread(params=request.form)
    threads[tid].start()
    threads[tid].join()
    response = make_response(dict(threads[tid].result))

    # Set thread status to idle
    threads[tid].status = 'Initializing'

    return response

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)