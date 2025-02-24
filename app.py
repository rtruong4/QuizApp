from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)
app.config["DEBUG"] = True


@app.route("/get-user/<username>", methods=["GET"])
def get_user(username):

    locUsername = username
    
    conn = sqlite3.connect(r"C:\Users\Ryan\Desktop\Work Files\QuizApp\database.db")

    cursor = conn.cursor()

    sql = f"select * from users where username='{locUsername}'"

    cursor.execute(sql)

    result = cursor.fetchall()

    return jsonify(result), 200

@app.route("/create-user", methods=["POST"])
def create_user():
    data = request.get_json()

    username = data["username"]
    try:
        conn = sqlite3.connect(r"C:\Users\Ryan\Desktop\Work Files\QuizApp\database.db")

        cursor = conn.cursor()
        
        sql = f"insert into users (username) VALUES ('{username}')"

        cursor.execute(sql)

        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"message": f"User '{username}'added succesfuly"}), 201


@app.route("/get-quiz/<quizName>", methods=["GET"])
def get_quiz(quizName):
    quiz_name = quizName

    try:
        conn = sqlite3.connect(r"C:\Users\Ryan\Desktop\Work Files\QuizApp\database.db")

        cursor = conn.cursor()
        

        #Get the quiz ID
        sql = f"select q.quizID from quiz q where q.quizName='{quiz_name}'"

        cursor.execute(sql)

        result = cursor.fetchone()
        quizID = result[0]

        #Get the questions for that quiz
        sql = f"select qq.questionID, qq.question from quiz q, quiz_questions qq where q.quizID = '{quizID}' and qq.quizID = '{quizID}'"

        cursor.execute(sql)
        result = cursor.fetchall()
        # [(1, 'What is the color of the sky?'), (2, 'What is the color of the sun?')]
        questions = result
        


        # Now get the choices for that question
        questionDict = {}
        for q in questions:
            questionID = q[0]
            question = q[1]
            sql = f"select c.choice, c.correct from choices c, quiz_questions qq where c.questionID = '{questionID}' and qq.questionID = '{questionID}'"

            cursor.execute(sql)
            result = cursor.fetchall()
            choices = result
            questionDict[question] = choices

        #Now we have a dictionary with all the questions and the choices for that quiz
        #{'What is the color of the sky?': [('red', 0), ('blue', 1), ('green', 0)], 'What is the color of the sun?': [('brown', 0), ('purple', 0), ('yellow', 1)]}
        print(questionDict)



        # print(question, choices)
        return jsonify(questionDict), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/create-quiz", methods=["POST"])
def create_quiz():
    #Create the quiz in quiz table
    #Create the questions in questions table
    #Create the choices for each question

    return "OK", 201
if __name__ == "__main__":
    app.run(debug=True)