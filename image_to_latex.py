####
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT

#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT



#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT

#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT
#### INCREASE TOKEN LIIMIT


import subprocess
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

            "text": "This is an image of a student's notes. Transcribe it into latex code. Have a one-line gap between each line. This should compile as a pdf file later. Do not output anything except for the transcribed latex!"
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

import subprocess
import os
from tempfile import NamedTemporaryFile

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

# image_path = 'lavik_test.png'
image_path = 'tim_test.png'
# image_path = 'small_test.png'

processed_image_path = preprocess_image_for_ocr(image_path)
print(processed_image_path)
extracted_latex = image_to_text(processed_image_path)
print(extracted_latex)

def generate_text(prompt):
    # Generate text using GPT-4
    response = openai.Completion.create(
        engine="GPT-4",
        prompt=prompt,
        max_tokens=500
    )
    result = response.choices[0].text.strip()

if __name__ == "__main__":
    main()

def correctLatex(S):
    return generate_text('Correct any errors in the following LaTeX script:\n' + S)
    # cnt = 0
    
    # for i in range(len(S)):
    #     if(S[i] == '$'):
    #         cnt += 1
        
    # if cnt % 2 == 1:
    #     S += 1
    
    # if "\end{document}" not in S:
    #     S += "\end{document}"
    
    # return S

prompt = 'edit the following latex code to include feedback. Make whatever additions you make to the file in red.'

extracted_latex = correctLatex(extracted_latex)
feedback_latex = correctLatex(generate_text(prompt + extracted_latex))

# Replace 'output' with your desired filename without extension
latex_to_pdf(extracted_latex, "/Users/lavikjain/Documents/treehacks", "no_feedback.pdf")
latex_to_pdf(feedback_latex, "/Users/lavikjain/Documents/treehacks", "feedback.pdf")
