import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUser, createQuiz, deleteUser } from "../api";
import { useNavigate } from "react-router-dom";
import "./User.css";
const User = () => {
  const { name } = useParams();
  const [user, setUser] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [createQuizQuery, setCreateQuizQuery] = useState("");
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const loadUser = async () => {
      const data = await getUser(name);
      console.log(data);
      if (data.length !== 0) {
        setUser(data[0].username);
        setQuizzes(data[0].quizzes);
        setUserExists(true);
      } else {
        console.error("User not found");
        setUser(name);
        setUserExists(false);
      }
    };

    loadUser();
  }, []);

  const handleCreateQuizChange = (e) => {
    setCreateQuizQuery(e.target.value);
  };

  const handleCreateQuizSubmit = (e) => {
    e.preventDefault();
    if (createQuizQuery) {
      const createNewQuiz = async () => {
        try {
          const response = await createQuiz(createQuizQuery, user);
          // Append to the quizzes array so it automatically shows up
          setQuizzes((quizzes) => [...quizzes, createQuizQuery]);
          setCreateQuizQuery("");
        } catch {
          console.error("error");
        }
      };

      createNewQuiz();
    }
  };

  const handleDelete = () => {
    const loadDelete = async () => {
      try {
        const response = await deleteUser(name);
      } catch (error) {
        console.error("error", error);
      }
    };

    loadDelete();
    navigate(`/`);
  };

  if (userExists === false) {
    return (
      <div className="user-page">
        <Link to="/" className="home-link">
          Back to Home
        </Link>
        <h1>User {user} does not exist</h1>
      </div>
    );
  }
  return (
    <div className="user-page">
      <Link to="/" className="home-link">
        Back to Home
      </Link>
      <h1>{user}</h1>

      <form onSubmit={handleCreateQuizSubmit}>
        <h2>Create a quiz</h2>
        <input
          className="input-bar"
          type="text"
          placeholder="Quiz name"
          value={createQuizQuery}
          onChange={handleCreateQuizChange}
        />
        <button type="submit">CREATE!</button>
      </form>

      <div className="quiz-info">
        {quizzes.length > 0 && <h2>Quizzes by this user</h2>}

        {quizzes.map((quiz, index) => (
          <div className="quiz-link">
            <Link to={`/quiz/${quiz}`}>{quiz}</Link>
          </div>
        ))}
      </div>
      <div>
        <button className="delete-button" onClick={handleDelete}>
          Delete user
        </button>
      </div>
    </div>
  );
};

export default User;
