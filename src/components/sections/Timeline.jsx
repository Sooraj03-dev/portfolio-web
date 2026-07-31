import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { timelineEntries } from '../../data/timeline';

import { supabase } from '../../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

// ... TypewriterYear ...

function TypewriterYear({ text, isVisible }) {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (!isVisible) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.substring(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [isVisible, text]);

  return <span>{display}</span>;
}

export default function Timeline() {
  const sectionRef = useRef(null);
  const [visibleNodes, setVisibleNodes] = useState({});
  const [entries, setEntries] = useState(timelineEntries);

  const fetchTimeline = async () => {
    try {
      const { data, error } = await supabase.from('timeline').select('*').order('id', { ascending: true });
      if (!error && data && data.length > 0) {
        setEntries(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchTimeline();
    const handleSync = () => fetchTimeline();
    window.addEventListener('timeline-sync-pulse', handleSync);
    return () => window.removeEventListener('timeline-sync-pulse', handleSync);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.timeline-spine-active', { scaleY: 1 });
      gsap.set('.timeline-node', { background: '#00FFFF', boxShadow: '0 0 12px rgba(0,255,255,0.5)' });
      gsap.set('.timeline-card', { opacity: 1, x: 0 });
      const allVisible = {};
      entries.forEach((_, i) => (allVisible[i] = true));
      setVisibleNodes(allVisible);
      return;
    }

    // 1. Scrubbed drawing spine
    const spineActive = section.querySelector('.timeline-spine-active');
    gsap.fromTo(spineActive,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: true,
        }
      }
    );

    // 2. Individual nodes and cards
    const cards = section.querySelectorAll('.timeline-item');
    
    cards.forEach((cardWrapper, index) => {
      const node = cardWrapper.querySelector('.timeline-node');
      const card = cardWrapper.querySelector('.timeline-card');
      const glitchTrail = cardWrapper.querySelector('.glitch-trail');
      const isLeft = cardWrapper.dataset.side === 'left';
      
      // Initial state
      gsap.set(node, { background: '#112233', boxShadow: 'none', scale: 0.8 });
      gsap.set(card, { opacity: 0, x: isLeft ? -50 : 50 });
      gsap.set(glitchTrail, { opacity: 0, scaleX: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardWrapper,
          start: 'top 50%', // Aligns with the spine drawing
          toggleActions: 'play none none none',
          onEnter: () => {
            setVisibleNodes(prev => ({ ...prev, [index]: true }));
          }
        }
      });

      // Node energize
      tl.to(node, {
        background: '#00FFFF',
        boxShadow: '0 0 12px rgba(0,255,255,0.8), 0 0 24px rgba(0,255,255,0.4)',
        scale: 1.2,
        duration: 0.2,
      }).to(node, {
        scale: 1,
        boxShadow: '0 0 12px rgba(0,255,255,0.5)',
        duration: 0.3
      }, '>');

      // Slide in card & Glitch Trail
      tl.to(glitchTrail, {
        opacity: 0.8,
        scaleX: 1,
        duration: 0.2,
        ease: 'power2.out',
      }, '<0.1')
      .to(card, {
        opacity: 1,
        x: 0,
        duration: 0.4,
        ease: 'back.out(1.2)'
      }, '<')
      .to(glitchTrail, {
        opacity: 0,
        scaleX: 0,
        duration: 0.2,
        transformOrigin: isLeft ? 'right' : 'left',
      }, '>');

    });

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === section || t.trigger.closest('#timeline')) t.kill();
      });
    };
  }, [entries.length]);

  return (
    <section id="timeline" ref={sectionRef} className="relative py-24 px-6 md:px-12" style={{ background: '#010308' }}>
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className="font-orbitron text-xl sm:text-3xl md:text-4xl font-bold uppercase tracking-cyber mb-4 neon-text-cyan text-center break-all sm:break-normal">
          // ACTIVITY_LOG
        </h2>
        <div className="w-24 h-px mx-auto mb-16" style={{ background: 'linear-gradient(to right, transparent, #00FFFF, transparent)' }} />

        {/* Timeline container */}
        <div className="timeline-container relative">
          
          {/* Background Dim Line */}
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-neon-cyan/10" />
          
          {/* Active Drawing Line */}
          <div className="timeline-spine-active absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] origin-top" style={{ background: 'linear-gradient(to bottom, #00FFFF, #FF2D78)', boxShadow: '0 0 8px rgba(0,255,255,0.4)' }} />

          {/* Entries */}
          {entries.map((entry, index) => {
            const isLeft = entry.side === 'left';
            
            return (
              <div key={index} data-side={entry.side} className={`timeline-item relative flex items-center mb-16 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                {/* Spacer */}
                <div className="hidden md:block flex-1" />

                {/* Hexagonal node on timeline */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-20">
                  <div className="timeline-node hex-clip w-5 h-6 transition-colors duration-300" />
                </div>

                {/* Card side */}
                <div className="flex-1 pl-12 pr-0 md:px-8 relative w-full">
                  {/* Glitch Trail Element */}
                  <div 
                    className="glitch-trail absolute top-1/2 -translate-y-1/2 h-1 z-0 pointer-events-none hidden md:block"
                    style={{
                      background: 'linear-gradient(90deg, transparent, #00FFFF, #FF2D78)',
                      width: '100px',
                      [isLeft ? 'right' : 'left']: '0px',
                      transformOrigin: isLeft ? 'left' : 'right',
                    }}
                  />

                  <div className={`timeline-card notch-card-tr neon-border p-5 relative z-10 ${isLeft ? 'md:mr-8' : 'md:ml-8'}`} style={{ background: '#050C14' }}>
                    {/* Connection line */}
                    <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-8 h-px" style={{ background: 'rgba(0,255,255,0.3)', [isLeft ? 'right' : 'left']: '-32px' }} />

                    <div className="font-jetbrains text-xs mb-1" style={{ color: '#00FFFF', minHeight: '16px' }}>
                      <TypewriterYear text={entry.year} isVisible={visibleNodes[index]} />
                    </div>
                    <h3 className="font-orbitron text-sm font-bold uppercase tracking-cyber text-text-primary mb-2">
                      {entry.title}
                    </h3>
                    <p className="font-share-tech text-xs text-text-dim leading-relaxed mb-3">
                      {entry.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {entry.stack.map(tech => (
                        <span key={tech} className="font-rajdhani text-xs px-1.5 py-0.5 uppercase" style={{ border: '1px solid rgba(0,255,255,0.2)', color: '#3A6A7A', fontSize: '10px', letterSpacing: '0.06em' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
