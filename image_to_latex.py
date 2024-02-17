
from openai import OpenAI
import os
import requests
from dotenv import load_dotenv
import os
import base64

import cv2
import numpy as np

load_dotenv()

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def preprocess_image_for_ocr(image_path):
    # Load the image
    image = cv2.imread(image_path)
    
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian Blur to reduce noise
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Apply a sharpening kernel
    sharpen_kernel = np.array([[-1, -1, -1], 
                               [-1, 9, -1], 
                               [-1, -1, -1]])
    sharpened = cv2.filter2D(blur, -1, sharpen_kernel)
    
    # Optionally, apply edge detection (e.g., Canny) to further enhance edges for OCR
    edges = cv2.Canny(sharpened, 100, 200)
    
    # Save or return the processed image
    processed_image_path = 'processed_image.jpg'
    cv2.imwrite(processed_image_path, edges)
    
    return processed_image_path


def image_to_text(image_path):
    # Function to encode the image
    def encode_image(image_path):
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    # Getting the base64 string
    base64_image = encode_image(image_path)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    payload = {
    "model": "gpt-4-vision-preview",
    "messages": [
        {
        "role": "user",
        "content": [
            {
            "type": "text",
            "text": "This is an image of a student's notes. Transcribe it into latex code. Do not output anything except for the transcribed latex. Do not output anything except for the transcribed latex!"
            },
            {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}"
            }
            }
        ]
        }
    ],
    "max_tokens": 300
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    
    return response.json()['choices'][0]['message']['content']



image_path = 'lavik_test.png'
# image_path = 'tim_test.png'
# image_path = 'small_test.png'

processed_image_path = preprocess_image_for_ocr(image_path)
print(processed_image_path)
extracted_text = image_to_text(processed_image_path)
print(extracted_text)