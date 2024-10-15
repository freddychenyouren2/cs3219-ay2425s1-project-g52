// src/Hourglass.tsx
import React from "react";
import "./Hourglass.css";

const Hourglass: React.FC = () => {
  return (
    <div className="hourglass-container">
      <div className="hourglass">
        <svg viewBox="0 0 100 200">
          {/* Hourglass Shape */}
          <polygon
            points="50,0 100,100 0,100"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <polygon
            points="0,100 100,100 50,200"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />

          {/* Sand Top */}
          <mask id="mask-top">
            <rect x="0" y="0" width="100" height="100" fill="white" />
            <rect
              x="0"
              y="0"
              width="100"
              height="100"
              fill="black"
              id="sand-top-mask"
            />
          </mask>
          <polygon
            points="50,0 100,100 0,100"
            fill="white"
            mask="url(#mask-top)"
          />

          {/* Sand Bottom */}
          <mask id="mask-bottom">
            <rect x="0" y="100" width="100" height="100" fill="white" />
            <rect
              x="0"
              y="100"
              width="100"
              height="100"
              fill="black"
              id="sand-bottom-mask"
            />
          </mask>
          <polygon
            points="0,100 100,100 50,200"
            fill="white"
            mask="url(#mask-bottom)"
          />

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
