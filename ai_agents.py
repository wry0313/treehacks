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


def queryText(input = "What is 1 + 1", context = "You are an AI Assistant"):
    client = OpenAI(api_key=TOGETHER_API_KEY,
    base_url='https://api.together.xyz',
    )

    chat_completion = client.chat.completions.create(
    messages=[
        {
        "role": "system",
        "content": context,
        },
        {
        "role": "user",
        "content": input,
        }
    ],
    model="mistralai/Mixtral-8x7B-Instruct-v0.1",
    max_tokens=1024
    )

    return chat_completion.choices[0].message.content


print(queryText(input="Hello! whats your name. Give me an apple"))