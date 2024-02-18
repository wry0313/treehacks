# Elevate

## Inspiration
Every science/math student in college spends more time "TeXing up" their problem sets than actually solving the problems. The simple truth is that formatting problem sets is a huge time-suck.

## What it does
Upload image(s) of your notes/problem sets and watch Elevate beautifully format them into a LaTeX document. An additional created document displays feedback to the work.

## How we built it
Frontend with React. Backend with Convex. 
GPT-4 with Vision processes the image and generates LaTeX script. GPT-4 then processes that LaTeX and adds feedback within the LaTeX script. Finally, we load that file as the context for a Mistral-chatbot that can provide insights from the notes/problem set. 

## Challenges we ran into
Using LLMs to format and position feedback within the LaTeX scripts. 

## Accomplishments that we're proud of

## What we learned


## What's next for Elevate
Looking to expand into other realms of the EdTech space!