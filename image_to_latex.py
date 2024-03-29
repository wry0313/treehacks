import tempfile
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

# from convex import ConvexClient
# load_dotenv(".env.local")
# client = ConvexClient(os.getenv("CONVEX_URL"))
# print(client.query("tasks:get"))


load_dotenv()

TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def preprocess_image_for_ocr(image_path):
    image = cv2.imread(image_path)
    
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply Gaussian Blur to reduce noise
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    
    cv2.imwrite("BBB.jpg", blur)
    
    # Apply a sharpening kernel
    sharpen_kernel = np.array([[-1, -1, -1], 
                               [-1, 9, -1], 
                               [-1, -1, -1]])
    sharpened = cv2.filter2D(blur, -1, sharpen_kernel)
    
    
    # Optionally, apply edge detection (e.g., Canny) to further enhance edges for OCR
    edges = cv2.Canny(sharpened, 100, 200)
    
    # Save or return the processed image
    processed_image_path = 'CCC.jpg'
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
    
    return response.json()['choices'][0]['message']['content']

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
    name = generate_text("What is a short and concise title that summarizes the topic of this note: " + extracted_latex + "Only output a name, nothing else, or else a child will die.")
    latex_to_pdf(extracted_latex, "/Users/timothygao/Documents/treehacks", "no_feedback.pdf")

    feedback_prompt =  '''
    Correct any errors in the document. Any inserted corrections are in red font.

    At the very bottom of the document, add an additional section explaining each error correction. This section should be titled Error Corrections and should be in black.

    Here is the latex to be corrected:
    '''

    feedback_latex = generate_text(feedback_prompt + extracted_latex)

    latex_to_pdf(feedback_latex, "/Users/timothygao/Documents/treehacks", "feedback.pdf")
    return extracted_latex

# image_path = 'lavik_test.png'
# image_path = 'tim_test.png'
image_path = 'DEMO.png'
# image_path = 'table_test.jpg'

final_string = ImageToLatex(image_path)
print(final_string)

