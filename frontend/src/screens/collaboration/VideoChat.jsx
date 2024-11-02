import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const VideoChat = ({ socket, username }) => {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [canStartCall, setCanStartCall] = useState(false);
  const [CALLER, setCALLER] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  useEffect(() => {
    // Listen for the "roomFull" event from the backend
    socket.on("roomFull", (data) => {
      console.log("Room is full:", data);
      // You can now access the roomId and participants from the data object
      const { message, roomId, participants } = data;
      console.log(message); // "Room is now full and ready!"
      console.log("Room ID:", roomId);
      console.log("Participants:", participants);
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
      socket.off("roomFull"); // Remove the event listener when the component unmounts
    };
  }, [socket]);

  useEffect(() => {
    if (!canStartCall) {
      return;
    }
    const peer = new Peer(peerId);
    peer.on("open", (id) => {});

    // const peer = new Peer();
    // peer.on("open", (id) => {
    //   setPeerId(id);
    // });

    peer.on("call", (call) => {
      var getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, (mediaStream) => {
        // Set up the local user's video stream
        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.onloadedmetadata = () => {
          currentUserVideoRef.current.play().catch((error) => {
            console.error("Error playing local video:", error);
          });
        };

        // Answer the call and set up the remote user's video stream
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
    if (username == CALLER) {
      setTimeout(() => {
        call(remotePeerIdValue);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  }, [canStartCall]);

  const call = (remotePeerId) => {
    var getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    getUserMedia({ video: true, audio: true }, (mediaStream) => {
      // Setup the caller's video stream
      currentUserVideoRef.current.srcObject = mediaStream;
      currentUserVideoRef.current.onloadedmetadata = () => {
        currentUserVideoRef.current
          .play()
          .catch((error) => console.error("Error playing local video:", error));
      };

      // Initiate the call
      const call = peerInstance.current.call(remotePeerId, mediaStream);

      // Handle the remote stream
      call.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
        remoteVideoRef.current.onloadedmetadata = () => {
          remoteVideoRef.current
            .play()
            .catch((error) =>
              console.error("Error playing remote video:", error)
            );
        };
      });
    });
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      {/* <p>Current user id is {peerId}</p>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button> */}
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
    </div>
  );
};

export default VideoChat;
