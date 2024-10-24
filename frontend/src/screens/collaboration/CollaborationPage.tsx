import { Box, Typography, Button } from "@mui/material";
import CodeEditor from "./CodeEditor";
import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import Whiteboard from "./Whiteboard";
import ChatBox from "./Chatbox";

const socketURL = process.env.REACT_APP_COLLABORATION_SERVICE_BASE_URL;
const socket = io(socketURL);

const CollaborationPage = () => {
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [whiteboardSize, setWhiteboardSize] = useState({ width: 0, height: 0 });
  const whiteboardContainerRef = useRef<HTMLDivElement>(null);

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const [roomId, setRoomId] = useState(query.get("roomId"));
  const [username, setUsername] = useState(query.get("username"));

  useEffect(() => {
    if (socket) {
      socket.emit("joinRoom", roomId, username);
      socket.on("error", (error) => {
        console.error("Error:", error.message);
      });
    }
  }, [socket, roomId, username]);

  useEffect(() => {
    if (whiteboardContainerRef.current) {
      const container = whiteboardContainerRef.current;
      setWhiteboardSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    }
  }, [whiteboardOpen]);

  return (
    <Box
      sx={{
        pt: 1,
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
          backgroundColor: "#1e1e1e",
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
          height: "calc(100vh - 200px)",
        }}
      >
        <Box
          sx={{
            flex: 2,
            mr: 2,
            minWidth: "300px",
            height: "100%",
            overflow: "auto",
          }}
        >
          <CodeEditor />
        </Box>

        <Box
          sx={{
            flex: 3,
            backgroundColor: "#2e2e2e",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
            ref={whiteboardContainerRef}
          >
            {whiteboardOpen ? (
              <Whiteboard
                setWhiteBoardOpen={setWhiteboardOpen}
                socket={socket}
                roomId={roomId}
                username={username}
                width={whiteboardSize.width}
                height={whiteboardSize.height}
              />
            ) : (
              <Button onClick={() => setWhiteboardOpen(true)}>
                Whiteboard here
              </Button>
            )}
          </Box>

          <Box
            sx={{
              backgroundColor: "#1e1e1e",
              pt: 2,
              height: "200px",
              color: "white",
            }}
          >
            <ChatBox socket={socket} roomId={roomId} username={username} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CollaborationPage;
