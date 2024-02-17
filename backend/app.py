import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        # Assuming the file is an image, prepare the payload for OpenAI Vision API
        # Directly using the file's binary content can be complex due to API expectations,
        # so this example simplifies interaction assuming an image URL or pre-handled image data.
        # For actual image file handling, consider uploading to a service that can provide a URL or converting to a suitable format.
        encoded_image = "data:image/jpeg;base64," + base64.b64encode(file.read()).decode('utf-8')
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer {}".format("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")
        }
        
        data = {
            "model": "gpt-4-vision-preview",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "What’s in this image?"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": encoded_image
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300
        }
        
        # This is a placeholder for making the API call
        response = requests.post('https://api.openai.com/v1/chat/completions', json=data, headers=headers).json()
        print(response)
        res_msg = response['choices'][0]['message']['content']
        print(res_msg)
        # Return a placeholder response or use the response from the API call
        return jsonify({'message': res_msg}), 200

if __name__ == '__main__':
    app.run(debug=True)
