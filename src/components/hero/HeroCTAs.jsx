import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function HeroCTAs() {
  const [cvUrl, setCvUrl] = useState('/cv.pdf');

  const [isBreaching, setIsBreaching] = useState(false);
  const [breachProgress, setBreachProgress] = useState(0);

  const fetchCvUrl = async () => {
    try {
      const { data, error } = await supabase.from('profile').select('cv_url').eq('id', 1).single();
      if (!error && data && data.cv_url) {
        setCvUrl(data.cv_url);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchCvUrl();
    const handleSync = () => fetchCvUrl();
    window.addEventListener('profile-sync-pulse', handleSync);
    return () => window.removeEventListener('profile-sync-pulse', handleSync);
  }, []);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (isBreaching) return;

    if (cvUrl !== '/cv.pdf') {
      setIsBreaching(true);
      setBreachProgress(0);

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 18) + 8;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setBreachProgress(progress);
          
          setTimeout(async () => {
            setIsBreaching(false);
            try {
              const response = await fetch(cvUrl);
              const blob = await response.blob();
              const downloadUrl = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.download = 'CV.pdf';
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(downloadUrl);
            } catch (err) {
              window.open(cvUrl, '_blank');
            }
          }, 400);
        } else {
          setBreachProgress(progress);
        }
      }, 150);
    } else {
      window.open('/cv.pdf', '_blank');
    }
  };

  return (
    <div 
      className="hero-ctas mt-7 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 w-full px-4 sm:px-0"
      style={{
        transform: 'translate(calc(var(--mouse-x, 0) * -4px), calc(var(--mouse-y, 0) * -2px))',
        transition: 'transform 0.2s ease-out'
      }}
    >
      <a 
        href="#projects"
        className="cyber-cta cyber-cta-primary group relative inline-flex justify-center items-center gap-3 overflow-hidden font-rajdhani text-[13px] font-bold tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan w-full sm:w-auto"
      >
        <span className="cyber-cta-core relative z-10">
          VIEW PROJECTS
        </span>
        <span className="cyber-cta-icon relative z-10" aria-hidden="true">↗</span>
        <span className="cyber-cta-sheen" aria-hidden="true" />
      </a>

      <a 
        href={cvUrl}
        onClick={handleDownload}
        download="CV.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className={`cyber-cta cyber-cta-secondary group relative inline-flex justify-center items-center gap-3 overflow-hidden font-rajdhani text-[13px] font-bold tracking-[0.18em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-cyan w-full sm:w-auto ${isBreaching ? 'bg-red-900/40 border-red-500/50 text-red-400' : ''}`}
      >
        <span className="cyber-cta-core relative z-10 flex items-center gap-2">
          {isBreaching ? (
            <>
              <span className="animate-pulse">BYPASSING ICE...</span>
              <span className="font-jetbrains text-[11px] opacity-80">[{breachProgress}%]</span>
            </>
          ) : (
            'DOWNLOAD CV'
          )}
        </span>
        {!isBreaching && <span className="cyber-cta-icon relative z-10" aria-hidden="true">↓</span>}
        <span className="cyber-cta-sheen" aria-hidden="true" />
      </a>
    </div>
  );
}
