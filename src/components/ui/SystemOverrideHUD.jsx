import { useEffect, useState } from 'react';

export default function SystemOverrideHUD({ onRestore }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Slight delay for entry animation
    setTimeout(() => setMounted(true), 50);

    // Audio SFX klaxon
    try {
      const audio = new Audio('/sfx/klaxon.mp3'); // We'll try to play this, but won't crash if missing
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch(e) {}

    // Auto restore after 5 seconds
    const timer = setTimeout(() => {
      onRestore();
    }, 5000);

    // Esc to cancel
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onRestore();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onRestore]);

  return (
    <div className={`fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-150 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Flashing Red Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(255,0,0,0.15)_100%)] animate-pulse" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Center Warning */}
      <div className="absolute inset-0 flex flex-col items-center justify-center mix-blend-difference">
        <h1 className="font-orbitron text-7xl md:text-9xl font-black text-red-500 tracking-tighter" style={{ textShadow: '0 0 40px rgba(255,0,0,0.8)' }}>
          <span className="glitch-text-fast" data-text="FATAL ERROR">FATAL ERROR</span>
        </h1>
        <div className="mt-4 font-jetbrains text-xl md:text-2xl text-red-400 tracking-[0.4em] bg-red-900/30 px-6 py-2 border border-red-500/50 uppercase flex items-center gap-4">
          <span className="w-3 h-3 bg-red-500 animate-ping rounded-full" />
          SYSTEM OVERRIDE INITIATED
          <span className="w-3 h-3 bg-red-500 animate-ping rounded-full" />
        </div>
      </div>

      {/* Top Left HUD */}
      <div className="absolute top-6 left-6 font-jetbrains text-xs text-red-500/70 space-y-1">
        <div>SEC_PROTO: BYPASSED</div>
        <div>MEM_DUMP: 0xDEADBEEF</div>
        <div className="animate-pulse">ERASING: /root/*</div>
      </div>

      {/* Bottom Right HUD */}
      <div className="absolute bottom-6 right-6 font-jetbrains text-xs text-red-500/70 text-right space-y-1">
        <div>OVR_AUTH: GRANTED</div>
        <div className="text-red-400">[ PRESS ESC TO ABORT ]</div>
      </div>
      
      {/* Scanline overlay for extra texture */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px]" />
    </div>
  );
}
