import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUser, createQuiz } from "../api";
import "./User.css";
const User = () => {
  const { name } = useParams();
  const [user, setUser] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [createQuizQuery, setCreateQuizQuery] = useState("");
  useEffect(() => {
    const loadUser = async () => {
      const data = await getUser(name);
      if (data) {
        setUser(data[0].username);
        setQuizzes(data[0].quizzes);
      } else {
        console.error("User not found");
      }
    };

    loadUser();
  }, [name]);

  const handleCreateQuizChange = (e) => {
    setCreateQuizQuery(e.target.value);
  };

  const handleCreateQuizSubmit = (e) => {
    e.preventDefault();
    if (createQuizQuery) {
      const createNewQuiz = async () => {
        try {
          const response = await createQuiz(createQuizQuery, user);
          // Refresh the page here
          setCreateQuizQuery("");
          loadUser();
        } catch {
          console.error("error");
        }
      };

      createNewQuiz();
    }
  };

  return (
    <div className="user-page">
      <Link to="/">Back to Home</Link>
      <h1>{user}</h1>

      <form onSubmit={handleCreateQuizSubmit}>
        <h2>Create a quiz</h2>
        <input
          type="text"
          placeholder="Quiz name"
          value={createQuizQuery}
          onChange={handleCreateQuizChange}
        />
        <button type="submit">CREATE!</button>
      </form>

      <div className="quiz-info">
        <h2>Quizzes by this user</h2>
        <ul>
          {quizzes.map((quiz, index) => (
            <div className="quiz-link">
              <Link to={`/quiz/${quiz}`}>{quiz}</Link>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default User;
