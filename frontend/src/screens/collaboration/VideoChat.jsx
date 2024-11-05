import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { IconButton, Typography } from "@mui/material";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Whiteboard from "./Whiteboard";

const VideoChat = ({ socket, username, roomId, width, height, savedLines, setSavedLines }) => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [canStartCall, setCanStartCall] = useState(false);
  const [CALLER, setCALLER] = useState("");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const mediaStreamRef = useRef(null);
  const [showWhiteboard, setShowWhiteboard] = useState(false);

  useEffect(() => {
    // Listen for the "roomFull" event from the backend
    socket.on("roomFull", (data) => {
      const { roomId, participants } = data;
      const caller = participants[0];
      setCALLER(caller);
      const receiver = participants[1];
      setPeerId(roomId + "-" + username);
      setRemotePeerIdValue(
        roomId + "-" + (username === caller ? receiver : caller)
      );
      setCanStartCall(true);
    });

    // Cleanup on component unmount
    return () => {
      socket.off("roomFull");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("openWhiteboard", () => {
      console.log("Opening whiteboard");
      setShowWhiteboard(true);
    });
  }, [socket]);

  useEffect(() => {
    if (!canStartCall) {
      return;
    }

    const peer = new Peer(peerId);

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        mediaStreamRef.current = mediaStream;
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.onloadedmetadata = () => {
          currentUserVideoRef.current.play().catch((error) => {
            console.error("Error playing local video:", error);
          });
        };

        call.answer(mediaStream);
        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play().catch((error) => {
              console.error("Error playing remote video:", error);
            });
          };
        });
      });
    });

    peerInstance.current = peer;
    if (username === CALLER) {
      setTimeout(() => {
        call(remotePeerIdValue);
      }, 2000);
    }
  }, [canStartCall]);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      mediaStreamRef.current = mediaStream;
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.onloadedmetadata = () => {
        currentUserVideoRef.current.play().catch((error) => {
          console.error("Error playing local video:", error);
        });
      };

      const call = peerInstance.current.call(remotePeerId, mediaStream);

      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.onloadedmetadata = () => {
          remoteVideoRef.current.play().catch((error) => {
            console.error("Error playing remote video:", error);
          });
        };
      });
    });
  };

  // Toggle camera
  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isCameraOn;
        setIsCameraOn(!isCameraOn);
      }
    }
  };

  // Toggle microphone
  const toggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };
  const toggleWhiteboard = () => {
    // Logic to open or close the whiteboard
    console.log("Whiteboard button clicked!");
    socket.emit("toggleWhiteboardOn", roomId); // Send roomId directly, not as an object
  };

  useEffect(() => {
    console.log("savedLines", savedLines);
  }, [savedLines]);
  
  if (!canStartCall) {
    return (
      <div>
        <Typography
          variant="h4"
          component="h4"
          sx={{ fontWeight: 500, color: "white" }}
        >
          Waiting for your peer to join...
        </Typography>
      </div>
    );
  } else {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          style={{
            height: "80%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <div
            style={{
              marginLeft: 15,
              marginTop: 10,
              marginRight: 10,
              backgroundColor: "#2e2e2e",
              width: "50%",
              borderRadius: 15,
              overflow: "hidden",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            }}
          >
            <video
              ref={currentUserVideoRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div
            style={{
              marginRight: 15,
              marginTop: 10,
              backgroundColor: "#2e2e2e",
              width: "50%",
              borderRadius: 15,
              overflow: "hidden",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.3)",
            }}
          >
            <video
              ref={remoteVideoRef}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
        <div
          className="buttons"
          style={{
            height: "15%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <IconButton
            onClick={toggleCamera}
            style={{
              margin: "0 10px",
              color: isCameraOn ? "white" : "red", // Red color when camera is off
              backgroundColor: "#444",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              borderRadius: "50%",
              transform: "translateY(0)",
              transition: "transform 0.1s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(2px)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
          <IconButton
            onClick={toggleMic}
            style={{
              margin: "0 10px",
              color: isMicOn ? "white" : "red", // Red color when mic is off
              backgroundColor: "#444",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              borderRadius: "50%",
              transform: "translateY(0)",
              transition: "transform 0.1s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(2px)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            {isMicOn ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
          <IconButton
            onClick={toggleWhiteboard}
            style={{
              margin: "0 10px",
              color: "white",
              backgroundColor: "#444",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              borderRadius: "50%",
              transform: "translateY(0)",
              transition: "transform 0.1s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "translateY(2px)")
            }
            onMouseUp={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <BorderColorIcon /> {/* Icon for Whiteboard */}
          </IconButton>
        </div>
        {showWhiteboard && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255)", // Slightly transparent background
              zIndex: 1000, // Make sure it's on top
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Whiteboard
              setWhiteBoardOpen={setShowWhiteboard}
              socket={socket}
              roomId={roomId}
              username={username}
              width={width}
              height={height}
              savedLines={savedLines}
              setSavedLines={setSavedLines}
            />
            {/* Render your Whiteboard component */}
          </div>
        )}
      </div>
    );
  }
};

export default VideoChat;