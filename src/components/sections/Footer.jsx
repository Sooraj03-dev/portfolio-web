import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Footer() {
  const [links, setLinks] = useState({
    github: 'https://github.com/Sooraj03-dev',
    linkedin: 'https://linkedin.com/in/sooraj',
    email: 'sooraj@unknown03x.dev'
  });

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase.from('profile').select('github_url, linkedin_url, email').eq('id', 1).single();
      if (!error && data) {
        setLinks({
          github: data.github_url || 'https://github.com/Sooraj03-dev',
          linkedin: data.linkedin_url || 'https://linkedin.com/in/sooraj',
          email: data.email || 'sooraj@unknown03x.dev'
        });
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchLinks();
    const handleSync = () => fetchLinks();
    window.addEventListener('profile-sync-pulse', handleSync);
    return () => window.removeEventListener('profile-sync-pulse', handleSync);
  }, []);

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
          <a href={links.github} target="_blank" rel="noopener noreferrer" className="font-jetbrains text-[10px] text-neon-cyan tracking-widest hover:text-white transition-colors">
            GITHUB
          </a>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="font-jetbrains text-[10px] text-neon-pink tracking-widest hover:text-white transition-colors">
            LINKEDIN
          </a>
          <a href={`mailto:${links.email}`} className="font-jetbrains text-[10px] text-neon-cyan tracking-widest hover:text-white transition-colors">
            EMAIL
          </a>
        </div>

      </div>
    </footer>
  );
}
