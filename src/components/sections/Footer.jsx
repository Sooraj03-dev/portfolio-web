export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-neon-cyan/20 bg-void relative z-10">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <span className="text-neon-cyan text-[10px]">●</span>
          <span className="font-orbitron font-bold text-sm tracking-widest text-text-primary">
            SOORAJ S.
          </span>
        </div>

        <div className="font-jetbrains text-[10px] text-text-dim tracking-widest uppercase">
          © {new Date().getFullYear()} ALL SYSTEMS OPERATIONAL.
        </div>

        <div className="flex gap-6">
          <a href="https://github.com/Sooraj03-dev" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-[10px] text-neon-cyan tracking-widest hover:text-white transition-colors">
            GITHUB
          </a>
          <a href="https://linkedin.com/in/sooraj" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-[10px] text-neon-pink tracking-widest hover:text-white transition-colors">
            LINKEDIN
          </a>
          <a href="mailto:sooraj@unknown03x.dev" className="font-jetbrains text-[10px] text-neon-cyan tracking-widest hover:text-white transition-colors">
            EMAIL
          </a>
        </div>

      </div>
    </footer>
  );
}
