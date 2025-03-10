import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

export const getUser = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/get-user/${name}`);
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return [];
  }
};

export const getQuiz = async (quizName) => {
  try {
    const response = await axios.get(`${API_URL}/get-quiz/${quizName}`);
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return [];
  }
};

export const createUser = async (name) => {
  const userData = {
    username: name,
  };
  try {
    const response = await axios.post(`${API_URL}/create-user`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
};

export const createQuiz = async (quizName, ownerName) => {
  const quizData = {
    quizName: quizName,
    owner: ownerName,
  };
  try {
    const response = await axios.post(`${API_URL}/create-quiz`, quizData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
};
