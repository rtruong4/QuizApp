import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuiz } from "../api";
import { useNavigate } from "react-router-dom";
import "./TakeQuiz.css";
const TakeQuiz = () => {
  const { quizName } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [owner, setOwner] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerList, setAnswerList] = useState({});
  const [answerCheck, setAnswerCheck] = useState("");
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [quizExists, setQuizExists] = useState(false);
  const [buttonHighlighted, setButtonHighlighted] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const loadQuiz = async () => {
      const data = await getQuiz(quizName);
      if (data.length !== 0) {
        setQuiz(data.quizName);
        setOwner(data.owner);
        setQuestions(data.questions);
        setQuizExists(true);
      } else {
        setQuizExists(false);
        setQuiz(quizName);
        console.error("Quiz not found");
      }
    };

    loadQuiz();
  }, [quizName]);

  const handleSelectAnswer = (answer, index) => {
    setButtonHighlighted(index);
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      return;
    }
    setButtonHighlighted(null);
    setAnswerList((prevAnswers) => ({
      ...prevAnswers,
      [questions[currentQuestionIndex]._id]: selectedAnswer,
    }));
    const correct = selectedAnswer == questions[currentQuestionIndex].answer;
    if (correct) {
      setAnswerCheck("Correct.");
      setAnswerSubmitted(true);
    } else {
      setAnswerCheck("Incorrect, try again.");
    }
  };

  const handleNext = () => {
    setButtonHighlighted(null);
    setAnswerSubmitted(false);
    setSelectedAnswer(null);
    setAnswerCheck("");
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleFinish = (e) => {
    e.preventDefault();
    navigate(`/`);
  };
  const currentQuestion = questions[currentQuestionIndex];

  if (quizExists === false) {
    return (
      <div className="quiz-page">
        <Link to="/" className="home-link">
          Back to Home
        </Link>
        <h1>Quiz {quiz} does not exist</h1>
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div className="quiz-page">
        <Link to="/" className="home-link">
          Back to Home
        </Link>
        <h1>Quiz {quiz} does not have any questions yet</h1>
      </div>
    );
  }
  if (!currentQuestion) {
    return <div>Loading</div>;
  }

  return (
    <div className="take-quiz-page">
      <Link to="/" className="home-link">
        Back to Home
      </Link>
      <div className="question">
        <h2>
          Question {currentQuestionIndex + 1}: {currentQuestion.question}
        </h2>
        <div className="questions-list">
          {currentQuestion.choices.map((choice, index) => (
            <div>
              <button
                key={index}
                className={
                  !answerSubmitted
                    ? buttonHighlighted === index
                      ? "highlighted-btn"
                      : "regular-btn"
                    : "greyed-btn"
                }
                onClick={() => handleSelectAnswer(choice, index)}
              >
                {choice}
              </button>
              <br></br>
            </div>
          ))}
        </div>
        {answerCheck && <p>{answerCheck}</p>}

        {!answerSubmitted && (
          <button className="bottom-btn" onClick={handleSubmit}>
            Submit
          </button>
        )}

        {answerSubmitted && currentQuestionIndex < questions.length - 1 && (
          <button className="bottom-btn" onClick={handleNext}>
            Next
          </button>
        )}

        {answerSubmitted && currentQuestionIndex === questions.length - 1 && (
          <button className="bottom-btn" onClick={handleFinish}>
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;
