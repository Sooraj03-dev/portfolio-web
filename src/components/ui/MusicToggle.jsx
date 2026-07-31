import React, { useState } from 'react';

export default function MusicToggle({ isPlaying, toggleMute, onNextTrack }) {
  const [isHoveredMute, setIsHoveredMute] = useState(false);
  const [isHoveredNext, setIsHoveredNext] = useState(false);

  const buttonStyle = (isHovered, active) => ({
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
    color: active ? '#00FFFF' : '#3A6A7A',
    boxShadow: active ? '0 0 12px rgba(0, 255, 255, 0.4)' : 'none',
  });

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="clickable"
        style={buttonStyle(isHoveredMute, isPlaying)}
        onClick={toggleMute}
        onMouseEnter={() => setIsHoveredMute(true)}
        onMouseLeave={() => setIsHoveredMute(false)}
        title={isPlaying ? "Mute Music" : "Play Music"}
        aria-label={isPlaying ? "Mute ambient background music" : "Play ambient background music"}
      >
        {isPlaying ? "♪" : "✕"}
      </button>
      
      {onNextTrack && (
        <button
          type="button"
          className="clickable"
          style={buttonStyle(isHoveredNext, false)}
          onClick={onNextTrack}
          onMouseEnter={() => setIsHoveredNext(true)}
          onMouseLeave={() => setIsHoveredNext(false)}
          title="Next Track"
          aria-label="Next ambient background track"
        >
          ►►
        </button>
      )}
    </div>
  );
}
