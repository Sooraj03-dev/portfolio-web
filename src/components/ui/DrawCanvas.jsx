import { useEffect, useRef } from 'react';

export default function DrawCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Resize
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let points = [];
    let animationFrame;
    
    const NEON_COLORS = [
      '0, 255, 255',   // Cyan
      '255, 45, 120',  // Pink
      '176, 38, 255',  // Purple
      '57, 255, 20',   // Green
      '255, 234, 0'    // Yellow
    ];
    let currentColor = NEON_COLORS[0];

    const addPoint = (x, y) => {
      if (window.innerWidth <= 768) return; // Disabled on mobile
      if (points.length === 0 || points[points.length - 1] === null) {
        currentColor = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
      }
      points.push({ x, y, age: 0, color: currentColor });
    };

    const handleMouseMove = (e) => {
      if (e.shiftKey) {
        addPoint(e.clientX, e.clientY);
      } else {
        // if they release shift, insert a "break" point so it doesn't connect later
        if (points.length > 0 && points[points.length - 1] !== null) {
          points.push(null);
        }
      }
    };

    const handleMouseDown = (e) => {
      if (e.shiftKey) {
        addPoint(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = (e) => {
      if (points.length > 0 && points[points.length - 1] !== null) {
        points.push(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (points.length === 0) {
        animationFrame = requestAnimationFrame(draw);
        return;
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 12;

      // Draw segments
      for (let i = 1; i < points.length; i++) {
        const p1 = points[i - 1];
        const p2 = points[i];
        
        if (p1 === null || p2 === null) continue;

        const maxLife = 180; // 3 seconds at 60fps
        const life = 1 - (p1.age / maxLife); 
        
        if (life > 0) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          
          ctx.shadowColor = `rgb(${p1.color})`;
          ctx.strokeStyle = `rgba(${p1.color}, ${Math.max(0, life)})`;
          ctx.lineWidth = 1 + (life * 4);
          ctx.stroke();
        }
      }

      // Age points
      for (let i = 0; i < points.length; i++) {
        if (points[i] !== null) {
          points[i].age += 1;
        }
      }

      // Remove dead points from beginning
      while (points.length > 0 && (points[0] === null || points[0].age > 180)) {
        points.shift();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="hidden md:block fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
