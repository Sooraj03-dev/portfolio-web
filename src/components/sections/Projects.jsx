import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../../data/projects';

gsap.registerPlugin(ScrollTrigger);

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

function ScrambleTitle({ text, isStarted }) {
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    if (!isStarted) return;
    
    let chars = text.split('');
    let current = chars.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
    setDisplay(current.join(''));
    
    let iterations = 0;
    const maxIterations = 15;
    
    const interval = setInterval(() => {
      iterations++;
      current = current.map((char, i) => {
        if (i < (iterations / maxIterations) * chars.length) {
          return chars[i];
        }
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      });
      setDisplay(current.join(''));
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, 40);
    
    return () => clearInterval(interval);
  }, [isStarted, text]);
  
  return <span>{display || text.replace(/./g, '—')}</span>;
}

export default function Projects() {
  const sectionRef = useRef(null);
  const [titlesStarted, setTitlesStarted] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set('.project-border', { strokeDashoffset: 0 });
      gsap.set('.project-content', { opacity: 1 });
      gsap.set('.project-tech-tag', { opacity: 1, x: 0 });
      gsap.set('.project-action-btn', { opacity: 1, y: 0 });
      setTitlesStarted(true);
      return;
    }

    const cards = section.querySelectorAll('.project-card-wrapper');
    gsap.set('.project-content', { opacity: 0 });
    gsap.set('.project-border', { strokeDashoffset: 1500 });
    gsap.set('.project-tech-tag', { opacity: 0, x: -15 });
    gsap.set('.project-action-btn', { opacity: 0, y: 10 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    });

    cards.forEach((card, i) => {
      const content = card.querySelector('.project-content');
      const border = card.querySelector('.project-border');
      const tags = card.querySelectorAll('.project-tech-tag');
      const actions = card.querySelectorAll('.project-action-btn');
      
      const startTime = i * 0.15; // Staggered row by row (or card by card)

      // CRT Flicker In
      tl.to(content, { opacity: 0.5, duration: 0.05 }, startTime)
        .to(content, { opacity: 0.1, duration: 0.05 }, startTime + 0.05)
        .to(content, { opacity: 0.8, duration: 0.05 }, startTime + 0.1)
        .to(content, { opacity: 1, duration: 0.1 }, startTime + 0.15);

      // Border Draw
      tl.to(border, { strokeDashoffset: 0, duration: 0.8, ease: 'power2.out' }, startTime);

      // Staggered Tags
      tl.to(tags, {
        opacity: 1,
        x: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: 'back.out(1.5)'
      }, startTime + 0.3);

      // Actions pop in
      if (actions.length > 0) {
        tl.to(actions, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.out'
        }, startTime + 0.5);
      }
    });
    
    // Start scramble for all titles roughly midway through the entrance
    tl.add(() => setTitlesStarted(true), 0.2);

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="text-neon-cyan flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00FFFF]" />
            ACTIVE
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="text-[#3A9A7A] flex items-center">
            SHIPPED
          </span>
        );
      case 'ARCHIVED':
      default:
        return (
          <span className="text-text-dim flex items-center">
            ARCHIVED
          </span>
        );
    }
  };

  return (
    <section id="projects" ref={sectionRef} className="relative py-24 px-6 md:px-12" style={{ background: '#010308' }}>
      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="font-orbitron text-3xl md:text-4xl font-bold uppercase tracking-cyber mb-4 neon-text-cyan text-center">
          SYSTEM_ARCHIVES
        </h2>
        <div className="w-24 h-px mx-auto mb-16" style={{ background: 'linear-gradient(to right, transparent, #00FFFF, transparent)' }} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.title} className="project-card-wrapper notch-card-tr relative group clickable overflow-hidden flex flex-col" style={{ background: 'rgba(5, 12, 20, 0.7)', border: '1px solid rgba(0,255,255,0.05)', transition: 'background 0.3s ease' }}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" preserveAspectRatio="none">
                <rect className="project-border" x="0" y="0" width="100%" height="100%" fill="none" stroke="#00FFFF" strokeWidth="2" strokeDasharray="1500" strokeDashoffset="1500" />
              </svg>
              
              <div className="hover-brackets absolute inset-0 pointer-events-none transition-opacity duration-300 z-20 opacity-0 group-hover:opacity-100">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-pink" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-pink" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-pink" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-pink" />
              </div>

              <div className="hover-scanline absolute left-0 w-full h-8 pointer-events-none z-10 top-[-20%] group-hover:top-[100%]" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,255,255,0.15), transparent)', transition: 'top 0.8s linear' }} />

              <div className="p-6 h-full flex flex-col relative z-30 project-content opacity-0 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className="font-jetbrains text-[10px] tracking-widest uppercase flex items-center gap-2">
                    <span className="text-text-dim">STATUS //</span> {getStatusDisplay(project.status)}
                  </div>
                </div>

                <h3 className="project-title font-orbitron text-xl font-bold tracking-wider text-text-primary mb-3 transition-colors group-hover:text-neon-cyan">
                  <ScrambleTitle text={project.title} isStarted={titlesStarted} />
                </h3>
                <p className="font-share-tech text-sm text-text-dim leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto project-tags-container mb-6">
                  {project.stack.map(tech => (
                    <span key={tech} className="project-tech-tag font-rajdhani text-[11px] uppercase px-2 py-1 bg-neon-cyan/5 text-neon-cyan border border-neon-cyan/20 opacity-0 translate-x-[-15px]">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap gap-3 mt-auto">
                  {project.github && project.github !== '#' && (
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-action-btn relative font-rajdhani text-[10px] tracking-widest text-text-primary px-4 py-1.5 transition-colors duration-300 border border-text-dim/50 hover:border-neon-cyan hover:text-neon-cyan z-40"
                      style={{ clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)' }}
                    >
                      [ GITHUB ]
                    </a>
                  )}
                  {project.demo && project.demo !== '#' && (
                    <a 
                      href={project.demo} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-action-btn relative font-rajdhani text-[10px] tracking-widest text-neon-pink px-4 py-1.5 transition-colors duration-300 border border-neon-pink/50 hover:bg-neon-pink/10 z-40"
                      style={{ clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)' }}
                    >
                      [ LIVE DEMO ]
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
