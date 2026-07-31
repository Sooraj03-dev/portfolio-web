import { useState, useEffect, useRef } from 'react';
import NightCityScene from '../scene/NightCityScene';

export default function Hero({ scrollProgress }) {
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowUI(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <NightCityScene scrollProgress={scrollProgress} />
      </div>

      {/* HUD Overlay */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12"
        style={{
          opacity: showUI ? 1 : 0,
          transition: 'opacity 1.5s ease',
        }}
      >
        {/* Top HUD */}
        <div className="flex justify-between items-start">
          <div className="font-jetbrains text-xs" style={{ color: '#3A6A7A' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
            {'> SYSTEM ONLINE'}
          </div>
          <div className="font-jetbrains text-xs text-text-dim">
            12.9716°N 77.5946°E
          </div>
        </div>

        {/* Center: Name */}
        <div className="flex-1 flex items-center justify-center flex-col">
          <h1
            className="font-orbitron font-bold text-center neon-text-cyan"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
              letterSpacing: '0.2em',
              lineHeight: 1.1,
            }}
          >
            SOORAJ S
          </h1>
          <div
            className="font-orbitron text-center mt-4"
            style={{
              fontSize: 'clamp(0.75rem, 2vw, 1.5rem)',
              letterSpacing: '0.3em',
              color: '#3A6A7A',
            }}
          >
            UNKNOWN03X
          </div>
          <div
            className="w-48 h-px mt-6 mx-auto"
            style={{
              background: 'linear-gradient(to right, transparent, #00FFFF, transparent)',
              boxShadow: '0 0 10px rgba(0,255,255,0.3)',
            }}
          />
        </div>

        {/* Bottom: Scroll indicator */}
        <div className="flex justify-center">
          <div className="text-center animate-float">
            <div
              className="font-rajdhani text-xs uppercase tracking-wide text-text-dim mb-2"
              style={{ letterSpacing: '0.15em' }}
            >
              SCROLL TO EXPLORE
            </div>
            <div className="flex justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" className="animate-bounce">
                <polyline
                  points="4,6 10,14 16,6"
                  fill="none"
                  stroke="#00FFFF"
                  strokeWidth="1.5"
                  opacity="0.6"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
