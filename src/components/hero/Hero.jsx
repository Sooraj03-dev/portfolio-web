import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import VideoBackground from './VideoBackground';
import ParticleCanvas from './ParticleCanvas';
import TerminalBoot from './TerminalBoot';
import HeroName from './HeroName';
import HeroSubtitle from './HeroSubtitle';
import RoleTypewriter from './RoleTypewriter';
import HeroCTAs from './HeroCTAs';
import ScrollIndicator from './ScrollIndicator';

export default function Hero() {
  useMouseParallax();
  const sectionRef = useRef(null);
  
  const [bootComplete, setBootComplete] = useState(false);
  const [nameResolved, setNameResolved] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setBootComplete(true);
      setNameResolved(true);
      return;
    }
  }, []);

  useEffect(() => {
    if (!nameResolved) return;
    
    const section = sectionRef.current;
    if (!section) return;

    // Subtitle, Role, CTAs, Scroll appear after name is resolved
    const sub     = section.querySelector('.hero-subtitle');
    const role    = section.querySelector('.hero-role');
    const ctas    = section.querySelector('.hero-ctas');
    const scroll  = section.querySelector('.scroll-indicator');

    const tl = gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'all' } });

    if (sub)   gsap.set(sub,   { opacity: 0, y: 15 });
    if (role)  gsap.set(role,  { opacity: 0 });
    if (ctas)  gsap.set(ctas,  { opacity: 0, y: 10 });
    if (scroll) gsap.set(scroll, { opacity: 0 });

    if (sub)   tl.to(sub,   { opacity: 1, y: 0, duration: 0.7 }, 0.2);
    if (role)  tl.to(role,  { opacity: 1, duration: 0.5 }, '-=0.1');
    if (ctas)  tl.to(ctas,  { opacity: 1, y: 0, duration: 0.6 }, '-=0.2');
    if (scroll) tl.to(scroll, { opacity: 1, duration: 0.8 }, '-=0.3');

    return () => tl.kill();
  }, [nameResolved]);

  return (
    <section ref={sectionRef} id="hero" className="relative w-full h-screen overflow-hidden bg-void">
      {/* Video Background */}
      <div className="hero-video-container absolute inset-0 z-0">
        <VideoBackground />
      </div>

      {/* Three.js Particle Canvas */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ParticleCanvas />
      </div>

      {/* Scanline sweep bar */}
      <div
        className="absolute top-1/2 left-0 w-full h-px z-[6] pointer-events-none"
        style={{ background: 'rgba(0,255,255,0.3)', boxShadow: '0 0 10px #00FFFF' }}
      />

      {/* Hero Content */}
      <div
        className="absolute inset-0 z-[10] flex flex-col items-center justify-center px-6 text-center pointer-events-none"
        style={{ paddingTop: '64px' }}
      >
        {!bootComplete && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <TerminalBoot onComplete={() => setBootComplete(true)} />
          </div>
        )}
        
        <div style={{ opacity: bootComplete ? 1 : 0 }} className="flex flex-col items-center">
          <HeroName isStarted={bootComplete} onComplete={() => setNameResolved(true)} />
          <HeroSubtitle />
          <RoleTypewriter />
          <div className="pointer-events-auto">
            <HeroCTAs />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
}
