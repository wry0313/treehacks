from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # This enables CORS for all routes and origins

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)