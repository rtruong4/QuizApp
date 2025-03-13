import axios from "axios";

const API_URL = "http://localhost:5000";

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

export const createQuestion = async (questionObject, quizName) => {
  console.log(questionObject);
  console.log(quizName);
  const choices = [
    questionObject.answer,
    questionObject.choice2,
    questionObject.choice3,
    questionObject.choice4,
  ];
  const questionData = {
    quizName: quizName,
    question: questionObject.question,
    choices: choices,
    answer: questionObject.answer,
  };
  try {
    const response = await axios.post(
      `${API_URL}/create-question`,
      questionData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
};

export const deleteUser = async (name) => {
  const userObject = {
    username: name,
  };
  try {
    const response = await axios.delete(`${API_URL}/delete-user`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: userObject,
    });
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
};

export const deleteQuiz = async (quizName) => {
  const quizObject = {
    quizName: quizName,
  };
  try {
    const response = await axios.delete(`${API_URL}/delete-quiz`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: quizObject,
    });
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
};

export const deleteQuestion = async (questionID, quizName) => {
  const questionObject = {
    quizName: quizName,
    questionID: questionID,
  };
  try {
    const response = await axios.delete(`${API_URL}/delete-question`, {
      headers: {
        "Content-Type": "application/json",
      },
      data: questionObject,
    });
    return response.data;
  } catch (error) {
    console.error("Error", error);
    return error;
  }
};
