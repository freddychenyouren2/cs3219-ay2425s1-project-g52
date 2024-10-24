const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const connectionURL = process.env.ATLAS_URI || "";
const cors = require("cors");
const frontendURL = process.env.frontendURL || "http://localhost:3000";

// Connect to MongoDB
mongoose
  .connect(connectionURL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

// Serve the React app (if needed)
app.use(express.static("client/build"));
const io = socketIo(server, {
  cors: {
    origin: frontendURL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const Room = require("./models/Room");

// Create a new room with two participants
app.post("/create-room", async (req, res) => {
  console.log("req:", req.body);
  const { roomId, participants } = req.body;
  console.log("roomId", roomId);
  console.log("part", participants);
  console.log("api called");
  try {
    // Check if room already exists
    let existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res
        .status(400)
        .json({ message: "Room already exists", status: 400 });
    }

    const newRoom = new Room({ roomId, participants });
    await newRoom.save();
    return res
      .status(201)
      .json({ message: "Room created", room: newRoom, status: 201 });
  } catch (err) {
    return res.status(500).json({
      message: "Error creating room",
      error: err.message,
      status: 500,
    });
  }
});

// Get room details by roomId (Check if room exists)
app.get("/room-exists/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
    // Find room by roomId
    let room = await Room.findOne({ roomId });
    if (room) {
      // If room exists, return a positive response
      return res.status(200).json({ exists: true, room });
    } else {
      // If room doesn't exist, return a negative response
      return res.status(200).json({ exists: false });
    }
  } catch (err) {
    // Catch and return errors
    return res
      .status(500)
      .json({ message: "Error checking room", error: err.message });
  }
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Join room event
  socket.on("joinRoom", async (roomId, username) => {
    try {
      const room = await Room.findOne({ roomId });
      if (!room) {
        console.log("Room does not exist");
        socket.emit("error", { message: "Room not found" });
        return;
      }

      // Check if the room is full
      if (
        room.participants.length >= 2 &&
        !room.participants.includes(username)
      ) {
        socket.emit("error", { message: "Room full" });
        return;
      }

      // Add user to the room
      if (!room.participants.includes(username)) {
        room.participants.push(username);
        await room.save();
      }

      // Join the Socket.IO room
      socket.join(roomId);
      console.log(`${username} joined room: ${roomId}`);

      // Notify other users in the room that a user joined
      socket.to(roomId).emit("userJoined", { username });
    } catch (err) {
      socket.emit("error", {
        message: "Error joining room",
        error: err.message,
      });
    }
  });

  // Handle real-time drawing
  socket.on("drawing", (data) => {
    const { roomId, ...drawingData } = data;
    socket.to(roomId).emit("drawing", drawingData); // Broadcast drawing data to the room
  });

  // Handle real-time chat messages
  socket.on("sendMessage", (messageData) => {
    const { roomId, username, text, timestamp } = messageData;

    // Broadcast the message to everyone else in the room
    io.to(roomId).emit("receiveMessage", {
      username,
      text,
      timestamp,
    });

    console.log(`Message from ${username} in room ${roomId}: ${text}`);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
