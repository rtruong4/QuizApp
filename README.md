# QuizApp

# Api for a small quiz app

- Currently supports creating users, creating quizzes with questions, deleting questions, deleting quizzes, and deleting users
- Users can be created, which have quizzes associated with them
- Questions can be added to these quizzes

# Please install mongoDB community server

- https://www.mongodb.com/docs/manual/administration/install-community/

# Steps to run locally

- Make sure you have python https://www.python.org/downloads/
- Make sure you have pip installed https://pip.pypa.io/en/stable/installation/
- cd into the backend directory
- pip install -r requirements.txt or pip3 install -r requirements.txt if you are on macOS or linux
- cd into the frontend directory
- run npm install
- cd back to the root directory
- "run npm dev", this should run the backend and frontend concurrently
- Server will start on localhost:5000 and frontend app will start on localhost:3000

# Test cases available in test_app.py in the backend directory

- python -m pytest test_app.py -v

# Endpoints to try. You may use postman or any other api testing platform to test

A postman collection and environment json file is available to import
https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data/

## Create user endpoint

- Create a user in the database
- localhost:5000/create-user
  - {"username" : "Any username you want"}

## Get user endpoint

- Gets the user and all quizzes that they own
- localhost:5000/get-user/'Your username'

## Create quiz endpoint

- Creates a new quiz and attaches it to a user
- localhost:5000/create-quiz
  - { "quizName": "Your quiz name", "owner": "Your username"}

## Create question endpoint

- Creates a question and adds it to an existing quiz
- localhost:5000/create-question
  - { "quizName": "Your quiz name", "question": "What color is the sun?", "choices": ["Blue", "Red", "Yellow", "Green"], "answer": "Yellow"}
    - Save the question ID you get from the response. We will use it to find the question later
- localhost:5000/create-question
  - { "quizName": "Your quiz name", "question": "What color is the sky?", "choices": ["Blue", "Red", "Yellow", "Green"], "answer": "Blue"}
    - Save the question ID you get from the response. We will use it to find the question later

## Get quiz endpoint

- Gets the quiz and all questions, choices, and answers for that quiz
- localhost:5000/get-quiz/"Your quiz name"

## Delete question endpoint

- Deletes a questuion from a quiz
- localhost:5000/delete-question
  - {"quizName": "Your quiz name", "questionID": "Your question ID"}

## Delete quiz endpoint

- Deletes a quiz and all its questions, choices, and answers
- localhost:5000/delete-quiz
  - {"quizName": "Your quiz name"}

## Cehck answer endpoint

- Gets the answer for a question
- localhost:5000/check-answer
  - {"quizName": "Your quiz name", "questionID": "Your question ID"}
