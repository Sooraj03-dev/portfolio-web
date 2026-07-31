export default function HeroCTAs() {
  return (
    <div 
      className="hero-ctas mt-7 flex flex-wrap justify-center gap-4"
      style={{
        transform: 'translate(calc(var(--mouse-x, 0) * -4px), calc(var(--mouse-y, 0) * -2px))',
        transition: 'transform 0.2s ease-out'
      }}
    >
      <a 
        href="#projects"
        className="cyber-cta cyber-cta-primary group relative inline-flex items-center gap-3 overflow-hidden font-rajdhani text-[13px] font-bold tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
      >
        <span className="cyber-cta-core relative z-10">
          VIEW PROJECTS
        </span>
        <span className="cyber-cta-icon relative z-10" aria-hidden="true">↗</span>
        <span className="cyber-cta-sheen" aria-hidden="true" />
      </a>

      <a 
        href="/cv.pdf"
        download
        target="_blank"
        rel="noopener noreferrer"
        className="cyber-cta cyber-cta-secondary group relative inline-flex items-center gap-3 overflow-hidden font-rajdhani text-[13px] font-bold tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan"
      >
        <span className="cyber-cta-core relative z-10">
          DOWNLOAD CV
        </span>
        <span className="cyber-cta-icon relative z-10" aria-hidden="true">↓</span>
        <span className="cyber-cta-sheen" aria-hidden="true" />
      </a>
    </div>
  );
}
