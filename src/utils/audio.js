export const playSFX = (type) => {
  const sfxMap = {
    'granted': '/sfx/access-granted.mp3',
    'denied': '/sfx/access-denied.mp3',
    'keystroke': '/sfx/keystroke.mp3',
  };

  const src = sfxMap[type];
  if (!src) return;

  if (type === 'granted' || type === 'denied') {
    window.dispatchEvent(new CustomEvent('duck-audio'));
  }

  try {
    const audio = new Audio(src);
    audio.volume = type === 'keystroke' ? 0.2 : 0.5;
    audio.play().catch(() => {});
  } catch (err) {}
};
