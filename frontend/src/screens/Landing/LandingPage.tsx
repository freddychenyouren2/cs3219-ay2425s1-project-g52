import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import QuestionHistory from "./QuestionHistory";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const username = sessionStorage.getItem("username") || "Guest";
  const navigate = useNavigate();

  const usageStreak = 7;

  const handleStartSession = () => {
    navigate("/topicsPage", { state: { username } });
  };

  const handleLogOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="landing-page-container">
      <div className="log-out-container">
        <Button
          style={{
            backgroundColor: "#1D192A",
            color: "white",
            borderRadius: 20,
            width: 75,
            height: 40,
          }}
          onClick={handleLogOut}
        >
          Log Out
        </Button>
      </div>

      <header className="landing-page-header">
        <div className="welcome-section">
          <h1 className="welcome-message">Welcome, {username}</h1>
          <button className="start-session-button" onClick={handleStartSession}>
            Start a Session
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="history-section">
          <h2 className="section-title">Question History</h2>
          <QuestionHistory />
        </section>

        <section className="streak-section">
          <h2 className="section-title">Usage Streak</h2>
          <div className="streak-display">
            <span className="streak-number">{usageStreak}</span>
            <span className="streak-label">Days</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;