export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
      <div 
        className="w-px h-16 relative overflow-hidden"
        style={{
          borderLeft: '1px dashed rgba(0,255,255,0.3)',
        }}
      >
        {/* Animated Data Packets */}
        <div className="absolute top-0 left-[-1px] w-px h-3 bg-neon-cyan/80 blur-[1px]" style={{ animation: 'packetDrop 2s linear infinite' }} />
        <div className="absolute top-0 left-[-1px] w-px h-2 bg-white blur-[1px]" style={{ animation: 'packetDrop 2.5s linear infinite 1.2s' }} />
        <div className="absolute top-0 left-[-1px] w-px h-4 bg-neon-cyan/60 blur-[1px]" style={{ animation: 'packetDrop 3s linear infinite 0.7s' }} />
      </div>
      <div 
        className="font-rajdhani text-[9px] uppercase tracking-[0.3em] mt-2"
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
        @keyframes packetDrop {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(64px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
