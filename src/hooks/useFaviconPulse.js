import { useEffect, useRef } from 'react';

export function useFaviconPulse(isPlaying) {
  const originalFaviconRef = useRef(null);

  useEffect(() => {
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    if (!originalFaviconRef.current) {
      originalFaviconRef.current = link.href || '/vite.svg';
    }

    let intervalId;
    
    if (isPlaying) {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      
      intervalId = setInterval(() => {
        ctx.clearRect(0, 0, 32, 32);
        
        // Draw 3 animated EQ bars
        for (let i = 0; i < 3; i++) {
          const h = Math.random() * 20 + 8; // Height between 8 and 28
          const x = 4 + i * 9;
          const y = 32 - h;
          
          ctx.fillStyle = i === 1 ? '#FF2D78' : '#00FFFF'; // pink middle, cyan outer
          
          // Subtle glow
          ctx.shadowBlur = 6;
          ctx.shadowColor = ctx.fillStyle;
          
          ctx.fillRect(x, y, 6, h);
        }
        
        link.href = canvas.toDataURL('image/png');
      }, 150);
    } else {
      if (originalFaviconRef.current) {
        link.href = originalFaviconRef.current;
      }
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying]);
}
