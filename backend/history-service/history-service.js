import { QuestionAttemptsHistory } from "./models/question-attempts-history.js";
import axios from "axios";

async function addAttemptHistory(attemptData) {
  const newAttemptHistory = new QuestionAttemptsHistory(attemptData);
  await newAttemptHistory.save();
}

async function getAttemptHistoryByUserId(userId) {
  const attemptHistories = await QuestionAttemptsHistory.find({ user_ids: userId });

  const populatedHistories = [];
  for (const attempt of attemptHistories) {
    try {
      const question_id= attempt.question_id;
      const questionResponse = await axios.get(`http://question-service:8000/api/v1/questions/${question_id}`);
      populatedHistories.push({
        ...attempt.toObject(),
        question: questionResponse.data,
      });
    } catch (error) {
      console.error(`Failed to fetch question details for question_id ${attempt.question_id}:`, error);
      populatedHistories.push({
        ...attempt.toObject(),
        question: null,
      });
    }
  }
  return populatedHistories;
}

async function updateAttemptHistory(attemptId, updateData) {
  return QuestionAttemptsHistory.findOneAndUpdate({ attempt_id: attemptId }, updateData, { new: true });
}

export {
  addAttemptHistory,
  getAttemptHistoryByUserId,
  updateAttemptHistory
};