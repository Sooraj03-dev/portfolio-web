import { useState, useEffect } from 'react';
import MusicToggle from './MusicToggle';
import MobileRadialNav from './MobileRadialNav';

const NAV_LINKS = [
  { label: 'HERO', href: '#hero' },
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'TIMELINE', href: '#timeline' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar({ terminalOpen, onToggleTerminal, isPlaying, toggleMute, onNextTrack }) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      let current = 'hero';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            current = section;
            break;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ambient Firewall Integrity logic
  const [fwIntegrity, setFwIntegrity] = useState(99.8);
  useEffect(() => {
    const interval = setInterval(() => {
      // randomly tick between 97.5 and 99.9
      const newFw = 97.5 + Math.random() * 2.4;
      setFwIntegrity(newFw.toFixed(1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300 pt-2 sm:pt-0"
        style={{
          background: scrolled ? 'rgba(1,3,8,0.88)' : 'rgba(1,3,8,0.0)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,255,255,0.15)' : '1px solid transparent',
          height: '72px',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex flex-col">
            <a href="#hero" className="clickable flex flex-col decoration-none group">
              <span 
                className="font-orbitron font-bold text-sm tracking-widest text-transparent bg-clip-text transition-opacity duration-300" 
                style={{ backgroundImage: 'linear-gradient(135deg, #00FFFF, #FF2D78)', WebkitBackgroundClip: 'text' }}
              >
                SØØRAJ
              </span>
              <span className="font-jetbrains text-[9px] text-neon-cyan tracking-widest mt-0.5 group-hover:text-white transition-colors duration-300">
                &gt; SYSTEM ONLINE
              </span>
            </a>
          </div>

          {/* Links Area */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="clickable font-jetbrains text-[10px] tracking-widest uppercase transition-colors duration-200"
                  style={{
                    color: isActive ? '#00FFFF' : '#3A6A7A',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#E8F4F8'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#3A6A7A'; }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Status Area */}
          <div className="flex items-center gap-2 md:items-end md:gap-4">
            
            {/* Ambient FW Meter */}
            <div className="hidden sm:flex flex-col items-end justify-center mr-2">
              <div className="font-jetbrains text-[9px] text-neon-cyan/70 tracking-widest uppercase mb-[2px]">
                FW_INTEGRITY
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-neon-cyan/20 overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full bg-neon-cyan transition-all duration-300" style={{ width: `${fwIntegrity}%` }} />
                </div>
                <span className="font-jetbrains text-[10px] text-white tabular-nums w-[32px] text-right">{fwIntegrity}%</span>
              </div>
            </div>

            <button
              type="button"
              className="clickable cyber-navbar-logo-btn"
              onClick={onToggleTerminal}
              aria-label={terminalOpen ? 'Close terminal' : 'Open terminal'}
              title={terminalOpen ? 'Close terminal' : 'Open terminal'}
            >
              <span className="cyber-navbar-logo-mark">03X</span>
            </button>

            <MusicToggle isPlaying={isPlaying} toggleMute={toggleMute} onNextTrack={onNextTrack} />

            <div className="hidden md:flex flex-col items-end">
              <span className="font-jetbrains text-[9px] text-neon-pink tracking-widest flex items-center gap-1.5">
                SYS: ONLINE <span className="text-text-dim">|</span> BUILD: v2.4.7
              </span>
              <span className="font-jetbrains text-[9px] text-text-dim mt-1">
                12.9716°N 77.5946°E
              </span>
            </div>
          </div>
        </div>
      </nav>
      <MobileRadialNav activeSection={activeSection} />
    </>
  );
}
