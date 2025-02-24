from flask import Flask, request, jsonify
from pymongo import MongoClient
from bson import ObjectId
app = Flask(__name__)
app.config["DEBUG"] = True

client = MongoClient("mongodb://localhost:27017/")

db = client["quizAppDB"]
user_collection = db["users"]
quiz_collection = db["quizzes"]

#make sure there are no duplicate quiz names
user_collection.create_index([("username", 1)], unique=True)
quiz_collection.create_index([("quizName", 1)], unique=True)

#home page
@app.route('/')
def home():
    return "Hello world!"


#Get information from a user
@app.route("/get-user/<username>", methods=["GET"])
def get_user(username):
    user = list(user_collection.find({"username": username}, {"_id": 0}))
    return jsonify(user), 200

#Create a new user
#Expects JSON object with username
@app.route("/create-user", methods=["POST"])
def create_user():
    data = request.get_json()
    username = data["username"]
    user = {"username": username, "quizzes": []}
    try:
        user_collection.insert_one(user)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"message": f"User '{user}' created successfully"}), 201


#Create a new quiz and attach it to a user
#Expects JSON object with quizName and owner
@app.route("/create-quiz", methods=["POST"])
def create_quiz():
    data = request.get_json()
    quizName = data["quizName"]
    owner = data["owner"]
    quiz = {"quizName": quizName, "owner": owner, "questions": []}
    try:
        quiz_collection.insert_one(quiz)
        user_collection.update_one({"username": owner}, {"$push": {"quizzes": quizName}}) #Use quiz name since quiz names are unique
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    return jsonify({"message": f"Quiz '{quizName}' created successfully"}), 201

#Create question for a quiz
#Expects JSON object with quizName, question, choices, and answer
# {  
#     "quizName": "my_first_quiz",
#     "question": "What color is the grass?",
#     "choices": ["Blue", "Red", "Yellow", "Green"],
#     "answer": "Green"
# }
@app.route("/create-question", methods=["POST"])
def create_question():
    data = request.get_json()

    quizName = data["quizName"]

    #Check if quiz exists
    if not list(quiz_collection.find({"quizName": quizName}, {"_id": 0})):
        return f"quiz '{quizName}' not found", 400
    
    questionObject = {
        "question": data["question"],
        "choices": data["choices"],
        "answer": data["answer"],
        "_id": ObjectId() #Need to attach an ID so we can modify it later
    }

    quiz_collection.update_one(
        {"quizName": quizName},
        {"$push": {"questions": questionObject}}
    )

    return jsonify({"message": f"Question '{data["question"]}' in quiz '{quizName}'created successfully"}), 201


#Gets a quiz and all questions
@app.route("/get-quiz/<quizName>", methods=["GET"])
def get_quiz(quizName):

    quiz = quiz_collection.find_one({"quizName": quizName}, {"_id": 0})
    if not quiz:
        return "Quiz not found", 404
    
    #need to convert objectID objects to string
    for q in quiz["questions"]:
        q["_id"] = str(q["_id"])
    return jsonify(quiz), 200

#Deletes a question by ID
#Expects JSON object with quizNAme and questionID
@app.route("/delete-question", methods = ["DELETE"])
def delete_question():
    data = request.get_json()

    quizName = data["quizName"]
    questionID = ObjectId(data["questionID"]) #Need to convert the ID to objectID type to match

    

    value = quiz_collection.update_one({"quizName": quizName}, {"$pull": {"questions" : {"_id": questionID}}})
    

    if value.modified_count > 0:
        return jsonify({"message": f"Question '{data["questionID"]}' in quiz '{quizName}' deleted successfully"}), 200
    else:
        return f"Question '{data["questionID"]}' not found", 404

#Deletes a quiz by name
#Expects a JSON object with quizName
@app.route("/delete-quiz", methods = ["DELETE"])
def delete_quiz():
    data = request.get_json()

    quizName = data["quizName"]

    #Find the owner's username
    quiz = quiz_collection.find_one({"quizName": quizName}, {"_id": 0})
    username = quiz["owner"]

    value = quiz_collection.delete_one({"quizName": quizName})
    userValue = user_collection.update_one({"username": username}, {"$pull": {"quizzes": quizName}})

    if value.deleted_count > 0 and userValue.modified_count > 0:
        return jsonify({"message": f"quiz '{quizName}'  deleted successfully"}), 200
    else:
        return f"Quiz '{quizName}' not found", 404

#Gets the answer for a question
#Expects JSON object with quizName and questionID
@app.route("/get-answer", methods = ["GET"])
def check_answer():
    data = request.get_json()

    quizName = data["quizName"]
    questionID = ObjectId(data["questionID"])

    question = quiz_collection.find_one({"quizName": quizName, "questions._id": questionID}, {"_id": 0, "questions.$": 1})

    if not question:
        return "No question found", 404
    correctAnswer = question["questions"][0]["answer"]

    return (correctAnswer)

if __name__ == "__main__":
    app.run(debug=True)