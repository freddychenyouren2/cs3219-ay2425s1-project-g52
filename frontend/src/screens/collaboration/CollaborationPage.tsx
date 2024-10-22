import { Box, Typography, Button } from "@mui/material";
import CodeEditor from "./CodeEditor";
import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import Whiteboard from "./Whiteboard";

const socketURL = process.env.REACT_APP_COLLABORATION_SERVICE_BASE_URL;
const socket = io(socketURL);

const CollaborationPage = () => {
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const [roomId, setRoomId] = useState(query.get("roomId"));
  const [username, setUsername] = useState(query.get("username"));
  useEffect(() => {
    console.log("roomId: ", roomId);
    console.log("username: ", username);
    // socket.emit("joinRoom", roomId, username);
  }, []);
  if (whiteboardOpen) {
    return (
      <Whiteboard
        setWhiteBoardOpen={setWhiteboardOpen}
        socket={socket}
        roomId={roomId}
        username={username}
      />
    );
  } else {
    return (
      <Box
        sx={{
          pt: 8,
          px: 4,
          pb: 4,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "900px",
            mb: 4,
            p: 2,
            backgroundColor: "#1e1e1e", // Slightly darker gray
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            component="h3"
            sx={{ fontWeight: 700, color: "white" }}
          >
            Two Sum
          </Typography>
          <Typography
            variant="h4"
            component="h4"
            sx={{ fontWeight: 700, color: "gray" }}
          >
            Sum two things lol
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
          }}
        >
          <Box sx={{ flex: 1, mr: 2 }}>
            <CodeEditor />
          </Box>

          <Box
            sx={{
              flex: 1,
              backgroundColor: "#2e2e2e",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button onClick={() => setWhiteboardOpen(true)}>
              Open Whiteboard
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }
};

export default CollaborationPage;
