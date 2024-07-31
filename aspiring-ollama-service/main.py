import os
import flask
import requests
from flask import request, jsonify, Response

app = flask.Flask(__name__)
raw_base_url = os.environ.get('ollama-uri')

def ensure_http_prefix(url):
    if not url.startswith('http://'):
        return 'http://' + url
    return url

base_url = ensure_http_prefix(raw_base_url)

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
        response = requests.post(url, json=payload, stream=True)

        def generate():
            for chunk in response.iter_lines():
                if chunk:
                    yield chunk.decode('utf-8') + '\n'

        return Response(generate(), content_type='application/json')

    except Exception as e:
        return str(e), 500

@app.route('/api/tags', methods=['GET'])
def get_models():
    try:
        url = f'{base_url}/api/tags'
        response = requests.get(url)

        return response.json(), 200

    except Exception as e:
        return str(e), 500

@app.route('/api/generate', methods=['POST'])
def generate_chat():
    try:
        data = request.get_json()
        model_name = data.get('model')
        prompt = data.get('prompt')

        if not model_name or not prompt:
            return jsonify({"error": "Model name and prompt are required"}), 400

        payload = {
            "model": model_name,
            "prompt": prompt
        }
        url = f'{base_url}/api/generate'
        response = requests.post(url, json=payload, stream=True)

        def generate():
            for chunk in response.iter_lines():
                if chunk:
                    yield chunk.decode('utf-8') + '\n'

        return Response(generate(), content_type='application/json')

    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    
    print(f'target url: {base_url}')
    
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)
