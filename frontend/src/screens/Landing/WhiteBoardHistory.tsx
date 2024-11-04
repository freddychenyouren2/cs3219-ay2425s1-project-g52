import React from 'react';

interface WhiteboardHistoryProps {
  state: any;
}

const WhiteboardHistory: React.FC<WhiteboardHistoryProps> = ({ state }) => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'white' }}>
      {/* Render your whiteboard state here */}
    </div>
  );
};

export default WhiteboardHistory;