import os
import flask
import requests
from flask import request, jsonify

app = flask.Flask(__name__)
base_url = os.environ.get('OllamaOpenApiEndpointUri')

@app.route('/', methods=['GET'])
def hello_world():
    return 'Hello, World!'

@app.route('/api/pull', methods=['POST'])
def pull_model():
    try:
        data = request.get_json()
        model_name = data.get('name')

        if not model_name:
            return jsonify({"error": "Model name is required"}), 400

        payload = {
            "name": model_name
        }
        url = f'{base_url}/api/pull'
        response = requests.post(url, json=payload)

        return response.json(), response.status_code

    except Exception as e:
        return str(e), 500

@app.route('/api/tags', methods=['GET'])
def get_models():
    try:
        url = f'{base_url}/api/tags'
        response = requests.get(url)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch models"}), response.status_code

        return response.json(), 200

    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8111))
    app.run(host='0.0.0.0', port=port)
