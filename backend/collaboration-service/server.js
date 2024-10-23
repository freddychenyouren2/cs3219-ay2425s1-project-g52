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

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
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
  console.log("req:", req);
  const { roomId, participants } = req.body;
  console.log("roomId", roomId);
  console.log("part", participants);
  console.log("api called");
  try {
    // Check if room already exists
    let existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const newRoom = new Room({ roomId, participants });
    await newRoom.save();
    return res.status(201).json({ message: "Room created", room: newRoom });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating room", error: err.message });
  }
});

// Join a room and handle real-time drawing
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", async (roomId, username) => {
    try {
      // Find the room by ID
      const room = await Room.findOne({ roomId });
      if (!room) {
        console.log("Room does not exist");
        socket.emit("error", { message: "Room not found" });
        return;
      }

      // Ensure room has exactly two participants
      if (
        room.participants.length >= 2 &&
        !room.participants.includes(username)
      ) {
        socket.emit("error", { message: "Room full" });
        return;
      }

      // Add user to the room participants
      if (!room.participants.includes(username)) {
        room.participants.push(username);
        await room.save();
      }

      // Join the Socket.IO room
      socket.join(roomId);
      console.log(`${username} joined room: ${roomId}`);

      // Notify other users in the room
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

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
