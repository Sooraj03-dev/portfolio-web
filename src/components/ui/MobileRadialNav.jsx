import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'HERO', id: 'hero', icon: 'home' },
  { label: 'ABOUT', id: 'about', icon: 'user' },
  { label: 'SKILLS', id: 'skills', icon: 'grid' },
  { label: 'PROJECTS', id: 'projects', icon: 'folder' },
  { label: 'TIMELINE', id: 'timeline', icon: 'clock' },
  { label: 'CONTACT', id: 'contact', icon: 'mail' },
];

const getIcon = (name, isActive) => {
  const color = isActive ? '#00FFFF' : 'rgba(0,255,255,0.7)';
  const props = {
    width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", 
    stroke: color, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round",
    style: { transition: 'stroke 0.3s' }
  };
  switch(name) {
    case 'home': return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
    case 'user': return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
    case 'grid': return <svg {...props}><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>;
    case 'folder': return <svg {...props}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
    case 'clock': return <svg {...props}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
    case 'mail': return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
    default: return null;
  }
};

export default function MobileRadialNav({ activeSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const triggerLabelRef = useRef(null);
  const menuIconRef = useRef(null);
  const hamburgerPathRef = useRef(null);
  const closePathRef = useRef(null);
  const backdropRef = useRef(null);
  const nodesRef = useRef([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMenu = (callback) => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsMenuOpen(false);
        if (callback && typeof callback === 'function') callback();
      }
    });
    
    if (nodesRef.current.length > 0) {
      tl.to(nodesRef.current, {
        x: 0, y: 0, opacity: 0, scale: 0.3,
        stagger: 0.02, duration: 0.25, ease: 'power2.in'
      }, 0);
    }
    
    if (backdropRef.current) {
      tl.to(backdropRef.current, { opacity: 0, duration: 0.2 }, 0.1);
    }
    
    if (menuIconRef.current) {
      tl.to(menuIconRef.current, { rotate: 0, duration: 0.25 }, 0);
      tl.to(hamburgerPathRef.current, { opacity: 1, duration: 0.25 }, 0);
      tl.to(closePathRef.current, { opacity: 0, duration: 0.25 }, 0);
    }
    
    if (triggerLabelRef.current) {
      tl.to(triggerLabelRef.current, { opacity: 1, y: 0, duration: 0.2 }, 0.15);
    }
  };

  const openMenu = () => {
    setIsMenuOpen(true);
    
    setTimeout(() => {
      const isSmallScreen = window.innerWidth < 380 || window.innerHeight < 600;
      const radius = isSmallScreen ? 90 : 130;
      
      const radialPositions = NAV_LINKS.map((_, i) => {
        const angle = -180 + (i * 36);
        const rad = angle * (Math.PI / 180);
        return {
          x: radius * Math.cos(rad),
          y: radius * Math.sin(rad)
        };
      });

      const tl = gsap.timeline();
      
      if (backdropRef.current) {
        tl.to(backdropRef.current, { opacity: 1, duration: 0.25, ease: 'power2.out' }, 0);
      }
      
      if (menuIconRef.current) {
        tl.to(menuIconRef.current, { rotate: 135, duration: 0.3, ease: 'power2.inOut' }, 0);
        tl.to(hamburgerPathRef.current, { opacity: 0, duration: 0.3 }, 0);
        tl.to(closePathRef.current, { opacity: 1, duration: 0.3 }, 0);
      }
      
      if (triggerLabelRef.current) {
        tl.to(triggerLabelRef.current, { opacity: 0, y: -8, duration: 0.15 }, 0);
      }
      
      if (nodesRef.current.length > 0) {
        tl.fromTo(nodesRef.current, 
          { x: 0, y: 0, opacity: 0, scale: 0.3 },
          {
            x: (i) => radialPositions[i].x,
            y: (i) => radialPositions[i].y,
            opacity: 1,
            scale: 1,
            stagger: 0.04,
            duration: 0.4,
            ease: 'back.out(1.6)'
          }, '-=0.1');
          
        tl.fromTo('.radial-label', 
          { opacity: 0 },
          { opacity: 1, duration: 0.2, stagger: 0.04 }, 
          '-=0.2');
      }
    }, 50);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleNodeClick = (id) => {
    const node = document.getElementById(`nav-node-${id}`);
    if (node) {
      gsap.fromTo(node, { scale: 0.9 }, { scale: 1.0, duration: 0.2, ease: 'power2.out' });
    }
    
    closeMenu(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <div className="md:hidden" ref={containerRef}>
      {/* Backdrop */}
      {isMenuOpen && (
        <div 
          ref={backdropRef}
          className="fixed inset-0 z-[190] opacity-0"
          style={{
            background: 'rgba(1, 3, 8, 0.75)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)'
          }}
          onClick={() => closeMenu()}
        >
          {/* Faint radial scanline texture */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              background: 'repeating-radial-gradient(circle at 50% calc(100% - 24px - 28px), rgba(0,255,255,1) 0, rgba(0,255,255,1) 1px, transparent 1px, transparent 12px)'
            }}
          />
        </div>
      )}

      {/* Nodes container */}
      {isMenuOpen && (
        <div 
          className="fixed z-[200] pointer-events-none"
          style={{
            bottom: 'calc(max(24px, env(safe-area-inset-bottom) + 12px) + 28px)', // centered at trigger button
            left: '50%',
          }}
        >
          {NAV_LINKS.map((link, i) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                id={`nav-node-${link.id}`}
                ref={(el) => (nodesRef.current[i] = el)}
                onClick={() => handleNodeClick(link.id)}
                className="absolute flex flex-col items-center justify-center pointer-events-auto radial-node outline-none"
                style={{
                  width: '44px',
                  height: '44px',
                  transform: 'translate(-50%, -50%) scale(0.3)',
                  left: 0, top: 0,
                  background: isActive ? 'rgba(0,255,255,0.12)' : 'rgba(5,12,20,0.95)',
                  border: isActive ? '1px solid #00FFFF' : '1px solid rgba(0,255,255,0.35)',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  boxShadow: isActive ? '0 0 16px rgba(0,255,255,0.5)' : 'none',
                  opacity: 0
                }}
                aria-label={`Go to ${link.label}`}
                role="button"
              >
                {getIcon(link.icon, isActive)}
                
                <span 
                  className="radial-label absolute opacity-0 font-jetbrains uppercase whitespace-nowrap"
                  style={{
                    bottom: '-18px',
                    fontSize: '7px',
                    color: 'rgba(232,244,248,0.8)',
                    letterSpacing: '0.1em'
                  }}
                >
                  {link.label}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Trigger Button */}
      <div 
        className="fixed z-[200]"
        style={{
          bottom: 'max(24px, env(safe-area-inset-bottom) + 12px)',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            border: '1.5px solid rgba(0,255,255,0.5)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animation: 'pulseRadar 2.5s ease-in-out infinite'
          }}
        />
        
        <style>{`
          @keyframes pulseRadar {
            0% { transform: scale(1.0); opacity: 0.3; }
            50% { transform: scale(1.15); opacity: 0; }
            100% { transform: scale(1.0); opacity: 0; }
          }
        `}</style>

        <span 
          ref={triggerLabelRef}
          className="absolute w-full text-center font-jetbrains uppercase pointer-events-none"
          style={{
            top: '-18px',
            fontSize: '8px',
            color: 'rgba(0,255,255,0.5)',
            letterSpacing: '0.2em'
          }}
        >
          MENU
        </span>
        
        <button
          onClick={toggleMenu}
          className="relative flex items-center justify-center pointer-events-auto outline-none"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          style={{
            width: '56px',
            height: '56px',
            background: 'rgba(5, 12, 20, 0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(0, 255, 255, 0.5)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            boxShadow: '0 0 20px rgba(0,255,255,0.25), inset 0 0 15px rgba(0,255,255,0.05)',
          }}
        >
          <div ref={menuIconRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {/* Hamburger */}
              <g ref={hamburgerPathRef} style={{ opacity: 1 }}>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </g>
              {/* Plus which rotates 135deg to become X */}
              <g ref={closePathRef} style={{ opacity: 0 }}>
                <line x1="12" y1="4" x2="12" y2="20" />
                <line x1="4" y1="12" x2="20" y2="12" />
              </g>
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
