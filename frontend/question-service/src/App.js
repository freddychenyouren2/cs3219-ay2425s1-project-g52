import logo from "./logo.svg";
import "./App.css";
import axios from "./axios.js";
import React, { useState, useEffect } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
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
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
