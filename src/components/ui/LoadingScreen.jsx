import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Start fade out after 1.5s
    const fadeTimer = setTimeout(() => {
      setOpacity(0);
    }, 1500);

    // Remove from DOM after transition
    const removeTimer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{
        background: '#010308',
        opacity,
        transition: 'opacity 1.5s ease-in-out',
        pointerEvents: opacity === 0 ? 'none' : 'auto',
      }}
    >
      {/* Scanline sweep */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,255,255,0.04) 50%, transparent 100%)',
          animation: 'loadingScan 2s ease-in-out infinite',
        }}
      />

      {/* Loading text */}
      <div className="text-center">
        <div className="font-orbitron text-neon-cyan text-2xl tracking-ultra mb-4 animate-pulse-glow">
          UNKNOWN03X
        </div>
        <div className="font-jetbrains text-text-dim text-xs tracking-wide">
          INITIALIZING SYSTEMS...
        </div>
        <div className="mt-6 w-48 h-0.5 bg-surface mx-auto overflow-hidden">
          <div
            className="h-full bg-neon-cyan"
            style={{
              animation: 'loadingBar 2s ease-in-out forwards',
              boxShadow: '0 0 10px #00FFFF',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loadingScan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes loadingBar {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
