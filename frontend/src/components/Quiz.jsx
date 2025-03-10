import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuiz } from "../api";
import "./Quiz.css";
const Quiz = () => {
  const { quizName } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [owner, setOwner] = useState([]);
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    const loadQuiz = async () => {
      const data = await getQuiz(quizName);
      if (data) {
        console.log(data);
        setQuiz(data.quizName);
        setOwner(data.owner);
        setQuestions(data.questions);
      } else {
        console.error("Quiz not found");
      }
    };

    loadQuiz();
  }, [quizName]);

  return (
    <div className="quiz-page">
      <Link to="/">Back to Home</Link>
      <h1>{quiz}</h1>
      <h2>
        <p>By</p>
        <Link to={`/user/${owner}`}>{owner}</Link>
      </h2>
      <ul>
        {questions.map((question, index) => (
          <div>
            <h2>{question.question}</h2>
            {question.choices.map((choice, index) => (
              <p>{choice}</p>
            ))}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Quiz;
