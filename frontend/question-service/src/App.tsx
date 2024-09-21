import React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "./axios";
import { useState, useEffect } from "react";
import Question from "./Question";

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);

  //GET Questions from the backend server
  useEffect(() => {
    axios
      .get("/questions/all")
      .then((response) => {
        setQuestions(response.data.data.questions);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  console.log(questions);

  /**
   * Add Questions to the database
   * Edit Questions in the database
   * Delete a question from the database
   */

  return (
    <div className="App">
      <header className="App-header">
        <h1>Question List</h1>
        {questions.map((question, key) => {
          return (
            <div key={key} className="App-header">
              <h1>{question.qId}</h1>
              <h1>{question.qTitle}</h1>
            </div>
          );
        })}
      </header>
    </div>
  );
}

export default App;
