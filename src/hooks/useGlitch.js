import { useState, useEffect, useRef } from 'react';
import { createGlitchDecoder } from '../utils/glitchText';

/**
 * Hook that returns a glitch-decoded version of text
 * Triggers when element enters viewport
 * @param {string} targetText - final text to display
 * @param {number} duration - animation duration in ms
 * @returns {{ ref: React.RefObject, text: string, isComplete: boolean }}
 */
export function useGlitch(targetText, duration = 1200) {
  const ref = useRef(null);
  const [text, setText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const decoder = createGlitchDecoder(targetText);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          const startTime = performance.now();

          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setText(decoder(progress));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setText(targetText);
              setIsComplete(true);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [targetText, duration]);

  return { ref, text, isComplete };
}
