export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
      <div 
        className="w-px h-8"
        style={{
          borderLeft: '1px dashed #00FFFF',
          opacity: 0.5
        }}
      />
      <div 
        className="font-rajdhani text-[9px] uppercase tracking-[0.3em]"
        style={{
          color: 'rgba(0,255,255,0.5)',
          animation: 'pulseGlow 2.5s ease-in-out infinite'
        }}
      >
        SCROLL TO EXPLORE
      </div>
      <div 
        className="text-neon-cyan mt-1"
        style={{
          animation: 'bounceY 1.8s ease infinite'
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      <style>{`
        @keyframes bounceY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </div>
  );
}
