import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Tooltip, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css"; // Ensure this import is present

interface QuestionAttempt {
  date: string;
  time: string;
  title: string;
  difficulty: string;
  topic: string;
  partner: string;
  description: string;
  code_contents: string;
  solution_code: string;
  whiteboard_state: any;
}

const QuestionHistory: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const username = sessionStorage.getItem("username") || "Guest";

  useEffect(() => {
    // Fetch question history data from the API
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/history/user/${username}`);
        const data = response.data;
        const formattedData = data.map((item: any) => ({
          date: new Date(item.first_attempt_date).toLocaleDateString(),
          time: new Date(item.first_attempt_date).toLocaleTimeString(),
          title: item.question.qTitle,
          difficulty: item.question.qComplexity,
          topic: item.question.qCategory.join(", "),
          partner: item.user_ids.find((user: string) => user !== username), 
          description: item.question.qDescription,
          code_contents: item.code_contents,
          solution_code: item.question.qSolution,
          whiteboard_state: item.whiteboard_state,
        }));

        // Sort the data by date and time, newest first
        formattedData.sort((a: QuestionAttempt, b: QuestionAttempt) => {
          const dateA = new Date(`${a.date} ${a.time}`).getTime();
          const dateB = new Date(`${b.date} ${b.time}`).getTime();
          return dateB - dateA;
        });

        setQuestions(formattedData);
      } catch (error) {
        console.error("Failed to fetch question history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [username]);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: QuestionAttempt) => (
        <Tooltip title={record.description}>
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/questionAttempt", { state: { question: record } })}
          >
            {text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty: string) => (
        <span className={`difficulty-badge ${difficulty.toLowerCase()}`}>
          {difficulty}
        </span>
      ),
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Partner",
      dataIndex: "partner",
      key: "partner",
    },
  ];

  return (
    <div style={{ height: "400px", overflowY: "auto" }}>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table columns={columns} dataSource={questions} rowKey="title" scroll={{ y: 300 }} pagination={false} />
      )}
    </div>
  );
};

export default QuestionHistory;