import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function HeroSubtitle() {
  const [words, setWords] = useState(['AI', 'ML', 'FULL STACK']);
  
  const fetchSubtitle = async () => {
    try {
      const { data, error } = await supabase.from('profile').select('hero_subtitle').eq('id', 1).single();
      if (!error && data && data.hero_subtitle) {
        setWords(data.hero_subtitle.split(',').map(w => w.trim()));
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchSubtitle();
    const handleSync = () => fetchSubtitle();
    window.addEventListener('profile-sync-pulse', handleSync);
    return () => window.removeEventListener('profile-sync-pulse', handleSync);
  }, []);

  return (
    <div 
      className="hero-subtitle mt-3 font-rajdhani font-semibold text-[14px] uppercase tracking-[0.35em]"
      style={{
        color: 'rgba(0,255,255,0.7)',
        transform: 'translate(calc(var(--mouse-x, 0) * -8px), calc(var(--mouse-y, 0) * -5px))',
        transition: 'transform 0.15s ease-out'
      }}
    >
      {words.map((word, i) => (
        <span key={word + i}>
          {word}
          {i < words.length - 1 && (
            <span style={{ color: '#FF2D78' }}> &middot; </span>
          )}
        </span>
      ))}
    </div>
  );
}
