import { useState, useEffect, useCallback } from 'react';

export function useCursorPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isOnCanvas, setIsOnCanvas] = useState(false);

  const handleMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    const checkHover = () => {
      const hoverElements = document.querySelectorAll('a, button, .clickable, [role="button"]');
      const handleEnter = () => setIsHovering(true);
      const handleLeave = () => setIsHovering(false);

      hoverElements.forEach((el) => {
        el.addEventListener('mouseenter', handleEnter);
        el.addEventListener('mouseleave', handleLeave);
      });

      return () => {
        hoverElements.forEach((el) => {
          el.removeEventListener('mouseenter', handleEnter);
          el.removeEventListener('mouseleave', handleLeave);
        });
      };
    };

    // Check for canvas hover
    const canvasCheck = (e) => {
      const target = e.target;
      setIsOnCanvas(target.tagName === 'CANVAS');
    };
    window.addEventListener('mouseover', canvasCheck);

    const cleanupHover = checkHover();
    const observer = new MutationObserver(() => {
      if (cleanupHover) cleanupHover();
      checkHover();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', canvasCheck);
      if (cleanupHover) cleanupHover();
      observer.disconnect();
    };
  }, [handleMouseMove]);

  return { position, isHovering, isOnCanvas };
}
