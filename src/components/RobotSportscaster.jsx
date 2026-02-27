import React from 'react';

const RobotSportscaster = ({ isTalking }) => {
  return (
    <div className="robot-container">
      <svg className="robot-svg" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
        {/* Antenna */}
        <line x1="50" y1="10" x2="50" y2="25" stroke="#888" strokeWidth="3" />
        <circle className="antenna-light" cx="50" cy="7" r="5" fill="#ff4444" />

        {/* Head */}
        <rect x="20" y="25" width="60" height="45" rx="10" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />

        {/* Eyes */}
        <g className="robot-eye">
          <circle cx="35" cy="45" r="8" fill="#1a202c" />
          <circle cx="35" cy="45" r="5" fill="#48bb78" />
          <circle cx="37" cy="43" r="2" fill="#fff" />
        </g>
        <g className="robot-eye">
          <circle cx="65" cy="45" r="8" fill="#1a202c" />
          <circle cx="65" cy="45" r="5" fill="#48bb78" />
          <circle cx="67" cy="43" r="2" fill="#fff" />
        </g>

        {/* Mouth/Speaker */}
        <g className={`robot-mouth ${!isTalking ? 'not-talking' : ''}`}>
          <rect x="35" y="58" width="30" height="8" rx="2" fill="#1a202c" />
          <line x1="40" y1="62" x2="45" y2="62" stroke="#48bb78" strokeWidth="2" />
          <line x1="48" y1="62" x2="53" y2="62" stroke="#48bb78" strokeWidth="2" />
          <line x1="56" y1="62" x2="61" y2="62" stroke="#48bb78" strokeWidth="2" />
        </g>

        {/* Neck */}
        <rect x="40" y="70" width="20" height="10" fill="#718096" />

        {/* Body */}
        <rect x="15" y="80" width="70" height="35" rx="8" fill="#4a5568" stroke="#2d3748" strokeWidth="2" />

        {/* Chest display */}
        <rect x="30" y="88" width="40" height="20" rx="3" fill="#1a202c" />
        <text x="50" y="102" textAnchor="middle" fill="#48bb78" fontSize="8"
          fontFamily="monospace">LIVE</text>

        {/* Arms */}
        <rect x="5" y="82" width="10" height="25" rx="5" fill="#718096" />
        <rect x="85" y="82" width="10" height="25" rx="5" fill="#718096" />
      </svg>
    </div>
  );
};

export default RobotSportscaster;
