from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # This enables CORS for all routes and origins

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)

from urllib.parse import quote, unquote

@app.route('/image_to_latex', methods=['POST'])
def image_to_latex():
    # Get the image url from the request boyd
    body = request.json
    image_url = body['image_url']
    noteId = body['noteId']
    noteImageId = body['noteImageId']
    print(noteId)
    print(image_url)
    image_path = './tmp/image.jpg'
    os.makedirs(os.path.dirname(image_path), exist_ok=True)

    # Download the image
    try:
        response = requests.get(image_url)
        response.raise_for_status()  # Check if the request was successful
        with open(image_path, 'wb') as f:
            f.write(response.content)
        print("Image downloaded")
        # Add your logic for processing the image to LaTeX here
        # return jsonify({'message': 'Image processed successfully'}), 200
    except requests.RequestException as e:
        print(e)
        return jsonify({'error': 'Failed to download the image'}), 500

    # Convert the image to LaTeX
    
    latext = ImageToLatex(image_path)
    print(latext)
    remove_first_page_in_place("feedback.pdf")
    with open("feedback.pdf", "rb") as f:
        pdf_bytes = f.read()
        # No need for base64 encoding
        header = {
            "Content-Type": "application/pdf"
        }
        # Send the raw PDF bytes
            # santize the latex for the url
        def sanitize_for_url(input_string):
            return quote(input_string)

        latext =  sanitize_for_url(latext)
        response = requests.post("https://astute-cheetah-548.convex.site/uploadPdf?noteId=" + noteId + "&latextString=" + latext + "&noteImageId=" + noteImageId
                                 , headers=header, data=pdf_bytes)
        print(response)
        return jsonify({"latex": latext, "feedback_pdf": base64.b64encode(pdf_bytes).decode('utf-8')}), 200
    # Return the LaTeX

import subprocess
from openai import OpenAI
import os
import requests
from dotenv import load_dotenv
import base64
import cv2
import numpy as np
from tempfile import NamedTemporaryFile
from openai import OpenAI
# from pdf2image import convert_from_path
from convex import ConvexClient
load_dotenv(".env.local")
client = ConvexClient(os.getenv("CONVEX_URL"))
# print(client.query("tasks:get"))


load_dotenv()

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print(OPENAI_API_KEY)

def preprocess_image_for_ocr(image_path):
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

            "text": "This is an image of a student's notes. Transcribe it into latex code. Have a one-line gap between each line. This should compile as a pdf file later. Do not output anything except for the transcribed latex! I will tip you $100 if you make the latex concise."
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
    "max_tokens": 1024
    }

    response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
    
    res = response.json()
    print(res)
    return res['choices'][0]['message']['content']

def latex_to_pdf(latex_code, output_dir='./', filename='output.pdf'):
    # Ensure the output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Full path for the output PDF
    pdf_output_path = os.path.join(output_dir, filename)
    
    # Create a temporary .tex file
    with NamedTemporaryFile(suffix=".tex", delete=False) as temp_tex_file:
        temp_tex_path = temp_tex_file.name
        # Write the LaTeX code to the temporary file
        temp_tex_file.write(latex_code.encode('utf-8'))
        temp_tex_file.flush()

        # Compile the LaTeX file into a PDF using pdflatex
        subprocess.run(["pdflatex", "-interaction=nonstopmode", "-output-directory", output_dir, temp_tex_path], cwd=os.path.dirname(temp_tex_path))

        # Check if the PDF was successfully created at the specified output path
        final_pdf_path = os.path.join(output_dir, os.path.basename(temp_tex_path).replace(".tex", ".pdf"))
        if os.path.exists(final_pdf_path):
            # If a specific filename is provided, rename the generated PDF accordingly
            if filename:
                custom_pdf_path = pdf_output_path
                os.rename(final_pdf_path, custom_pdf_path)
                print(f"PDF generated successfully: {custom_pdf_path}")
            else:
                print(f"PDF generated successfully: {final_pdf_path}")
        else:
            print("Failed to generate PDF.")

        # Cleanup: Delete the temporary .tex file
        os.remove(temp_tex_path)  # Delete the .tex file
        
    # Clean up auxiliary files generated by LaTeX (optional)
    for ext in ['.aux', '.log', '.out']:
        try:
            os.remove(filename + ext)
        except OSError:
            pass

    # Check if PDF was successfully created
    if os.path.exists(filename + '.pdf'):
        return filename + '.pdf'
    else:
        return "Error: PDF generation failed."

def generate_text(prompt, context = "You are an AI Assistant"):
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
            "content": prompt,
            }
        ],
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        max_tokens=1024
    )

    return chat_completion.choices[0].message.content


def generate_text(prompt, context="You are an AI Assistant"):
    client = OpenAI()

    response = client.chat.completions.create(
    model="gpt-4-0125-preview",
    
    messages=[
        {"role": "system", "content": "You must generate clean and beautiful latex code that compiles"},
        {"role": "user", "content": prompt}
    ],
    max_tokens=1024
    )
    print(response)
    print(response.choices[0].message.content)
    return response.choices[0].message.content

def ImageToLatex(img_path):
    processed_image_path = preprocess_image_for_ocr(img_path)
    extracted_latex = image_to_text(processed_image_path)
    latex_to_pdf(extracted_latex, "/Users/gavinwang/CODE/treehacks/flask", "no_feedback.pdf")

    feedback_prompt =  '''
    Correct any errors in the document. Any inserted corrections are in red font.

    At the very bottom of the document, add an additional section explaining each error correction. This section should be titled Error Corrections and should be in black.

    Here is the latex to be corrected:
    '''

    feedback_latex = generate_text(feedback_prompt + extracted_latex)

    latex_to_pdf(feedback_latex, "/Users/gavinwang/CODE/treehacks/flask", "feedback.pdf")
    return extracted_latex

import PyPDF2
import os
import tempfile

def remove_first_page_in_place(pdf_file_path):
    """
    Remove the first page from a PDF file and save the changes back to the same file.

    :param pdf_file_path: The path to the PDF file.
    """
    # Create a temporary file
    with tempfile.TemporaryFile() as temp_file:
        # Open the existing PDF
        with open(pdf_file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file) 
            writer = PyPDF2.PdfWriter()

            # Add all pages except the first to the writer object
            for page_num in range(1, len(reader.pages)):
                page = reader.pages[page_num]
                writer.add_page(page)

            # Write the modified PDF to the temporary file
            writer.write(temp_file)
            temp_file.seek(0)  # Go back to the beginning of the tempfile

            # Overwrite the original file with the modified PDF
            with open(pdf_file_path, 'wb') as output_file:
                output_file.write(temp_file.read())

    print(f"The first page has been removed. The changes are saved back to {pdf_file_path}")


if __name__ == '__main__':
    app.run(debug=True)