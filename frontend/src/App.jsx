import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import User from "./components/User";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import TakeQuiz from "./components/TakeQuiz";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:name" element={<User />} />
        <Route path="/quiz/:quizName" element={<Quiz />} />
        <Route path="/take_quiz/:quizName" element={<TakeQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
