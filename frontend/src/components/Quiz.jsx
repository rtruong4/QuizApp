import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getQuiz, createQuestion, deleteQuiz, deleteQuestion } from "../api";
import { useNavigate } from "react-router-dom";
import "./Quiz.css";
const Quiz = () => {
  const { quizName } = useParams();
  const [quiz, setQuiz] = useState([]);
  const [owner, setOwner] = useState([]);
  const [questions, setQuestions] = useState([
    {
      _id: "",
      answer: "",
      choices: [],
      question: "",
    },
  ]);
  const [createQuestionQuery, setCreateQuestionQuery] = useState({
    question: "",
    answer: "",
    choice2: "",
    choice3: "",
    choice4: "",
  });
  const [quizExists, setQuizExists] = useState(false);
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

  const handleCreateQuestionChange = (e) => {
    const { name, value } = e.target;
    setCreateQuestionQuery((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCreateQuestionSubmit = (e) => {
    e.preventDefault();
    if (createQuestionQuery) {
      const createNewQuestion = async () => {
        try {
          const response = await createQuestion(createQuestionQuery, quiz);
          // Append to the quizzes array so it automatically shows up
          setCreateQuestionQuery({
            question: "",
            answer: "",
            choice2: "",
            choice3: "",
            choice4: "",
          });
          //Auto rerender the questions
          const data = await getQuiz(quizName);
          setQuestions(data.questions);
        } catch {
          console.error("error");
        }
      };

      createNewQuestion();
    }
  };

  const handleDeleteQuiz = () => {
    const loadDelete = async () => {
      try {
        const response = await deleteQuiz(quiz);
      } catch (error) {
        console.error("error", error);
      }
    };

    loadDelete();
    navigate(`/`);
  };

  const handleDeleteQuestion = (questionID) => {
    const loadDelete = async () => {
      try {
        const response = await deleteQuestion(questionID, quiz);
        // Re render the questions
        const data = await getQuiz(quizName);
        setQuestions(data.questions);
      } catch (error) {
        console.error("error", error);
      }
    };
    loadDelete();
  };

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
  return (
    <div className="quiz-page">
      <Link to="/" className="home-link">
        Back to Home
      </Link>
      <h1>{quiz}</h1>
      <h2 className="created-by">
        Created by <Link to={`/user/${owner}`}>{owner}</Link>
      </h2>
      <h2>Create a question</h2>
      <div className="create-question-form">
        <form onSubmit={handleCreateQuestionSubmit}>
          <div>
            <textarea
              type="text"
              name="question"
              placeholder="Question"
              value={createQuestionQuery.question}
              onChange={handleCreateQuestionChange}
              required
            />
            <textarea
              name="answer"
              value={createQuestionQuery.answer}
              onChange={handleCreateQuestionChange}
              placeholder="Answer"
              required
            />
            <textarea
              name="choice2"
              value={createQuestionQuery.choice2}
              onChange={handleCreateQuestionChange}
              placeholder="Choice 2"
              required
            />
            <textarea
              name="choice3"
              value={createQuestionQuery.choice3}
              onChange={handleCreateQuestionChange}
              placeholder="Choice 3"
              required
            />
            <textarea
              name="choice4"
              value={createQuestionQuery.choice4}
              onChange={handleCreateQuestionChange}
              placeholder="Choice 4"
              required
            />
            <button type="submit" className="create-question-btn">
              Create
            </button>
          </div>
        </form>
      </div>
      {questions.map((question, index) => (
        <div>
          <h2>{question.question}</h2>
          {question.choices.map((choice, index) => (
            <p
              key={index}
              style={{ color: choice === question.answer ? "green" : "red" }}
            >
              {choice}
            </p>
          ))}
          <button
            className="delete-question-btn"
            onClick={() => handleDeleteQuestion(question._id)}
          >
            Delete question
          </button>
        </div>
      ))}
      <div>
        <button className="delete-quiz-btn" onClick={handleDeleteQuiz}>
          Delete quiz
        </button>
      </div>
    </div>
  );
};

export default Quiz;
