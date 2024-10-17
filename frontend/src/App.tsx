import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./screens/SignUp/SignUp";
import Login from "./screens/Login/Login";
import LandingPage from "./screens/Landing/LandingPage";
import TopicsPage from "./screens/TopicSelection/TopicsPage";
import LoadingPage from "./screens/MatchingQueue/LoadingPage";
import QuestionManager from "./components/QuestionManager";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/LandingPg" element={<LandingPage />} />
        <Route path="/questions" element={<QuestionManager />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/loading" element={<LoadingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
