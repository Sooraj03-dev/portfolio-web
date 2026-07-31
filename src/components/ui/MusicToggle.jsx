import React, { useState } from 'react';

export default function MusicToggle({ isPlaying, toggleMute }) {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    width: '40px',
    height: '40px',
    background: 'rgba(0, 255, 255, 0.05)',
    border: `1px solid ${isHovered ? 'rgba(0, 255, 255, 0.6)' : 'rgba(0, 255, 255, 0.35)'}`,
    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'color 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
    color: isPlaying ? '#00FFFF' : '#3A6A7A',
    boxShadow: isPlaying ? '0 0 12px rgba(0, 255, 255, 0.4)' : 'none',
  };

  return (
    <button
      type="button"
      className="clickable"
      style={buttonStyle}
      onClick={toggleMute}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={isPlaying ? "Mute Music" : "Play Music"}
      aria-label={isPlaying ? "Mute ambient background music" : "Play ambient background music"}
    >
      {isPlaying ? "♪" : "✕"}
    </button>
  );
}
