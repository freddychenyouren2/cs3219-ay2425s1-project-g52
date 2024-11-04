import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';

interface WhiteboardHistoryProps {
  state: any;
}

const WhiteboardHistory: React.FC<WhiteboardHistoryProps> = ({ state }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          <Rect x={0} y={0} width={dimensions.width} height={dimensions.height} fill="white" />
          {state.map((line: any, i: number) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.erasing ? "white" : line.color}
              strokeWidth={line.erasing ? 20 : 2}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation="source-over"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default WhiteboardHistory;