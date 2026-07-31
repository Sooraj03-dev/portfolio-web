import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function TerminalBoot({ onComplete }) {
  const [lines, setLines] = useState([
    { text: '> INITIALIZING IDENTITY MODULE...', typed: '' },
    { text: '> LOADING PROFILE: SOORAJ_CHAKRAVARTHY_S', typed: '' },
    { text: '> ACCESS GRANTED', typed: '' }
  ]);
  const [activeLine, setActiveLine] = useState(0);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let typingInterval;

    const typeChar = () => {
      if (currentLine >= lines.length) {
        setTimeout(() => {
          gsap.to('.terminal-boot-container', {
            opacity: 0,
            y: -20,
            duration: 0.5,
            onComplete: onComplete
          });
        }, 600);
        return;
      }

      const fullText = lines[currentLine].text;
      if (currentChar < fullText.length) {
        setLines(prev => {
          const newLines = [...prev];
          newLines[currentLine].typed = fullText.slice(0, currentChar + 1);
          return newLines;
        });
        currentChar++;
        
        const nextDelay = Math.random() * 30 + 20; 
        typingInterval = setTimeout(typeChar, nextDelay);
      } else {
        currentLine++;
        currentChar = 0;
        setActiveLine(currentLine);
        typingInterval = setTimeout(typeChar, 300);
      }
    };

    typingInterval = setTimeout(typeChar, 500);

    return () => clearTimeout(typingInterval);
  }, []);

  return (
    <div className="terminal-boot-container font-jetbrains text-xs md:text-sm text-neon-cyan tracking-widest text-left" style={{ textShadow: '0 0 8px rgba(0,255,255,0.4)' }}>
      {lines.map((line, index) => (
        <div key={index} className="mb-1" style={{ opacity: index > activeLine ? 0 : 1 }}>
          {line.typed}
          {index === activeLine && (
            <span className="inline-block w-2 h-4 bg-neon-cyan ml-1 animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
}
