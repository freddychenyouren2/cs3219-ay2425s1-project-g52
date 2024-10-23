import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";

const Whiteboard = ({ setWhiteBoardOpen, socket, roomId, username }) => {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  const throttleTimeout = useRef(null);

  // Join the room on component mount
  useEffect(() => {
    if (socket) {
      // Join the room with roomId and username
      socket.emit("joinRoom", roomId, username);

      socket.on("error", (error) => {
        console.error("Error:", error.message);
      });
    }
  }, [socket, roomId, username]);

  // Throttled socket emit function
  const emitDrawingData = (updatedLines) => {
    if (socket && updatedLines.length > 0) {
      socket.emit("drawing", { roomId, lines: updatedLines });
    }
  };

  // Emit the lines data to the server at a throttled interval
  const emitThrottledData = (updatedLines) => {
    if (!throttleTimeout.current) {
      throttleTimeout.current = setTimeout(() => {
        emitDrawingData(updatedLines);
        throttleTimeout.current = null;
      }, 100); // Emit every 100ms
    }
  };

  // Listen for drawing updates from the server
  useEffect(() => {
    if (socket) {
      socket.on("drawing", (newLines) => {
        setLines(newLines.lines);
      });

      return () => {
        socket.off("drawing");
      };
    }
  }, [socket]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { points: [pos.x, pos.y], erasing: isErasing }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const updatedLines = lines.concat();
    setLines(updatedLines);

    emitThrottledData(updatedLines);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setLines([]);
    if (socket) {
      socket.emit("drawing", { roomId, lines: [] });
    }
  };

  const toggleEraseMode = () => {
    setIsErasing(!isErasing);
  };

  return (
    <div>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={window.innerWidth}
            height={window.innerHeight}
            fill="white"
          />
          {/* Draw or erase lines */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.erasing ? "white" : "black"} // White color for erasing
              strokeWidth={line.erasing ? 20 : 2} // Thicker line for erasing
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
      {/* Control buttons */}
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        <button
          onClick={handleClear}
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px",
          }}
        >
          Clear All
        </button>
        <button
          onClick={toggleEraseMode}
          style={{
            padding: "10px",
            fontSize: "16px",
          }}
        >
          {isErasing ? "Switch to Draw" : "Switch to Erase"}
        </button>
        <button
          onClick={() => setWhiteBoardOpen(false)}
          style={{
            padding: "10px",
            fontSize: "16px",
          }}
        >
          Close whiteboard
        </button>
      </div>
    </div>
  );
};

export default Whiteboard;
