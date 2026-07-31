const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>[]{}|/\\';

/**
 * Creates a matrix-style decode animation for text
 * Returns a function that when called with progress (0-1)
 * returns the partially decoded string
 * @param {string} target - the final target string
 * @returns {(progress: number) => string}
 */
export function createGlitchDecoder(target) {
  const len = target.length;
  return (progress) => {
    if (progress >= 1) return target;
    return target
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        const charProgress = (progress * len - i) / 3;
        if (charProgress >= 1) return char;
        if (charProgress <= 0) return CHARS[Math.floor(Math.random() * CHARS.length)];
        return Math.random() > 0.5
          ? char
          : CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');
  };
}

/**
 * Typewriter effect - returns text up to current position
 * @param {string} text - full text
 * @param {number} progress - 0 to 1
 * @returns {string}
 */
export function typewriter(text, progress) {
  const len = Math.floor(text.length * Math.min(progress, 1));
  return text.substring(0, len);
}
