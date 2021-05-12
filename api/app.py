# from flask import request, jsonify, make_response
from chalice import Chalice, Response
from requests_toolbelt import MultipartDecoder
import sys
from threads import ClusterThread, ReclusterThread

threads = {}    
app = Chalice(app_name='topex')

def parse_request():
    "Parses a request and extracts params and files"
    files = {}
    params = {}
    for part in MultipartDecoder(app.current_request.raw_body, app.current_request.headers['content-type']).parts:
        header = str(part.headers[b'Content-Disposition'], 'utf-8')
        if "filename" in header:
            name = header.split('"')[1::2][1]
            files[name] = part.content.decode()
        else:
            parsed_object = {header.split('"')[1::2][0]: part.content.decode()}
            params.update(parsed_object)
    return params, files

@app.route('/',cors=True)
def index():
    return {'hello': 'topex'}

@app.route('/status/{thread_id}', cors=True)
def status(thread_id):
    "Checks the status of (re)cluster request"
    global threads
    tid = int(thread_id)

    try:
        status = threads[tid].status if tid in threads else 'Initializing...'
        response = Response(status)
    except:
        response = Response("Unexpected error: ", sys.exc_info()[0])

    return response

@app.route('/cluster', methods=["POST"], cors=True, content_types=['multipart/form-data'])
def cluster():
    "Processes input files into clusters."
    global threads
    params, files = parse_request()

    try:
        tid = 1
        threads[tid] = ClusterThread(params=params, files=files)
        threads[tid].start()
        threads[tid].join()
    except:
        response = Response("Unexpected error: ", sys.exc_info()[0])
    else:
        response = Response(dict(threads[tid].result))

    # Set thread status to idle
    threads[tid].status = 'Idle'

    return response

@app.route('/recluster', methods=["POST"], cors=True, content_types=['multipart/form-data'])
def recluster():
    "Re-clusters data"
    params, _ = parse_request()
    try:
        tid = 2
        threads[tid] = ReclusterThread(params=params)
        threads[tid].start()
        threads[tid].join()
    except:
        response = Response("Unexpected error: ", sys.exc_info()[0])
    else:
        response = Response(dict(threads[tid].result))

    # Set thread status to idle
    threads[tid].status = 'Idle'

    return response

