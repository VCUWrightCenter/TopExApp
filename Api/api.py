from flask import request, Flask
import sys
import service

app = Flask(__name__)
#app.config["DEBUG"] = True


@app.route('/', methods=['GET'])
def home():
    return "This is the api working"

@app.route('/process', methods=["POST"])
def process():
    try:
        result = service.process(request)
    except:
        return ("Unexpected error: ", sys.exc_info()[0])
    else:
        return result

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
