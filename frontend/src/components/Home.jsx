import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api";
import "./Home.css";
const Home = () => {
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [searchQuizQuery, setSearchQuizQuery] = useState("");
  const [createUserQuery, setCreateUserQuery] = useState("");
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

  return (
    <div className="home-page">
      <h1>This is my home page</h1>

      <form onSubmit={handleCreateUserSubmit}>
        <h2>Create a user</h2>
        <input
          type="text"
          placeholder="Username"
          value={createUserQuery}
          onChange={handleCreateUserChange}
        />
        <button type="submit">CREATE!</button>
      </form>

      <form onSubmit={handleSearchUserSubmit}>
        <h2>Search for a user</h2>
        <input
          type="text"
          placeholder="Search"
          value={searchUserQuery}
          onChange={handleSearchUserChange}
        />
        <button type="submit">GO!</button>
      </form>

      <form onSubmit={handleSearchQuizSubmit}>
        <h2>Search for a quiz</h2>
        <input
          type="text"
          placeholder="Search"
          value={searchQuizQuery}
          onChange={handleSearchQuizChange}
        />
        <button type="submit">GO!</button>
      </form>
    </div>
  );
};

export default Home;
