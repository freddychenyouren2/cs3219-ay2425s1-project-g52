import { QuestionAttemptsHistory } from "./models/question-attempts-history.js";

async function addAttemptHistory(attemptData) {
  const newAttemptHistory = new QuestionAttemptsHistory(attemptData);
  await newAttemptHistory.save();
}

async function getAttemptHistoryByUserId(userId) {
  return QuestionAttemptsHistory.find({ user_ids: userId }).populate('question_id');
}

async function updateAttemptHistory(attemptId, updateData) {
  return QuestionAttemptsHistory.findOneAndUpdate({ attempt_id: attemptId }, updateData, { new: true });
}

export {
  addAttemptHistory,
  getAttemptHistoryByUserId,
  updateAttemptHistory
};