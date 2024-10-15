// src/Hourglass.tsx
import React from "react";
import "./Hourglass.css";

const Hourglass: React.FC = () => {
  return (
    <div className="hourglass-container">
      <div className="hourglass">
        <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
          {/* Hourglass Frame */}
          <polygon
            points="50,0 100,100 50,200 0,100"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />

          {/* Sand Top */}
          <g id="sand-top-group">
            <polygon points="50,0 100,100 0,100" fill="white" />
          </g>

          {/* Sand Bottom */}
          <g id="sand-bottom-group">
            <polygon points="0,100 100,100 50,200" fill="white" />
          </g>

          {/* Falling Sand */}
          <rect
            x="49"
            y="95"
            width="2"
            height="10"
            fill="white"
            id="falling-sand"
          />
        </svg>
      </div>
      <p className="text">Loading...</p>
    </div>
  );
};

export default Hourglass;
