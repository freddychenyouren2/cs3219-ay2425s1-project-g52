import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";
import { IconButton, Menu, MenuItem } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CloseIcon from "@mui/icons-material/Close";

const Whiteboard = ({
  setWhiteBoardOpen,
  socket,
  roomId,
  username,
  width,
  height,
  savedLines,
  setSavedLines,
}) => {
  const [lines, setLines] = useState(savedLines || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [currentColor, setCurrentColor] = useState("black"); // Default color is black
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for color selection menu

  const throttleTimeout = useRef(null);

  const emitDrawingData = (updatedLines) => {
    if (socket && updatedLines.length > 0) {
      socket.emit("drawing", { roomId, lines: updatedLines });
    }
  };

  const emitThrottledData = (updatedLines) => {
    if (!throttleTimeout.current) {
      throttleTimeout.current = setTimeout(() => {
        emitDrawingData(updatedLines);
        throttleTimeout.current = null;
      }, 100);
    }
  };

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

  useEffect(() => {
    setSavedLines(lines);
  }, [lines, setSavedLines]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      { points: [pos.x, pos.y], color: currentColor, erasing: isErasing },
    ]);
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

  // Open the color picker menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the color picker menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Change the current color
  const changeColor = (color) => {
    setCurrentColor(color);
    setIsErasing(false); // Turn off erasing when changing color
    handleClose(); // Close the menu after selecting a color
  };

  const closeWhiteboard = () => {
    console.log("lines", lines);
    console.log("username", username);
    setSavedLines(lines);
    socket.emit("toggleWhiteboardOff", roomId); // Send roomId directly, not as an object
  };

  useEffect(() => {
    socket.on("closeWhiteboard", () => {
      console.log("Closing whiteboard");
      setWhiteBoardOpen(false);
    });
    return () => {
      socket.off("closeWhiteboard");
    };
  }, [socket]);

  return (
    <div style={{ position: "relative", width, height }}>
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          <Rect x={0} y={0} width={width} height={height} fill="white" />
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.erasing ? "white" : line.color} // Use the selected color or white for erasing
              strokeWidth={line.erasing ? 20 : 2}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>

      {/* Icons for tools */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        {/* Pencil Icon with color picker */}
        <IconButton
          onClick={handleClick}
          color={!isErasing ? "primary" : "default"}
        >
          <CreateIcon />
        </IconButton>
        <Menu
          id="color-picker-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem
            onClick={() => changeColor("black")}
            style={{ color: "black" }}
          >
            Black
          </MenuItem>
          <MenuItem onClick={() => changeColor("red")} style={{ color: "red" }}>
            Red
          </MenuItem>
          <MenuItem
            onClick={() => changeColor("green")}
            style={{ color: "green" }}
          >
            Green
          </MenuItem>
          <MenuItem
            onClick={() => changeColor("blue")}
            style={{ color: "blue" }}
          >
            Blue
          </MenuItem>
        </Menu>

        {/* Eraser Icon */}
        <IconButton
          onClick={toggleEraseMode}
          color={isErasing ? "primary" : "default"}
        >
          <FormatColorResetIcon />
        </IconButton>

        {/* Clear All Icon */}
        <IconButton onClick={handleClear} color="default">
          <ClearAllIcon />
        </IconButton>

        {/* Close Whiteboard Icon */}
        <IconButton onClick={closeWhiteboard} color="default">
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Whiteboard;