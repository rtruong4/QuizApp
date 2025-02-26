# QuizApp

# Api for a small quiz app

- Currently supports creating users, creating quizzes with questions, deleting questions, deleting quizzes
- Docker image also available to pull at rtruong63/flask-quiz-app:latest

# Please install mongoDB community server

- https://www.mongodb.com/docs/manual/administration/install-community/

# Steps to run on docker

- Make sure you have docker installed https://www.docker.com/get-started/
- Go to root directory of project
- docker compose up -d
- Server will start on localhost:5001

# Steps to run locally

- Make sure you have python https://www.python.org/downloads/
- Make sure you have pip installed https://pip.pypa.io/en/stable/installation/
- pip install -r requirements.txt or pip3 install -r requirements.txt if you are on macOS or linux
- python main.py or python3 main.py if you are on macOS or linux
- Server will start on localhost:5000

# Test cases available in test_app.py

- python -m pytest test_app.py -v

# Endpoints to try(Currently no front end is implemented). You may use postman or any other api testing platform to test

A postman collection json file is available to import

- localhost:5000/create-user
  - {"username" : "Any username you want"}
- localhost:5000/get-user/'Your username'
- localhost:5000/create-quiz
  - { "quizName": "Your quiz name", "owner": "Your username"}
- localhost:5000/create-question
  - { "quizName": "Your quiz name", "question": "What color is the sun?", "choices": ["Blue", "Red", "Yellow", "Green"], "answer": "Yellow"}
    - Save the question ID you get from the response. We will use it to find the question later
- localhost:5000/create-question
  - { "quizName": "Your quiz name", "question": "What color is the sky?", "choices": ["Blue", "Red", "Yellow", "Green"], "answer": "Blue"}
    - Save the question ID you get from the response. We will use it to find the question later
- localhost:5000/get-quiz/"Your quiz name"
- localhost:5000/delete-question
  - {"quizName": "Your quiz name", "questionID": "Your question ID"}
- localhost:5000/delete-quiz
  - {"quizName": "Your quiz name"}
- localhost:5000/check-answer
  - {"quizName": "Your quiz name", "questionID": "Your question ID"}
