// Pure DOM Custom Cursor (Zero React state for max performance)

export function initCustomCursor() {
  if (typeof window === 'undefined') return;

  // Create DOM elements
  const ring = document.createElement('div');
  const dot = document.createElement('div');

  // Ring styles
  Object.assign(ring.style, {
    width: '40px',
    height: '40px',
    border: '1.5px solid rgba(255,107,0,0.6)',
    borderRadius: '50%',
    position: 'fixed',
    top: '0',
    left: '0',
    pointerEvents: 'none',
    zIndex: '9999',
    transition: 'transform 0.1s linear, background-color 0.2s ease, border-color 0.2s ease',
    transformOrigin: 'center',
    willChange: 'transform'
  });

  // Dot styles
  Object.assign(dot.style, {
    width: '6px',
    height: '6px',
    backgroundColor: '#FF6B00',
    boxShadow: '0 0 10px #FF6B00',
    borderRadius: '50%',
    position: 'fixed',
    top: '0',
    left: '0',
    pointerEvents: 'none',
    zIndex: '9999',
    transition: 'transform 0.05s linear, opacity 0.2s ease',
    transformOrigin: 'center',
    willChange: 'transform'
  });

  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isHovering = false;

  const onMouseMove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows exactly
    dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px) scale(${isHovering ? 0 : 1})`;
  };

  const onMouseDown = () => {
    ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) scale(0.8)`;
    ring.style.backgroundColor = 'rgba(255,107,0,0.3)';
  };

  const onMouseUp = () => {
    ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) scale(${isHovering ? 1.8 : 1})`;
    ring.style.backgroundColor = isHovering ? 'rgba(255,107,0,0.06)' : 'transparent';
  };

  // rAF loop for laggy ring
  const updateRing = () => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    
    // Only update transform if not clicking (handled by events)
    if (!ring.style.transform.includes('scale(0.8)')) {
       ring.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px) scale(${isHovering ? 1.8 : 1})`;
    }

    requestAnimationFrame(updateRing);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);

  // Setup hover listeners via mutation observer or event delegation
  const handleHover = (e) => {
    const target = e.target.closest('a, button, input, textarea, .clickable');
    if (target) {
      if (e.type === 'mouseover' || e.type === 'mouseenter') {
        isHovering = true;
        ring.style.borderColor = '#FFAA00';
        ring.style.backgroundColor = 'rgba(255,107,0,0.06)';
        dot.style.opacity = '0';
      } else if (e.type === 'mouseout' || e.type === 'mouseleave') {
        isHovering = false;
        ring.style.borderColor = 'rgba(255,107,0,0.6)';
        ring.style.backgroundColor = 'transparent';
        dot.style.opacity = '1';
      }
    }
  };

  document.addEventListener('mouseover', handleHover);
  document.addEventListener('mouseout', handleHover);

  // Start loop
  requestAnimationFrame(updateRing);
}
