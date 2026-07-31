import { useState } from 'react';

export default function Contact() {
  const [formState, setFormState] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormState('sending');
    setTimeout(() => setFormState('sent'), 1500);
  };

  return (
    <section id="contact" className="relative py-24 px-6 md:px-12 bg-void">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-orbitron text-3xl md:text-4xl font-bold uppercase tracking-cyber mb-4 neon-text-pink text-center">
          ESTABLISH_CONNECTION
        </h2>
        <div className="w-24 h-px mx-auto mb-16" style={{ background: 'linear-gradient(to right, transparent, #FF2D78, transparent)' }} />
        
        <div className="notch-card-tl p-8 md:p-12 relative" style={{ background: 'rgba(5, 12, 20, 0.8)', border: '1px solid rgba(255,45,120,0.3)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-jetbrains text-[10px] text-neon-pink tracking-widest uppercase">ID / NAME</label>
                <input type="text" required className="bg-[#010308] border border-neon-pink/30 text-text-primary p-3 font-share-tech outline-none focus:border-neon-pink focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-jetbrains text-[10px] text-neon-pink tracking-widest uppercase">COMM_LINK / EMAIL</label>
                <input type="email" required className="bg-[#010308] border border-neon-pink/30 text-text-primary p-3 font-share-tech outline-none focus:border-neon-pink focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all" />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-jetbrains text-[10px] text-neon-pink tracking-widest uppercase">TRANSMISSION_DATA / MESSAGE</label>
              <textarea rows="5" required className="bg-[#010308] border border-neon-pink/30 text-text-primary p-3 font-share-tech outline-none focus:border-neon-pink focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all resize-none"></textarea>
            </div>

            <button type="submit" disabled={formState !== 'idle'} className="notch-card-tr bg-neon-pink text-white font-orbitron font-bold tracking-widest py-4 hover:bg-white hover:text-neon-pink transition-all mt-4 disabled:opacity-50">
              {formState === 'idle' ? 'INITIATE TRANSFER' : formState === 'sending' ? 'TRANSMITTING...' : 'CONNECTION ESTABLISHED'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
