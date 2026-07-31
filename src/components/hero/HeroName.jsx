import { useEffect, useState, useRef } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:\'",.<>/?~`';

function ScrambleChar({ char, delay, isStarted, onComplete }) {
  const [displayChar, setDisplayChar] = useState(char === ' ' ? '\u00A0' : '');
  const [isLocked, setIsLocked] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  
  useEffect(() => {
    if (!isStarted || char === ' ') return;
    
    let scrambleInterval;
    let timeout;
    
    // Start scrambling after delay
    timeout = setTimeout(() => {
      scrambleInterval = setInterval(() => {
        setDisplayChar(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
      }, 50);
      
      // Lock into final character
      setTimeout(() => {
        clearInterval(scrambleInterval);
        setDisplayChar(char);
        setIsLocked(true);
        setIsFlashing(true);
        
        // Remove flash after a short time
        setTimeout(() => {
          setIsFlashing(false);
          if (onComplete) onComplete();
        }, 150);
        
      }, 400 + Math.random() * 300); // Scramble duration 400-700ms
      
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(scrambleInterval);
    };
  }, [isStarted, char, delay]);

  const flashClass = isFlashing ? 'chromatic-flash' : '';
  
  return (
    <span className={`inline-block ${flashClass}`} style={{ opacity: displayChar ? 1 : 0 }}>
      {displayChar}
    </span>
  );
}

export default function HeroName({ isStarted, onComplete }) {
  const line1 = "SOORAJ";
  const line2 = "CHAKRAVARTHY";
  const totalChars = line1.length + line2.length;
  const completedCount = useRef(0);
  
  const handleCharComplete = () => {
    completedCount.current += 1;
    if (completedCount.current === totalChars) {
      if (onComplete) onComplete();
    }
  };

  const [idleGlitch, setIdleGlitch] = useState(false);

  useEffect(() => {
    if (completedCount.current !== totalChars) return;
    
    const triggerIdleGlitch = () => {
      setIdleGlitch(true);
      setTimeout(() => setIdleGlitch(false), 150);
      setTimeout(triggerIdleGlitch, 5000 + Math.random() * 5000); // 5-10 seconds
    };
    
    const initial = setTimeout(triggerIdleGlitch, 3000);
    return () => clearTimeout(initial);
  }, [completedCount.current === totalChars]);

  const renderLine = (text, startIndex) => {
    return text.split('').map((char, i) => (
      <ScrambleChar 
        key={i} 
        char={char} 
        delay={(startIndex + i) * 60} // 60ms delay per character
        isStarted={isStarted}
        onComplete={handleCharComplete}
      />
    ));
  };

  const isFullyResolved = completedCount.current === totalChars;

  return (
    <div 
      className={`relative inline-block hero-name text-left ${idleGlitch ? 'glitching-idle' : ''}`}
      style={{
        transform: 'translate(calc(var(--mouse-x, 0) * -18px), calc(var(--mouse-y, 0) * -10px))',
        transition: 'transform 0.15s ease-out'
      }}
    >
      <h1 
        className="font-orbitron font-black uppercase m-0 flex flex-col leading-[0.9]"
        style={{
          fontSize: 'clamp(36px, 6vw, 80px)',
          color: 'transparent',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          backgroundImage: 'linear-gradient(135deg, #00FFFF 0%, #AAFFEE 30%, #00DDCC 50%, #FFFFFF 65%, #00FFFF 100%)',
          letterSpacing: '0.08em',
          filter: 'drop-shadow(0 0 30px rgba(0,255,255,0.6)) drop-shadow(0 0 60px rgba(0,255,255,0.3)) drop-shadow(0 0 100px rgba(0,255,255,0.15))',
        }}
        data-text={`${line1}\n${line2}`}
      >
        <div className="flex whitespace-nowrap">{renderLine(line1, 0)}</div>
        <div className="flex whitespace-nowrap items-center">
          {renderLine(line2, line1.length)}
          {isFullyResolved && (
            <span className="inline-block bg-neon-cyan animate-pulse ml-2" style={{ width: '0.6em', height: '0.8em', marginTop: '0.1em' }} />
          )}
        </div>
      </h1>

      <style>{`
        .chromatic-flash {
          text-shadow: -3px 0 #FF2D78, 3px 0 #00FFFF;
          animation: flashOff 0.15s ease-out forwards;
        }

        @keyframes flashOff {
          100% { text-shadow: none; }
        }

        .hero-name.glitching-idle h1 {
          animation: idleSkew 0.15s steps(2) forwards;
        }

        @keyframes idleSkew {
          0% { transform: skewX(0deg); filter: hue-rotate(0deg); }
          50% { transform: skewX(-15deg); filter: hue-rotate(90deg); text-shadow: -2px 0 red, 2px 0 blue; }
          100% { transform: skewX(0deg); filter: hue-rotate(0deg); text-shadow: none; }
        }
      `}</style>
    </div>
  );
}
