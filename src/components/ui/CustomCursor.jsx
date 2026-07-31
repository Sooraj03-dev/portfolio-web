import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input, textarea, .clickable');
      if (target) setIsHovering(true);
      else setIsHovering(false);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Exact center dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-neon-cyan rounded-full pointer-events-none z-[9999]"
        style={{
          boxShadow: '0 0 10px #00FFFF',
        }}
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border-[1.5px] border-neon-cyan rounded-full pointer-events-none z-[9999]"
        style={{
          boxShadow: 'inset 0 0 10px rgba(0,255,255,0.2), 0 0 10px rgba(0,255,255,0.2)',
        }}
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(0,255,255,0.1)' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.5 }}
      />
    </>
  );
}
