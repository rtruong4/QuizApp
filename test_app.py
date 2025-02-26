import pytest
import mongomock
from main import app, create_test_db
from pymongo import MongoClient


testQuizName = "testQuiz"
testUsername = "ryan123"
firstQuestionID = ""
secondQuestionID = ""
@pytest.fixture
def client():
    app.config["TESTING"] = True

    testClient = mongomock.MongoClient()
    testDB = testClient["test_db"]

    #Recreate indexes
    testDB["users"].create_index([("username", 1)], unique=True)
    testDB["quizzes"].create_index([("quizName", 1)], unique=True)

    create_test_db(testDB)

    with app.test_client() as client:
        yield client

def test_hello(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.get_json() == {"message": "Hello world"}

def test_create_user(client):
    testUsername = "ryan123"
    response = client.post("/create-user", json={"username" : testUsername})
    assert response.status_code == 201
    assert response.get_json() == {"message" : f"User '{testUsername}' created successfully"}

def test_get_user(client):
    #Create the user
    testUsername = "ryan123"
    response = client.post("/create-user", json={"username" : testUsername})
    assert response.status_code == 201
    assert response.get_json() == {"message" : f"User '{testUsername}' created successfully"}

    #Test if exists
    response = client.get(f"/get-user/{testUsername}")
    assert response.status_code == 200
    assert response.get_json() == [{
        "quizzes" : [],
        "username": testUsername
    }]

    #Test non existent user
    response = client.get("/get-user/fakeUser123")
    assert response.status_code == 200
    assert response.get_json() == []

def test_create_quiz(client):
    testQuizName = "testQuiz"

    #Create owner of quiz
    testUsername = "ryan123"
    response = client.post("/create-user", json={"username" : testUsername})
    assert response.status_code == 201
    assert response.get_json() == {"message" : f"User '{testUsername}' created successfully"}

    #Create the quiz
    response = client.post("/create-quiz", json={"quizName": testQuizName, "owner": testUsername})
    assert response.status_code == 201
    assert response.get_json() == {
        "message": f"Quiz '{testQuizName}' created successfully"
    }

    #See if quiz is attached to user
    response = client.get(f"/get-user/{testUsername}")
    assert response.status_code == 200
    assert response.get_json() == [{
        "quizzes" : [testQuizName],
        "username": testUsername
    }]

def test_create_quiz_with_questions(client):
    testQuizName = "testQuiz"

    #Create owner of quiz
    testUsername = "ryan123"
    response = client.post("/create-user", json={"username" : testUsername})
    assert response.status_code == 201
    assert response.get_json() == {"message" : f"User '{testUsername}' created successfully"}

    #Create the quiz
    response = client.post("/create-quiz", json={"quizName": testQuizName, "owner": testUsername})
    assert response.status_code == 201
    assert response.get_json() == {
        "message": f"Quiz '{testQuizName}' created successfully"
    }

    #create first question
    questionObject1 = {  
        "quizName": testQuizName,
        "question": "What color is the sun?",
        "choices": ["Blue", "Red", "Yellow", "Green"],
        "answer": "Yellow"
    }

    response = client.post("/create-question", json=questionObject1)
    assert response.status_code == 201
    assert response.get_json()["message"] == f"Question 'What color is the sun?' in quiz '{testQuizName}' created successfully"
    firstQuestionID = response.get_json()["questionID"]

    #create second question
    questionObject2 = {
        "quizName": testQuizName,
        "question": "What color is the sky?",
        "choices": ["Blue", "Red", "Yellow", "Green"],
        "answer": "Blue"
    }
    
    response = client.post("/create-question", json=questionObject2)
    assert response.status_code == 201
    assert response.get_json()["message"] == f"Question 'What color is the sky?' in quiz '{testQuizName}' created successfully"
    secondQuestionID = response.get_json()["questionID"]

    #Get the quiz and see if output is correct
    response = client.get(f"/get-quiz/{testQuizName}")
    assert response.status_code == 200
    assert response.get_json() == {
        "owner" : testUsername,
        "quizName" : testQuizName,
        "questions": [
            {
                "_id": firstQuestionID,
                "answer": "Yellow",
                "choices": ["Blue", "Red", "Yellow", "Green"],
                "question": "What color is the sun?"
            },
            {
                "_id": secondQuestionID,
                "answer": "Blue",
                "choices": ["Blue", "Red", "Yellow", "Green"],
                "question": "What color is the sky?"
            }
        ]
    }


def test_delete_question(client):
    #Create owner of quiz
    response = client.post("/create-user", json={"username" : testUsername})
    assert response.status_code == 201
    assert response.get_json() == {"message" : f"User '{testUsername}' created successfully"}

    #Create the quiz
    response = client.post("/create-quiz", json={"quizName": testQuizName, "owner": testUsername})
    assert response.status_code == 201
    assert response.get_json() == {
        "message": f"Quiz '{testQuizName}' created successfully"
    }

    #create first question
    questionObject1 = {  
        "quizName": testQuizName,
        "question": "What color is the sun?",
        "choices": ["Blue", "Red", "Yellow", "Green"],
        "answer": "Yellow"
    }

    response = client.post("/create-question", json=questionObject1)
    assert response.status_code == 201
    assert response.get_json()["message"] == f"Question 'What color is the sun?' in quiz '{testQuizName}' created successfully"
    firstQuestionID = response.get_json()["questionID"]

    #create second question
    questionObject2 = {
        "quizName": testQuizName,
        "question": "What color is the sky?",
        "choices": ["Blue", "Red", "Yellow", "Green"],
        "answer": "Blue"
    }
    
    response = client.post("/create-question", json=questionObject2)
    assert response.status_code == 201
    assert response.get_json()["message"] == f"Question 'What color is the sky?' in quiz '{testQuizName}' created successfully"
    secondQuestionID = response.get_json()["questionID"]

    #Get the quiz and see if output is correct
    response = client.get(f"/get-quiz/{testQuizName}")
    assert response.status_code == 200
    assert response.get_json() == {
        "owner" : testUsername,
        "quizName" : testQuizName,
        "questions": [
            {
                "_id": firstQuestionID,
                "answer": "Yellow",
                "choices": ["Blue", "Red", "Yellow", "Green"],
                "question": "What color is the sun?"
            },
            {
                "_id": secondQuestionID,
                "answer": "Blue",
                "choices": ["Blue", "Red", "Yellow", "Green"],
                "question": "What color is the sky?"
            }
        ]
    }

    #Delete the first question
    response = client.delete("/delete-question", json={"quizName": testQuizName, "questionID": firstQuestionID})
    assert response.status_code == 200
    assert response.get_json() == {
        "message": f"Question '{firstQuestionID}' in quiz '{testQuizName}' deleted successfully"
    }

    #check if question was deleted
    response = client.get(f"/get-quiz/{testQuizName}")
    assert response.status_code == 200
    assert response.get_json() == {
        "owner" : testUsername,
        "quizName" : testQuizName,
        "questions": [
            {
                "_id": secondQuestionID,
                "answer": "Blue",
                "choices": ["Blue", "Red", "Yellow", "Green"],
                "question": "What color is the sky?"
            }
        ]
    }

def test_delete_quiz(client):
    #Create owner of quiz
    response = client.post("/create-user", json={"username" : testUsername})
    assert response.status_code == 201
    assert response.get_json() == {"message" : f"User '{testUsername}' created successfully"}

    #Create the quiz
    response = client.post("/create-quiz", json={"quizName": testQuizName, "owner": testUsername})
    assert response.status_code == 201
    assert response.get_json() == {
        "message": f"Quiz '{testQuizName}' created successfully"
    }

    #create first question
    questionObject1 = {  
        "quizName": testQuizName,
        "question": "What color is the sun?",
        "choices": ["Blue", "Red", "Yellow", "Green"],
        "answer": "Yellow"
    }

    response = client.post("/create-question", json=questionObject1)
    assert response.status_code == 201
    assert response.get_json()["message"] == f"Question 'What color is the sun?' in quiz '{testQuizName}' created successfully"
    firstQuestionID = response.get_json()["questionID"]

    #create second question
    questionObject2 = {
        "quizName": testQuizName,
        "question": "What color is the sky?",
        "choices": ["Blue", "Red", "Yellow", "Green"],
        "answer": "Blue"
    }
    
    response = client.post("/create-question", json=questionObject2)
    assert response.status_code == 201
    assert response.get_json()["message"] == f"Question 'What color is the sky?' in quiz '{testQuizName}' created successfully"
    secondQuestionID = response.get_json()["questionID"]

    #Get the quiz and see if output is correct
    response = client.get(f"/get-quiz/{testQuizName}")
    assert response.status_code == 200
    assert response.get_json() == {
        "owner" : testUsername,
        "quizName" : testQuizName,
        "questions": [
            {
                "_id": firstQuestionID,
                "answer": "Yellow",
                "choices": ["Blue", "Red", "Yellow", "Green"],
                "question": "What color is the sun?"
            },
            {
                "_id": secondQuestionID,
                "answer": "Blue",
                "choices": ["Blue", "Red", "Yellow", "Green"],
                "question": "What color is the sky?"
            }
        ]
    }

    response = client.delete("/delete-quiz", json={"quizName": testQuizName})
    assert response.status_code == 200
    assert response.get_json() == {
        "message" : f"quiz '{testQuizName}' deleted successfully"
    }

    #Check that quiz no longer exists
    response = client.get(f"get-quiz/{testQuizName}")
    assert response.status_code == 404
    assert response.get_json() == {
        "error" : f"Quiz '{testQuizName}' not found"
    }