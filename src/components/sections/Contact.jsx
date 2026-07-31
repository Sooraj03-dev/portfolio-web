import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Contact() {
  const [formState, setFormState] = useState('idle');
  const [adminEmail, setAdminEmail] = useState('sooraj@unknown03x.dev');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [captchaStatus, setCaptchaStatus] = useState('idle');

  const handleCaptchaClick = () => {
    if (captchaStatus !== 'idle') return;
    setCaptchaStatus('verifying');
    setTimeout(() => {
      setCaptchaStatus('verified');
    }, 1500);
  };

  const fetchEmail = async () => {
    try {
      const { data, error } = await supabase.from('profile').select('email').eq('id', 1).single();
      if (!error && data && data.email) {
        setAdminEmail(data.email);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchEmail();
    const handleSync = () => fetchEmail();
    window.addEventListener('profile-sync-pulse', handleSync);
    return () => window.removeEventListener('profile-sync-pulse', handleSync);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('sending');
    
    // Create mailto link
    const subject = encodeURIComponent(`New Transmission from ${name}`);
    const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`);
    window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
    
    setTimeout(() => {
      setFormState('sent');
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setFormState('idle'), 3000);
    }, 500);
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 bg-void">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-orbitron text-xl sm:text-3xl md:text-4xl font-bold uppercase tracking-cyber mb-4 neon-text-pink text-center break-all sm:break-normal">
          ESTABLISH_CONNECTION
        </h2>
        <div className="w-24 h-px mx-auto mb-16" style={{ background: 'linear-gradient(to right, transparent, #FF2D78, transparent)' }} />
        
        <div className="notch-card-tl p-8 md:p-12 relative" style={{ background: 'rgba(5, 12, 20, 0.8)', border: '1px solid rgba(255,45,120,0.3)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-jetbrains text-[10px] text-neon-pink tracking-widest uppercase">ID / NAME</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#010308] border border-neon-pink/30 text-text-primary p-3 font-share-tech outline-none focus:border-neon-pink focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-jetbrains text-[10px] text-neon-pink tracking-widest uppercase">COMM_LINK / EMAIL</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#010308] border border-neon-pink/30 text-text-primary p-3 font-share-tech outline-none focus:border-neon-pink focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all" 
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-jetbrains text-[10px] text-neon-pink tracking-widest uppercase">TRANSMISSION_DATA / MESSAGE</label>
              <textarea 
                rows="5" 
                required 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-[#010308] border border-neon-pink/30 text-text-primary p-3 font-share-tech outline-none focus:border-neon-pink focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all resize-none"
              ></textarea>
            </div>
            {/* Fake Captcha */}
            <div className="flex items-center gap-4 p-4 bg-[#010308] border border-neon-pink/20 notch-card-br w-full sm:w-fit mt-2 select-none cursor-pointer group" onClick={handleCaptchaClick}>
              <div 
                className={`w-6 h-6 border flex items-center justify-center transition-all shrink-0 ${captchaStatus === 'verified' ? 'bg-neon-pink border-neon-pink' : 'border-neon-pink/50 group-hover:border-neon-pink'}`}
              >
                {captchaStatus === 'verifying' && <div className="w-3 h-3 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />}
                {captchaStatus === 'verified' && <span className="text-white font-bold text-sm">✓</span>}
              </div>
              <div className="flex flex-col">
                <span className="font-jetbrains text-xs sm:text-sm text-text-secondary">
                  I am a recruiter
                </span>
                <div className="h-3 mt-1">
                  {captchaStatus === 'verifying' && <span className="font-jetbrains text-[9px] text-neon-pink animate-pulse">VERIFYING...</span>}
                  {captchaStatus === 'verified' && <span className="font-jetbrains text-[9px] text-neon-pink">✓ VERIFIED. (YOU WEREN'T ACTUALLY CHECKED.)</span>}
                </div>
              </div>
            </div>

            <button type="submit" disabled={formState !== 'idle' || captchaStatus !== 'verified'} className="notch-card-tr bg-neon-pink text-white font-orbitron font-bold tracking-widest py-4 hover:bg-white hover:text-neon-pink transition-all mt-4 disabled:opacity-50 disabled:hover:bg-neon-pink disabled:hover:text-white">
              {formState === 'idle' ? 'INITIATE TRANSFER' : formState === 'sending' ? 'TRANSMITTING...' : 'CONNECTION ESTABLISHED'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
