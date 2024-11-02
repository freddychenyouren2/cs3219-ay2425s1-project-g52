import { Box, Typography, Button } from "@mui/material";
import CodeEditor from "./CodeEditor";
import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import Whiteboard from "./Whiteboard";
import ChatBox from "./Chatbox";
import VideoChat from "./VideoChat";

const socketURL = process.env.REACT_APP_COLLABORATION_SERVICE_BASE_URL;
const socket = io(socketURL);

const CollaborationPage = () => {
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [whiteboardSize, setWhiteboardSize] = useState({ width: 0, height: 0 });
  const whiteboardContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  console.log(location);
  const username = location?.state.username;
  const roomId = location?.state.roomId;
  const question = location?.state.question;

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
          {question.qTitle}
        </Typography>
        <Typography
          variant="body1"
          component="body"
          sx={{ fontWeight: 700, color: "gray" }}
        >
          {question.qDescription}
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
          <CodeEditor roomId={roomId} />
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
              overflow: "hidden",
            }}
            ref={whiteboardContainerRef}
          >
            <VideoChat
              socket={socket}
              username={username}
              roomId={roomId}
              width={whiteboardSize.width}
              height={whiteboardSize.height}
            ></VideoChat>
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
