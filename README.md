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
