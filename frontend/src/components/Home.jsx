import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api";
import "./Home.css";
const Home = () => {
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [searchQuizQuery, setSearchQuizQuery] = useState("");
  const [createUserQuery, setCreateUserQuery] = useState("");
  const [takeQuizQuery, setTakeQuizQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchUserChange = (e) => {
    setSearchUserQuery(e.target.value);
  };

  const handleSearchUserSubmit = (e) => {
    e.preventDefault();
    if (searchUserQuery) {
      navigate(`/user/${searchUserQuery}`);
    }
  };

  const handleSearchQuizChange = (e) => {
    setSearchQuizQuery(e.target.value);
  };

  const handleSearchQuizSubmit = (e) => {
    e.preventDefault();
    if (searchQuizQuery) {
      navigate(`/quiz/${searchQuizQuery}`);
    }
  };

  const handleCreateUserChange = (e) => {
    setCreateUserQuery(e.target.value);
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    if (createUserQuery) {
      const createNewUser = async () => {
        try {
          const response = await createUser(createUserQuery);
          navigate(`/user/${createUserQuery}`);
        } catch {
          console.error("error");
        }
      };

      createNewUser();
    }
  };

  const handleTakeQuizChange = (e) => {
    setTakeQuizQuery(e.target.value);
  };

  const handleTakeQuizSubmit = (e) => {
    e.preventDefault();
    if (setTakeQuizQuery) {
      navigate(`/take_quiz/${takeQuizQuery}`);
    }
  };

  return (
    <div className="home-page">
      <h1 className="home-title">Quiz app</h1>
      <div className="form-group">
        <form onSubmit={handleCreateUserSubmit} className="home-page-form">
          <h2>Create a user</h2>
          <input
            className="input-bar"
            type="text"
            placeholder="Username"
            value={createUserQuery}
            onChange={handleCreateUserChange}
          />
          <button type="submit">Create</button>
        </form>
        <form onSubmit={handleSearchUserSubmit} className="home-page-form">
          <h2>Search for a user and create quizzes</h2>
          <input
            className="input-bar"
            type="text"
            placeholder="Search"
            value={searchUserQuery}
            onChange={handleSearchUserChange}
          />
          <button type="submit">Search</button>
        </form>
        <form onSubmit={handleSearchQuizSubmit} className="home-page-form">
          <h2>Search for and edit a quiz</h2>
          <input
            className="input-bar"
            type="text"
            placeholder="Search"
            value={searchQuizQuery}
            onChange={handleSearchQuizChange}
          />
          <button type="submit">Search</button>
        </form>

        <form onSubmit={handleTakeQuizSubmit} className="home-page-form">
          <h2>Search for and take a quiz</h2>
          <input
            className="input-bar"
            type="text"
            placeholder="Search"
            value={takeQuizQuery}
            onChange={handleTakeQuizChange}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
