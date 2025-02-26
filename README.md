# QuizApp

Api for a small quiz app

- Docker image also available to pull at rtruong63/flask-quiz-app:latest

Steps to run on docker

- Make sure you have docker installed https://www.docker.com/get-started/
- Go to root directory of project
- docker compose up -d

Test cases available in test_app.py

- python -m pytest test_app.py -v

Endpoints to try(Currently no front end is implemented). You may use postman or any other api testing platform to test

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
