const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  participants: {
    type: [String], // List of user IDs (could be usernames)
    required: true,
  },
  question: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", RoomSchema);
