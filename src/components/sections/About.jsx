import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { supabase } from '../../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const BOOT_MESSAGE = 'UNKNOWN03X OS v2.4.7';
const BOOT_TAG = '[ROOT ACCESS GRANTED]';
const HELP_TEXT = `Available commands: whoami, cat, locate, ls, clear, help
// some commands are not listed here.`;

const COMMAND_RESPONSES = {
  whoami: 'UNKNOWN03X OPERATIVE',
  'cat role.txt': 'FULL-STACK ENGINEER / AI RESEARCHER',
  'cat education.txt': 'M S RAMAIAH UNIVERSITY OF APPLIED SCIENCES',
  'locate --base': 'BENGALURU, IN',
  'cat mission.log': `We operate at the bleeding edge of software and hardware.
My mission is to architect scalable systems, deploy autonomous AI agents, and build digital experiences that feel like they belong in the year 2077.

From crafting immersive 3D web interfaces to engineering robust backends and machine learning pipelines, I build what shouldn't exist.`,
  ls: 'role.txt  education.txt  mission.log',
  help: HELP_TEXT,
};

const TWEAK_RESPONSES = {
  neon: {
    kind: 'tweak',
    effect: 'neon',
    text: 'NEON GRID STABILIZED. HIGHLIGHTS NOW ILLEGALLY SHARP.',
  },
  glitch: {
    kind: 'tweak',
    effect: 'glitch',
    text: 'GLITCH FREQUENCY +13%. REALITY IS NOW A FEATURE.',
  },
  bass: {
    kind: 'tweak',
    effect: 'bass',
    text: 'SYNTH BASS INJECTION COMPLETE. SUBWOOFERS FEAR YOU.',
  },
  coffee: {
    kind: 'tweak',
    effect: 'coffee',
    text: 'CAFFEINE OVERCLOCK ONLINE. JITTERS HAVE BEEN OPTIMIZED.',
  },
  gravity: {
    kind: 'tweak',
    effect: 'gravity',
    text: 'GRAVITY DISABLED. WALK LIKE A BUG IN A LEGENDARY BUILD.',
  },
  empathy: {
    kind: 'tweak',
    effect: 'empathy',
    text: 'EMPATHY MODULE NOT FOUND. TRY AGAIN AFTER REBOOTING YOUR SOUL.',
  },
};

function makeBootEntry() {
  return { id: 'boot', kind: 'boot' };
}

function makeId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function progressBar(percent) {
  const filled = Math.max(0, Math.min(10, Math.round((percent / 100) * 10)));
  return `[${'■'.repeat(filled)}${'□'.repeat(10 - filled)}] ${Math.round(percent)}%`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getInitialPosition() {
  if (typeof window === 'undefined') {
    return { x: 120, y: 120 };
  }

  return {
    x: Math.max(24, Math.round(window.innerWidth / 2 - 360)),
    y: Math.max(88, Math.round(window.innerHeight / 2 - 260)),
  };
}

function GlobalMatrixOverlay({ isExiting }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = Math.max(14, Math.floor(width / 80));
    const columns = Math.floor(width / fontSize);
    const drops = new Array(columns).fill(0).map(() => Math.random() * -100);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
    
    let animationFrameId;
    let lastTime = 0;
    const fps = 35;
    const interval = 1000 / fps;

    const draw = (currentTime) => {
      animationFrameId = requestAnimationFrame(draw);
      
      if (currentTime - lastTime < interval) return;
      lastTime = currentTime;

      ctx.fillStyle = 'rgba(1, 3, 8, 0.15)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        ctx.fillStyle = Math.random() > 0.95 ? '#FF2D78' : '#00FFFF';
        
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return createPortal(
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-[9998] pointer-events-none transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-75'}`}
    />,
    document.body
  );
}

function AuthLoadingEffect() {
  const [dots, setDots] = useState('');
  const [scramble, setScramble] = useState('');

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 300);
    const chars = '$#@!%^&*()_+-={}|:"<>?~`';
    const scrambleInterval = setInterval(() => {
      let s = '';
      for (let i = 0; i < 24; i++) {
        s += chars[Math.floor(Math.random() * chars.length)];
      }
      setScramble(s);
    }, 50);
    return () => { clearInterval(dotInterval); clearInterval(scrambleInterval); };
  }, []);

  return (
    <div className="space-y-1 my-2">
      <div className="text-neon-cyan font-jetbrains tracking-wider uppercase text-sm">{`> AUTHENTICATING${dots}`}</div>
      <div className="text-text-dim text-xs opacity-60 tracking-widest">{scramble}</div>
    </div>
  );
}

function SyncSpinnerEffect() {
  const [frame, setFrame] = useState(0);
  const frames = ['|', '/', '—', '\\'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 80);
    return () => clearInterval(interval);
  }, []);
  
  return <div className="text-text-dim my-2">{`> SYNCING GITHUB TELEMETRY... ${frames[frame]}`}</div>;
}

function LinkedInCard() {
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/sooraj');

  const fetchLinkedinUrl = async () => {
    try {
      const { data, error } = await supabase.from('profile').select('linkedin_url').eq('id', 1).single();
      if (!error && data && data.linkedin_url) {
        setLinkedinUrl(data.linkedin_url);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchLinkedinUrl();
    const handleSync = () => fetchLinkedinUrl();
    window.addEventListener('profile-sync-pulse', handleSync);
    return () => window.removeEventListener('profile-sync-pulse', handleSync);
  }, []);

  return (
    <div className="linkedin-card my-4 max-w-sm flex items-start gap-4 hover:border-neon-cyan/50 transition-colors">
      <div className="w-12 h-12 bg-neon-cyan/20 rounded overflow-hidden shrink-0 flex items-center justify-center relative">
        <div className="absolute inset-0 border border-neon-cyan/40" />
        <span className="font-orbitron text-neon-cyan font-bold text-xl">in</span>
      </div>
      <div>
        <h4 className="font-orbitron text-[#00FFFF] text-sm mb-1 tracking-widest uppercase">Sooraj</h4>
        <p className="text-text-dim text-xs font-jetbrains leading-relaxed mb-3">
          Full-Stack Engineer & AI Researcher. Open to new opportunities.
        </p>
        <a 
          href={linkedinUrl} 
          target="_blank" 
          rel="noreferrer"
          className="inline-block border border-neon-pink/40 bg-neon-pink/10 px-3 py-1 text-neon-pink text-[10px] font-jetbrains uppercase tracking-widest hover:bg-neon-pink hover:text-black transition-colors"
        >
          [ ESTABLISH_LINK ]
        </a>
      </div>
    </div>
  );
}

function TerminalWindow({ isOpen, onClose, onLaunchGame, systemMessage, clearSystemMessage }) {
  const [history, setHistory] = useState([makeBootEntry()]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isBusy, setIsBusy] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [matrixSeed, setMatrixSeed] = useState(0);
  const [glitchFlash, setGlitchFlash] = useState(false);
  
  const [inputMode, setInputMode] = useState('normal');
  const [isAdmin, setIsAdmin] = useState(false);
  const [authAttempts, setAuthAttempts] = useState(3);
  const [adminBadgeVisible, setAdminBadgeVisible] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [newProjectData, setNewProjectData] = useState({});
  const [newSkillData, setNewSkillData] = useState({});
  const [newActivityData, setNewActivityData] = useState({});
  const [newProfileData, setNewProfileData] = useState({});

  const [position, setPosition] = useState(getInitialPosition);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const windowRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const timersRef = useRef([]);
  const matrixLastTriggered = useRef(0);

  const clearTrackedTimers = () => {
    timersRef.current.forEach((timer) => {
      window.clearTimeout(timer);
      window.clearInterval(timer);
    });
    timersRef.current = [];
  };

  const trackTimer = (timer) => {
    timersRef.current.push(timer);
    return timer;
  };

  const appendHistory = (entry) => {
    setHistory((prev) => [...prev, entry]);
  };

  const updateHistory = (entryId, updater) => {
    setHistory((prev) => prev.map((entry) => (entry.id === entryId ? updater(entry) : entry)));
  };

  useEffect(() => {
    if (systemMessage && isOpen) {
      appendHistory({
        id: makeId('system'),
        kind: 'success',
        text: systemMessage
      });
      if (clearSystemMessage) {
        clearSystemMessage();
      }
    }
  }, [systemMessage, isOpen, clearSystemMessage]);

  useEffect(() => () => clearTrackedTimers(), []);

  useEffect(() => {
    if (!isOpen) return;
    setReady(true);
    setPosition(getInitialPosition());
    inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, input, isBusy, matrixActive]);

  useEffect(() => {
    if (!dragging) return undefined;

    const handleMove = (event) => {
      const node = windowRef.current;
      if (!node) return;

      const width = node.getBoundingClientRect().width || 720;
      const height = node.getBoundingClientRect().height || 560;
      const nextX = clamp(event.clientX - dragOffsetRef.current.x, 12, window.innerWidth - width - 12);
      const nextY = clamp(event.clientY - dragOffsetRef.current.y, 72, window.innerHeight - height - 12);
      setPosition({ x: nextX, y: nextY });
    };

    const handleUp = () => setDragging(false);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragging]);

  const handlePointerDown = (event) => {
    const node = windowRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    setDragging(true);
    event.preventDefault();
  };

  const renderEntry = (item) => {
    if (item.kind === 'boot') {
      return (
        <div className="space-y-1">
          <div className="terminal-chromatic font-jetbrains text-[13px] md:text-sm tracking-[0.16em] uppercase text-neon-cyan">
            {BOOT_MESSAGE}{' '}
            <span className="ml-2 align-middle text-[10px] tracking-[0.3em] text-text-dim">
              {BOOT_TAG}
            </span>
          </div>
          <div className="terminal-system whitespace-pre-wrap text-sm leading-relaxed">
            Type "help" for a list of available commands.
          </div>
        </div>
      );
    }

    if (item.kind === 'command') {
      return (
        <div className="font-jetbrains text-[13px] md:text-sm tracking-[0.12em] uppercase">
          <span className="text-neon-pink drop-shadow-[0_0_2px_#FF2D78]">guest</span>
          <span className="text-text-dim">@unknown03x</span>
          <span className="text-neon-cyan drop-shadow-[0_0_2px_#00FFFF]">:~$</span>{' '}
          <span className="text-text-primary">{item.text}</span>
        </div>
      );
    }

    if (item.kind === 'progress') {
      return (
        <div className="terminal-system whitespace-pre-wrap pl-2 border-l-2 border-neon-cyan/30">
          <span className="terminal-progress-bar">{item.text}</span>
        </div>
      );
    }

    if (item.kind === 'scan') {
      return (
        <div className="terminal-system whitespace-pre-wrap pl-2 border-l-2 border-neon-cyan/30">
          {item.text}
        </div>
      );
    }

    if (item.kind === 'train') {
      return (
        <pre className="terminal-train whitespace-pre leading-tight text-[11px] md:text-xs tracking-[0.18em]">
          <span className="text-neon-cyan">      ____</span>
          {'\n'}
          <span className="text-neon-pink"> _/[]_[]_[]\_</span>
          <span className="text-neon-cyan">═══▷</span>
        </pre>
      );
    }

    if (item.kind === 'success') {
      return (
        <div className="terminal-success whitespace-pre-wrap pl-2 border-l-2 border-emerald-400/30">
          {item.text}
        </div>
      );
    }

    if (item.kind === 'tweak') {
      return (
        <div className={`terminal-tweak-card terminal-tweak-${item.effect} ${item.effect === 'glitch' ? 'terminal-glitch-flash' : ''}`}>
          <div className="terminal-tweak-top">
            <span className="terminal-tweak-chip">tweak::{item.effect}</span>
            <span className="terminal-tweak-status">cyberpunk animation online</span>
          </div>

          <div className="terminal-tweak-visual" aria-hidden="true">
            {item.effect === 'neon' && (
              <div className="terminal-tweak-neon">
                <span />
                <span />
                <span />
                <span />
              </div>
            )}

            {item.effect === 'glitch' && (
              <div className="terminal-tweak-glitch-text">
                <span>GLITCH</span>
                <span>GLITCH</span>
                <span>GLITCH</span>
              </div>
            )}

            {item.effect === 'bass' && (
              <div className="terminal-tweak-eq">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            )}

            {item.effect === 'coffee' && (
              <div className="terminal-tweak-coffee">
                <span>⚡</span>
                <span>⚡</span>
                <span>⚡</span>
              </div>
            )}

            {item.effect === 'gravity' && (
              <div className="terminal-tweak-gravity">
                <span className="terminal-tweak-orbit" />
                <span className="terminal-tweak-core" />
              </div>
            )}

            {item.effect === 'empathy' && (
              <div className="terminal-tweak-empathy">
                <span>❤</span>
                <span>!</span>
              </div>
            )}
          </div>

          <div className={item.kind === 'error' ? 'terminal-error' : 'terminal-success'}>
            {item.text}
          </div>
        </div>
      );
    }

    if (item.kind === 'auth_loading') {
      return <AuthLoadingEffect />;
    }
    if (item.kind === 'sync_spinner') {
      return <SyncSpinnerEffect />;
    }
    if (item.kind === 'linkedin') {
      return <LinkedInCard />;
    }

    if (item.kind === 'error') {
      if (item.isDenied) {
        return (
          <div className="space-y-1 my-2">
            <div className="text-red-glitch font-jetbrains tracking-wider" data-text={item.text}>{item.text}</div>
            {item.flavor && <div className="text-text-dim text-xs opacity-70">{item.flavor}</div>}
          </div>
        );
      }
      return (
        <div className={`terminal-error whitespace-pre-wrap pl-2 border-l-2 border-neon-pink/30 ${item.shake ? 'terminal-shake' : ''} ${item.glitch ? 'glitch-anim' : ''}`}>
          {item.text}
        </div>
      );
    }

    if (item.isGranted) {
      return (
        <div className="my-4 relative">
          <div className="admin-scanline-sweep absolute inset-0 bg-neon-cyan/20 pointer-events-none" />
          {item.text.split('\n').map((line, i) => (
            <div key={i} className="font-orbitron tracking-widest text-[#00FF88] text-lg drop-shadow-[0_0_20px_rgba(0,255,136,0.6)] opacity-0" style={{ animation: `fadeIn 0.1s ease-out forwards ${i * 0.1}s` }}>
              {line}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`terminal-system whitespace-pre-wrap pl-2 border-l-2 ${item.kind === 'success' ? 'border-neon-cyan/80 text-neon-cyan' : 'border-neon-cyan/30'} ${item.color || ''}`}>
        {item.text}
      </div>
    );
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      const finalData = { ...newProfileData, avatar_url: '/profile.png' };
      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });
      setIsBusy(true);

      import('../../lib/supabase').then(async ({ supabase }) => {
        const { error } = await supabase.from('profile').update(finalData).eq('id', 1);
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPDATE FAILED: ' + error.message }));
        } else {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ PROFILE UPDATED (IMAGE RETAINED).' }));
          window.dispatchEvent(new CustomEvent('profile-sync-pulse'));
        }
        setIsBusy(false);
        setInputMode('normal');
      });
      return;
    }
    
    const spinnerId = makeId('sync');
    appendHistory({ id: spinnerId, kind: 'sync_spinner' });
    setIsBusy(true);

    import('../../lib/supabase').then(async ({ supabase }) => {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPLOAD FAILED: ' + uploadError.message }));
        setIsBusy(false);
        setInputMode('normal');
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);
      
      const finalData = { ...newProfileData, avatar_url: publicUrl };
      
      const { error } = await supabase.from('profile').update(finalData).eq('id', 1);
      
      if (error) {
        updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPDATE FAILED: ' + error.message }));
      } else {
        updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ PROFILE UPDATED. Syncing...' }));
        window.dispatchEvent(new CustomEvent('profile-sync-pulse'));
      }
      setIsBusy(false);
      setInputMode('normal');
    });
  };

  const handleCVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      appendHistory({ id: makeId('error'), kind: 'error', text: '> UPLOAD CANCELLED.' });
      setIsBusy(false);
      setInputMode('normal');
      return;
    }
    const spinnerId = makeId('sync');
    appendHistory({ id: spinnerId, kind: 'sync_spinner' });
    setIsBusy(true);

    import('../../lib/supabase').then(async ({ supabase }) => {
      const fileName = `${Date.now()}_cv.pdf`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPLOAD FAILED: ' + uploadError.message }));
      } else {
        const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(fileName);
        const { error } = await supabase.from('profile').update({ cv_url: publicUrl }).eq('id', 1);
        
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPDATE FAILED: ' + error.message }));
        } else {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ CV UPDATED SUCCESSFULLY.' }));
          fetchProfile();
        }
      }
      setIsBusy(false);
      setInputMode('normal');
    });
  };

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed && inputMode === 'normal') return;

    if (inputMode === 'email') {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setAuthEmail(trimmed);
      setInputMode('password');
      appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER PASSWORD:' });
      setInput('');
      return;
    }

    if (inputMode === 'password') {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: '•'.repeat(trimmed.length) });
      setInput('');
      setInputMode('normal');
      setIsBusy(true);

      const authId = makeId('auth');
      appendHistory({ id: authId, kind: 'auth_loading' });

      import('../../utils/audio').then(({ playSFX }) => playSFX('keystroke'));

      // Use Supabase for Auth
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: trimmed,
        });

        if (error) {
          import('../../utils/audio').then(({ playSFX }) => playSFX('denied'));
          const newAttempts = authAttempts > 0 ? authAttempts - 1 : 0;
          setAuthAttempts(newAttempts);
          
          updateHistory(authId, (entry) => ({
            ...entry,
            kind: 'error',
            text: '> ACCESS DENIED',
            isDenied: true,
            flavor: `> ${error.message.toUpperCase()}. ${newAttempts} attempts remaining.`
          }));

          const term = document.querySelector('.terminal-window');
          if (term) {
            term.classList.add('terminal-denied-klaxon');
            setTimeout(() => term.classList.remove('terminal-denied-klaxon'), 600);
          }
        } else {
          import('../../utils/audio').then(({ playSFX }) => playSFX('granted'));
          setIsAdmin(true);
          setAdminBadgeVisible(true);
          
          updateHistory(authId, (entry) => ({
            ...entry,
            kind: 'success',
            text: `ACCESS GRANTED\nWELCOME BACK, ${data.user.email.split('@')[0].toUpperCase()}\nADMIN PROTOCOLS UNLOCKED\n\nAVAILABLE COMMANDS:\n  add project\n  remove project\n  list projects\n  add skill\n  edit skill\n  remove skill\n  list skills\n  remove category\n  add activity\n  remove activity\n  list activity\n  edit bio\n  edit hero\n  edit typewriter\n  edit cv\n  download cv\n  update email\n  update github\n  update linkedin\n  sync github`,
            isGranted: true
          }));

          const term = document.querySelector('.terminal-window');
          if (term) {
            term.classList.add('terminal-granted-flash');
            setTimeout(() => term.classList.remove('terminal-granted-flash'), 1000);
          }
        }
        setIsBusy(false);
      });
      return;
    }

    if (inputMode.startsWith('edit-hero-')) {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      
      const steps = [
        { key: 'hero_subtitle', next: 'submit', prompt: `ENTER SUBTITLE (comma separated) [${newProfileData.hero_subtitle || 'AI, ML'}]:` }
      ];

      const currentStepKey = inputMode.replace('edit-hero-', '');
      const stepIndex = steps.findIndex(s => s.key === currentStepKey);
      
      if (stepIndex !== -1) {
        const step = steps[stepIndex];
        const updatedData = { ...newProfileData, [step.key]: trimmed || newProfileData[step.key] };
        setNewProfileData(updatedData);
        
        if (step.next === 'submit') {
          setIsBusy(true);
          const spinnerId = makeId('sync');
          appendHistory({ id: spinnerId, kind: 'sync_spinner' });
          
          import('../../lib/supabase').then(async ({ supabase }) => {
            const { error } = await supabase.from('profile').update({
              hero_subtitle: updatedData.hero_subtitle
            }).eq('id', 1);
            
            if (error) {
              updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPDATE FAILED: ' + error.message }));
            } else {
              updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ HERO SUBTITLE UPDATED. Syncing...' }));
              window.dispatchEvent(new CustomEvent('profile-sync-pulse'));
            }
            setIsBusy(false);
            setInputMode('normal');
          });
        }
      }
      return;
    }

    if (inputMode.startsWith('update-')) {
      const field = inputMode.replace('update-', '');
      const dbField = field === 'email' ? 'email' : `${field}_url`;
      
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      
      const newValue = trimmed || newProfileData[dbField];
      
      setIsBusy(true);
      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });
      
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { error } = await supabase.from('profile').update({
          [dbField]: newValue
        }).eq('id', 1);
        
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPDATE FAILED: ' + error.message }));
        } else {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: `> ✓ ${field.toUpperCase()} UPDATED. Syncing...` }));
          window.dispatchEvent(new CustomEvent('profile-sync-pulse'));
        }
        setIsBusy(false);
        setInputMode('normal');
      });
      return;
    }

    if (inputMode.startsWith('edit-typewriter-')) {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      
      const steps = [
        { key: 'hero_roles', next: 'submit', prompt: `ENTER ROLES (comma separated) [${newProfileData.hero_roles || 'BUILDING ASTRA AI'}]:` }
      ];

      const currentStepKey = inputMode.replace('edit-typewriter-', '');
      const stepIndex = steps.findIndex(s => s.key === currentStepKey);
      
      if (stepIndex !== -1) {
        const step = steps[stepIndex];
        const updatedData = { ...newProfileData, [step.key]: trimmed || newProfileData[step.key] };
        setNewProfileData(updatedData);
        
        if (step.next === 'submit') {
          setIsBusy(true);
          const spinnerId = makeId('sync');
          appendHistory({ id: spinnerId, kind: 'sync_spinner' });
          
          import('../../lib/supabase').then(async ({ supabase }) => {
            const { error } = await supabase.from('profile').update({
              hero_roles: updatedData.hero_roles
            }).eq('id', 1);
            
            if (error) {
              updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPDATE FAILED: ' + error.message }));
            } else {
              updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ TYPEWRITER ROLES UPDATED. Syncing...' }));
              window.dispatchEvent(new CustomEvent('profile-sync-pulse'));
            }
            setIsBusy(false);
            setInputMode('normal');
          });
        }
      }
      return;
    }

    if (inputMode.startsWith('edit-bio-')) {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      
      const steps = [
        { key: 'first_name', next: 'edit-bio-lastname', prompt: `ENTER LAST NAME [${newProfileData.last_name || ''}]:` },
        { key: 'last_name', next: 'edit-bio-university', prompt: `ENTER UNIVERSITY [${newProfileData.university || ''}]:` },
        { key: 'university', next: 'edit-bio-degree', prompt: `ENTER DEGREE [${newProfileData.degree || ''}]:` },
        { key: 'degree', next: 'edit-bio-status', prompt: `ENTER STATUS [${newProfileData.status || ''}]:` },
        { key: 'status', next: 'edit-bio-avatar', prompt: 'PRESS ENTER TO CHANGE/KEEP AVATAR' }
      ];

      const currentStepKey = inputMode.split('edit-bio-')[1];
      const stepIndex = steps.findIndex(s => s.key.replace('_', '') === currentStepKey || s.key === currentStepKey);
      
      if (stepIndex !== -1) {
        const step = steps[stepIndex];
        setNewProfileData(prev => ({ ...prev, [step.key]: trimmed || prev[step.key] }));
        
        if (step.next === 'edit-bio-avatar') {
          setInputMode('edit-bio-avatar');
          appendHistory({ id: makeId('system'), kind: 'system', text: step.prompt });
        } else {
          setInputMode(step.next);
          appendHistory({ id: makeId('system'), kind: 'system', text: step.prompt });
        }
      } else if (inputMode === 'edit-bio-avatar') {
        if (trimmed === '') {
          // Trigger file input
          const fileInput = document.getElementById('profile-upload-input');
          if (fileInput) fileInput.click();
        } else {
          // Fallback if they type a URL instead
          const finalData = { ...newProfileData, avatar_url: trimmed };
          setIsBusy(true);
          const spinnerId = makeId('sync');
          appendHistory({ id: spinnerId, kind: 'sync_spinner' });
          
          import('../../lib/supabase').then(async ({ supabase }) => {
            const { error } = await supabase.from('profile').update(finalData).eq('id', 1);
            if (error) {
              updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPDATE FAILED: ' + error.message }));
            } else {
              updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ PROFILE UPDATED. Syncing...' }));
              window.dispatchEvent(new CustomEvent('profile-sync-pulse'));
            }
            setIsBusy(false);
            setInputMode('normal');
          });
        }
      }
      return;
    }

    if (inputMode.startsWith('add-project-')) {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      
      const nextStep = {
        'add-project-title': { next: 'add-project-desc', key: 'title', prompt: 'ENTER DESCRIPTION:' },
        'add-project-desc': { next: 'add-project-stack', key: 'description', prompt: 'ENTER STACK (comma separated):' },
        'add-project-stack': { next: 'add-project-status', key: 'stack', prompt: 'ENTER STATUS (ACTIVE/SHIPPED/ARCHIVED):' },
        'add-project-status': { next: 'add-project-github', key: 'status', prompt: 'ENTER GITHUB URL (or #):' },
        'add-project-github': { next: 'add-project-demo', key: 'github', prompt: 'ENTER DEMO URL (or #):' },
        'add-project-demo': { next: 'done', key: 'demo' }
      };

      const step = nextStep[inputMode];
      
      let val = trimmed;
      if (inputMode === 'add-project-stack') {
        val = trimmed.split(',').map(s => s.trim());
      } else if (inputMode === 'add-project-status') {
        val = trimmed.toUpperCase();
      }

      setNewProjectData(prev => ({ ...prev, [step.key]: val }));

      if (step.next === 'done') {
        setInputMode('normal');
        setIsBusy(true);
        const spinnerId = makeId('sync');
        appendHistory({ id: spinnerId, kind: 'sync_spinner' });

        import('../../lib/supabase').then(async ({ supabase }) => {
          const finalData = { ...newProjectData, [step.key]: val };
          const { error } = await supabase.from('projects').insert([finalData]);
          
          if (error) {
            updateHistory(spinnerId, (entry) => ({
              ...entry,
              kind: 'error',
              text: '> INSERT FAILED: ' + error.message
            }));
          } else {
            updateHistory(spinnerId, (entry) => ({
              ...entry,
              kind: 'success',
              text: '> ✓ PROJECT ADDED. Syncing archives...'
            }));
            window.dispatchEvent(new CustomEvent('github-sync-pulse'));
          }
          setIsBusy(false);
        });
      } else {
        setInputMode(step.next);
        appendHistory({ id: makeId('system'), kind: 'system', text: step.prompt });
      }
      return;
    }

    if (inputMode.startsWith('add-skill-')) {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      
      const nextStep = {
        'add-skill-category': { next: 'add-skill-name', key: 'category', prompt: 'ENTER SKILL NAME:' },
        'add-skill-name': { next: 'add-skill-level', key: 'name', prompt: 'ENTER MASTERY LEVEL (0-100):' },
        'add-skill-level': { next: 'done', key: 'level' }
      };

      const step = nextStep[inputMode];
      
      let val = trimmed;
      if (inputMode === 'add-skill-level') val = parseInt(trimmed) || 0;

      setNewSkillData(prev => ({ ...prev, [step.key]: val }));

      if (step.next === 'done') {
        setInputMode('normal');
        setIsBusy(true);
        const spinnerId = makeId('sync');
        appendHistory({ id: spinnerId, kind: 'sync_spinner' });

        import('../../lib/supabase').then(async ({ supabase }) => {
          const finalData = { ...newSkillData, [step.key]: val };
          const { error } = await supabase.from('skills').insert([finalData]);
          
          if (error) {
            updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> INSERT FAILED: ' + error.message }));
          } else {
            updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ SKILL ADDED. Syncing matrix...' }));
            window.dispatchEvent(new CustomEvent('skill-sync-pulse'));
          }
          setIsBusy(false);
        });
      } else {
        setInputMode(step.next);
        appendHistory({ id: makeId('system'), kind: 'system', text: step.prompt });
      }
      return;
    }

    if (inputMode.startsWith('add-activity-')) {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      
      const nextStep = {
        'add-activity-year': { next: 'add-activity-title', key: 'year', prompt: 'ENTER TITLE:' },
        'add-activity-title': { next: 'add-activity-desc', key: 'title', prompt: 'ENTER DESCRIPTION:' },
        'add-activity-desc': { next: 'add-activity-stack', key: 'description', prompt: 'ENTER STACK (comma separated):' },
        'add-activity-stack': { next: 'add-activity-side', key: 'stack', prompt: 'ENTER SIDE (left/right):' },
        'add-activity-side': { next: 'done', key: 'side' }
      };

      const step = nextStep[inputMode];
      
      let val = trimmed;
      if (inputMode === 'add-activity-stack') val = trimmed.split(',').map(s => s.trim());
      if (inputMode === 'add-activity-side') val = (trimmed.toLowerCase() === 'left') ? 'left' : 'right';

      setNewActivityData(prev => ({ ...prev, [step.key]: val }));

      if (step.next === 'done') {
        setInputMode('normal');
        setIsBusy(true);
        const spinnerId = makeId('sync');
        appendHistory({ id: spinnerId, kind: 'sync_spinner' });

        import('../../lib/supabase').then(async ({ supabase }) => {
          const finalData = { ...newActivityData, [step.key]: val };
          const { error } = await supabase.from('timeline').insert([finalData]);
          
          if (error) {
            updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> INSERT FAILED: ' + error.message }));
          } else {
            updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ ACTIVITY LOGGED. Syncing timeline...' }));
            window.dispatchEvent(new CustomEvent('timeline-sync-pulse'));
          }
          setIsBusy(false);
        });
      } else {
        setInputMode(step.next);
        appendHistory({ id: makeId('system'), kind: 'system', text: step.prompt });
      }
      return;
    }
    if (inputMode === 'remove-project-title') {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      setInputMode('normal');
      setIsBusy(true);

      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });

      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('projects').delete().ilike('title', trimmed.trim()).select();
        
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> DELETE FAILED: ' + error.message }));
        } else if (!data || data.length === 0) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> ERROR: PROJECT NOT FOUND.' }));
        } else {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ PROJECT REMOVED. Syncing archives...' }));
          window.dispatchEvent(new CustomEvent('github-sync-pulse'));
        }
        setIsBusy(false);
      });
      return;
    }

    if (inputMode === 'remove-skill-name') {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      setInputMode('normal');
      setIsBusy(true);

      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });

      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('skills').delete().ilike('name', trimmed.trim()).select();
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> DELETE FAILED: ' + error.message }));
        } else if (!data || data.length === 0) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> ERROR: SKILL NOT FOUND.' }));
        } else {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ SKILL REMOVED. Syncing matrix...' }));
          window.dispatchEvent(new CustomEvent('skill-sync-pulse'));
        }
        setIsBusy(false);
      });
      return;
    }

    if (inputMode === 'remove-activity-title') {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      setInputMode('normal');
      setIsBusy(true);

      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });

      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('timeline').delete().ilike('title', trimmed.trim()).select();
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> DELETE FAILED: ' + error.message }));
        } else if (!data || data.length === 0) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> ERROR: ACTIVITY NOT FOUND.' }));
        } else {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ ACTIVITY REMOVED. Syncing timeline...' }));
          window.dispatchEvent(new CustomEvent('timeline-sync-pulse'));
        }
        setIsBusy(false);
      });
      return;
    }

    if (inputMode === 'remove-category-name') {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      setInputMode('normal');
      setIsBusy(true);

      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });

      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('skills').delete().ilike('category', trimmed.trim()).select();
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> DELETE FAILED: ' + error.message }));
        } else if (!data || data.length === 0) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> ERROR: CATEGORY NOT FOUND.' }));
        } else {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ CATEGORY REMOVED. Syncing matrix...' }));
          window.dispatchEvent(new CustomEvent('skill-sync-pulse'));
        }
        setIsBusy(false);
      });
      return;
    }

    if (inputMode.startsWith('edit-skill-')) {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setInput('');
      
      const nextStep = {
        'edit-skill-name': { next: 'edit-skill-category', key: 'originalName', prompt: 'ENTER NEW CATEGORY (leave blank to keep current):' },
        'edit-skill-category': { next: 'edit-skill-level', key: 'category', prompt: 'ENTER NEW LEVEL (leave blank to keep current):' },
        'edit-skill-level': { next: 'done', key: 'level' }
      };

      const step = nextStep[inputMode];
      
      let val = trimmed;
      if (inputMode === 'edit-skill-level' && trimmed !== '') val = parseInt(trimmed) || 0;

      setNewSkillData(prev => ({ ...prev, [step.key]: val }));

      if (step.next === 'done') {
        setInputMode('normal');
        setIsBusy(true);
        const spinnerId = makeId('sync');
        appendHistory({ id: spinnerId, kind: 'sync_spinner' });

        import('../../lib/supabase').then(async ({ supabase }) => {
          const finalData = { ...newSkillData, [step.key]: val };
          
          const updatePayload = {};
          if (finalData.category) updatePayload.category = finalData.category;
          if (finalData.level !== undefined && finalData.level !== '') updatePayload.level = finalData.level;

          if (Object.keys(updatePayload).length === 0) {
            updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> NO CHANGES PROVIDED.' }));
            setIsBusy(false);
            return;
          }

          const { data, error } = await supabase.from('skills').update(updatePayload).ilike('name', finalData.originalName.trim()).select();
          
          if (error) {
            updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> UPDATE FAILED: ' + error.message }));
          } else if (!data || data.length === 0) {
            updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> ERROR: SKILL NOT FOUND.' }));
          } else {
            updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> ✓ SKILL UPDATED. Syncing matrix...' }));
            window.dispatchEvent(new CustomEvent('skill-sync-pulse'));
          }
          setIsBusy(false);
        });
      } else {
        setInputMode(step.next);
        appendHistory({ id: makeId('system'), kind: 'system', text: step.prompt });
      }
      return;
    }

    if (trimmed === 'clear') {
      clearTrackedTimers();
      setHistory([makeBootEntry()]);
      setInput('');
      setCommandHistory([trimmed]);
      setHistoryIndex(-1);
      setIsBusy(false);
      setMatrixActive(false);
      setGlitchFlash(false);
      return;
    }

    const commandEntry = { id: makeId('cmd'), kind: 'command', text: trimmed };
    appendHistory(commandEntry);
    setCommandHistory((prev) => [trimmed, ...prev]);
    setHistoryIndex(-1);
    setInput('');
    setIsBusy(true);

    if (trimmed === 'login') {
      const handshakeLines = [
        '> INITIATING SECURE HANDSHAKE...',
        '> [■■■■■■■■■■] 100%',
        '> ENCRYPTION: AES-256 ✓',
        '> CHANNEL: SECURE ✓'
      ];

      let delay = 0;
      handshakeLines.forEach((line, i) => {
        delay += 40;
        trackTimer(window.setTimeout(() => {
          appendHistory({ id: makeId('system'), kind: 'system', text: line, color: 'text-[#3A6A7A]' });
          if (i === handshakeLines.length - 1) {
            trackTimer(window.setTimeout(() => {
              appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER EMAIL:' });
              setInputMode('email');
              setIsBusy(false);
            }, 100));
          }
        }, delay));
      });
      return;
    }
    
    if (trimmed === 'logout') {
      if (isAdmin) {
        appendHistory({ id: makeId('system'), kind: 'system', text: '> TERMINATING SESSION...' });
        setAdminBadgeVisible(false);
        trackTimer(window.setTimeout(() => {
          setIsAdmin(false);
          appendHistory({ id: makeId('system'), kind: 'system', text: '> ✓ SESSION CLOSED.' });
          
          import('../../lib/supabase').then(async ({ supabase }) => {
            await supabase.auth.signOut();
            setIsBusy(false);
          });
        }, 500));
      } else {
        appendHistory({ id: makeId('error'), kind: 'error', text: 'NOT LOGGED IN.' });
        setIsBusy(false);
      }
      return;
    }

    if (trimmed === 'add project') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      setNewProjectData({});
      setInputMode('add-project-title');
      appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER TITLE:' });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'remove project') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      setInputMode('remove-project-title');
      appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER EXACT PROJECT TITLE TO DELETE:' });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'add skill') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      setNewSkillData({});
      setInputMode('add-skill-category');
      appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER CATEGORY (e.g. AI / ML, Frontend, Backend):' });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'remove skill') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      setInputMode('remove-skill-name');
      appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER EXACT SKILL NAME TO DELETE:' });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'add activity') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      setNewActivityData({});
      setInputMode('add-activity-year');
      appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER YEAR (e.g. 2024–Present):' });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'remove activity') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      setInputMode('remove-activity-title');
      appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER EXACT ACTIVITY TITLE TO DELETE:' });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'list projects') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      
      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });
      
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('projects').select('title, status');
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> FAILED TO FETCH PROJECTS: ' + error.message }));
        } else {
          const listText = data.length > 0 
            ? '> ' + data.map(p => `[${p.status}] ${p.title}`).join('\n> ')
            : '> NO PROJECTS FOUND IN DATABASE.';
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: listText }));
        }
        setIsBusy(false);
      });
      return;
    }

    if (trimmed === 'list skills') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      
      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });
      
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('skills').select('name, category, level');
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> FAILED TO FETCH SKILLS: ' + error.message }));
        } else {
          const listText = data.length > 0 
            ? '> ' + data.map(s => `[${s.category}] ${s.name} (${s.level}%)`).join('\n> ')
            : '> NO SKILLS FOUND IN DATABASE.';
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: listText }));
        }
        setIsBusy(false);
      });
      return;
    }

    if (trimmed === 'list activity') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      
      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });
      
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('timeline').select('title, year');
        if (error) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> FAILED TO FETCH ACTIVITY: ' + error.message }));
        } else {
          const listText = data.length > 0 
            ? '> ' + data.map(a => `[${a.year}] ${a.title}`).join('\n> ')
            : '> NO ACTIVITY FOUND IN DATABASE.';
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: listText }));
        }
        setIsBusy(false);
      });
      return;
    }

    if (trimmed === 'edit skill') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      setNewSkillData({});
      setInputMode('edit-skill-name');
      appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER EXACT SKILL NAME TO EDIT:' });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'remove category') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      setInputMode('remove-category-name');
      appendHistory({ id: makeId('system'), kind: 'system', text: 'ENTER EXACT CATEGORY NAME TO DELETE ALL SKILLS IN IT:' });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'edit bio') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('profile').select('*').eq('id', 1).single();
        if (error || !data) {
          appendHistory({ id: makeId('error'), kind: 'error', text: '> FAILED TO FETCH CURRENT PROFILE.' });
          setIsBusy(false);
        } else {
          setNewProfileData(data);
          setInputMode('edit-bio-first_name');
          appendHistory({ id: makeId('system'), kind: 'system', text: `ENTER FIRST NAME [${data.first_name}]:` });
          setIsBusy(false);
        }
      });
      return;
    }

    if (trimmed === 'edit hero') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('profile').select('*').eq('id', 1).single();
        if (error || !data) {
          appendHistory({ id: makeId('error'), kind: 'error', text: '> FAILED TO FETCH CURRENT PROFILE.' });
          setIsBusy(false);
        } else {
          setNewProfileData(data);
          setInputMode('edit-hero-hero_subtitle');
          appendHistory({ id: makeId('system'), kind: 'system', text: `ENTER SUBTITLE (comma separated) [${data.hero_subtitle || 'AI, ML'}]:` });
          setIsBusy(false);
        }
      });
      return;
    }

    if (trimmed === 'edit typewriter') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('profile').select('*').eq('id', 1).single();
        if (error || !data) {
          appendHistory({ id: makeId('error'), kind: 'error', text: '> FAILED TO FETCH CURRENT PROFILE.' });
          setIsBusy(false);
        } else {
          setNewProfileData(data);
          setInputMode('edit-typewriter-hero_roles');
          appendHistory({ id: makeId('system'), kind: 'system', text: `ENTER ROLES (comma separated) [${data.hero_roles || 'BUILDING ASTRA AI'}]:` });
          setIsBusy(false);
        }
      });
      return;
    }

    if (trimmed === 'edit cv') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      appendHistory({ id: makeId('system'), kind: 'system', text: '> PLEASE SELECT A PDF FILE...' });
      const fileInput = document.getElementById('cv-upload-input');
      if (fileInput) fileInput.click();
      return;
    }

    if (trimmed === 'download cv') {
      appendHistory({ id: makeId('cmd'), kind: 'command', text: trimmed });
      setIsBusy(true);
      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });
      
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('profile').select('cv_url').eq('id', 1).single();
        if (error || !data || !data.cv_url) {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'error', text: '> NO CV FOUND IN DATABASE.' }));
        } else {
          updateHistory(spinnerId, (entry) => ({ ...entry, kind: 'success', text: '> INITIATING DOWNLOAD...' }));
          
          // Force download for PDF
          const response = await fetch(data.cv_url);
          const blob = await response.blob();
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = 'CV.pdf';
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(downloadUrl);
        }
        setIsBusy(false);
      });
      return;
    }

    if (['edit project'].includes(trimmed)) {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      appendHistory({ id: makeId('system'), kind: 'system', text: '> WRITING TO DATABASE...' });
      trackTimer(window.setTimeout(() => {
        appendHistory({ id: makeId('system'), kind: 'success', text: '> ✓ SAVED. Changes are live.' });
        setIsBusy(false);
      }, 800));
      return;
    }

    if (trimmed === 'update email' || trimmed === 'update github' || trimmed === 'update linkedin') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      
      const field = trimmed.split(' ')[1]; // email, github, or linkedin
      const dbField = field === 'email' ? 'email' : `${field}_url`;
      
      import('../../lib/supabase').then(async ({ supabase }) => {
        const { data, error } = await supabase.from('profile').select(dbField).eq('id', 1).single();
        if (error || !data) {
          appendHistory({ id: makeId('error'), kind: 'error', text: '> FAILED TO FETCH CURRENT PROFILE.' });
          setIsBusy(false);
        } else {
          setNewProfileData({ [dbField]: data[dbField] });
          setInputMode(`update-${field}`);
          appendHistory({ id: makeId('system'), kind: 'system', text: `ENTER NEW ${field.toUpperCase()} [${data[dbField] || ''}]:` });
          setIsBusy(false);
        }
      });
      return;
    }

    if (trimmed === 'sync github') {
      if (!isAdmin) {
        appendHistory({ id: makeId('error'), kind: 'error', text: '> ACCESS DENIED. ADMIN ONLY.' });
        setIsBusy(false);
        return;
      }
      const spinnerId = makeId('sync');
      appendHistory({ id: spinnerId, kind: 'sync_spinner' });
      
      trackTimer(window.setTimeout(() => {
        updateHistory(spinnerId, (entry) => ({
          ...entry,
          kind: 'success',
          text: '> ✓ 3 REPOS REFRESHED. Cache cleared.'
        }));
        window.dispatchEvent(new CustomEvent('github-sync-pulse'));
        setIsBusy(false);
      }, 1200));
      return;
    }

    if (trimmed === 'socials' || trimmed === 'contact') {
      appendHistory({ id: makeId('linkedin'), kind: 'linkedin' });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'super' || trimmed === 'secrets') {
      appendHistory({
        id: makeId('system'),
        kind: 'system',
        text: `CLASSIFIED COMMANDS DIRECTORY:
- play / rocket  : Launch ROCKET_RAID.EXE
- manifesto      : Print personal manifesto
- matrix         : Initiate system breach
- sudo hack      : Try to bypass security
- whoami --deep  : Perform deep identity scan
- sl             : 🚂
- konami         : Enter cheat code
- tweak <module> : Modules: neon, glitch, bass, coffee, gravity, empathy`
      });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'manifesto' || trimmed === 'about' || trimmed === 'bio') {
      appendHistory({
        id: makeId('system'),
        kind: 'success',
        text: `"Too blessed to be stressed that's my manifesto"`
      });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'matrix') {
      const now = Date.now();
      if (now - matrixLastTriggered.current < 5000) {
        appendHistory({ id: makeId('cmd'), kind: 'error', text: 'SYSTEM COOLING DOWN...' });
        setIsBusy(false);
        return;
      }
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        appendHistory({ id: makeId('cmd'), kind: 'output', text: 'INITIATING SYSTEM BREACH...' });
        trackTimer(
          window.setTimeout(() => {
            appendHistory({ id: makeId('cmd'), kind: 'output', text: 'BREACH CONTAINED. SYSTEM RESTORED.' });
            setIsBusy(false);
          }, 1500)
        );
        return;
      }

      matrixLastTriggered.current = now;
      appendHistory({ id: makeId('cmd'), kind: 'output', text: 'INITIATING SYSTEM BREACH...' });
      
      document.body.classList.add('matrix-breach-active');
      setMatrixActive(true);
      
      trackTimer(
        window.setTimeout(() => {
          document.body.classList.remove('matrix-breach-active');
          setMatrixActive('exiting');
          
          trackTimer(
            window.setTimeout(() => {
              setMatrixActive(false);
              appendHistory({ id: makeId('cmd'), kind: 'output', text: 'BREACH CONTAINED. SYSTEM RESTORED.' });
              setIsBusy(false);
            }, 500)
          );
        }, 3500)
      );
      return;
    }

    if (trimmed === 'sudo hack') {
      const progressId = makeId('progress');
      appendHistory({ id: progressId, kind: 'progress', text: progressBar(0) });

      const start = performance.now();
      const interval = trackTimer(
        window.setInterval(() => {
          const elapsed = performance.now() - start;
          const nextPercent = Math.min((elapsed / 2000) * 100, 100);
          updateHistory(progressId, (entry) => ({
            ...entry,
            text: progressBar(nextPercent),
          }));

          if (nextPercent >= 100) {
            window.clearInterval(interval);
            timersRef.current = timersRef.current.filter((timer) => timer !== interval);
            trackTimer(
              window.setTimeout(() => {
                appendHistory({
                  id: makeId('error'),
                  kind: 'error',
                  text: 'ACCESS DENIED. NICE TRY.',
                  shake: true,
                  glitch: true,
                });
                setIsBusy(false);
              }, 180)
            );
          }
        }, 80)
      );
      return;
    }

    if (trimmed === 'whoami --deep') {
      const scanId = makeId('scan');
      let dots = 0;
      appendHistory({ id: scanId, kind: 'scan', text: 'Scanning' });

      const interval = trackTimer(
        window.setInterval(() => {
          dots = (dots + 1) % 4;
          updateHistory(scanId, (entry) => ({
            ...entry,
            text: `Scanning${'.'.repeat(dots)}`,
          }));
        }, 320)
      );

      trackTimer(
        window.setTimeout(() => {
          window.clearInterval(interval);
          timersRef.current = timersRef.current.filter((timer) => timer !== interval);
          updateHistory(scanId, (entry) => ({
            ...entry,
            kind: 'success',
            text: 'IDENTITY CONFIRMED: ARCHITECT OF THINGS THAT SHOULDN\'T EXIST.',
          }));
          setIsBusy(false);
        }, 2200)
      );
      return;
    }

    if (trimmed === 'sl') {
      appendHistory({
        id: makeId('train'),
        kind: 'train',
      });

      trackTimer(
        window.setTimeout(() => {
          setIsBusy(false);
        }, 2800)
      );
      return;
    }

    if (trimmed === 'konami') {
      setGlitchFlash(true);
      trackTimer(
        window.setTimeout(() => {
          setGlitchFlash(false);
          appendHistory({
            id: makeId('error'),
            kind: 'error',
            text: "CHEAT MODE: DENIED. THIS ISN'T A GAME.",
            shake: true,
            glitch: true,
          });
          setIsBusy(false);
        }, 500)
      );
      return;
    }

    if (trimmed.startsWith('tweak')) {
      const tweakKey = trimmed.replace('tweak', '').trim().toLowerCase();
      if (!tweakKey) {
        appendHistory({
          id: makeId('error'),
          kind: 'error',
          text: 'TWEAK MODE REQUIRES A TARGET. TRY: neon, glitch, bass, coffee, gravity, empathy.',
        });
        setIsBusy(false);
        return;
      }

      const tweak = TWEAK_RESPONSES[tweakKey];
      if (tweak) {
        appendHistory({
          id: makeId(tweak.kind),
          kind: tweak.kind,
          text: tweak.text,
          effect: tweak.effect,
          shake: tweak.kind === 'error',
          glitch: tweak.kind === 'error',
        });
        
        if (tweak.effect === 'gravity') {
          document.body.classList.add('gravity-fall-active');
          window.setTimeout(() => {
            document.body.classList.remove('gravity-fall-active');
          }, 4000);
        }
      } else {
        appendHistory({
          id: makeId('error'),
          kind: 'error',
          text: `TWEAK "${tweakKey}" IS NOT INSTALLED. TRY: neon, glitch, bass, coffee, gravity, empathy.`,
        });
      }
      setIsBusy(false);
      return;
    }

    if (COMMAND_RESPONSES[trimmed]) {
      appendHistory({
        id: makeId('output'),
        kind: 'system',
        text: COMMAND_RESPONSES[trimmed],
      });
      setIsBusy(false);
      return;
    }

    if (trimmed.startsWith('cat ')) {
      appendHistory({
        id: makeId('error'),
        kind: 'error',
        text: `cat: ${trimmed.replace('cat ', '').trim()}: No such file or directory`,
      });
      setIsBusy(false);
      return;
    }

    if (trimmed === 'play' || trimmed === 'rocket' || trimmed === './rocket.exe') {
      appendHistory({
        id: makeId('system'),
        kind: 'system',
        text: 'INITIALIZING ROCKET_RAID.EXE...',
      });
      trackTimer(
        window.setTimeout(() => {
          setIsBusy(false);
          onClose();
          setTimeout(() => {
            if (onLaunchGame) onLaunchGame();
          }, 300);
        }, 800)
      );
      return;
    }

    appendHistory({
      id: makeId('error'),
      kind: 'error',
      text: `command not found: ${trimmed}`,
    });
    setIsBusy(false);
  };

  const handleKeyDown = (e) => {
    if (isBusy) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Escape') {
      if (inputMode !== 'normal') {
        appendHistory({ id: makeId('system'), kind: 'system', text: '> COMMAND ABORTED.' });
        setInputMode('normal');
        setInput('');
        setIsBusy(false);
      }
      return;
    }

    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        setInput(commandHistory[prevIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] pointer-events-auto">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

      <div
        ref={windowRef}
        className={`terminal-shell terminal-window absolute w-[min(92vw,760px)] max-w-[760px] p-[1px] ${glitchFlash ? 'terminal-glitch-flash' : ''} ${ready ? 'opacity-100' : 'opacity-0'} ${isAdmin ? 'terminal-admin-mode' : ''} ${inputMode === 'password' && input.length > 0 ? 'input-active' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: dragging ? 'none' : 'opacity 180ms ease, transform 220ms ease',
          transform: dragging ? 'scale(1.01)' : 'scale(1)',
          background: 'linear-gradient(135deg, rgba(0,255,255,0.74), rgba(255,45,120,0.66))',
          clipPath: 'polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)',
        }}
      >
        <div className="terminal-frame relative w-full overflow-hidden bg-[#03080e] shadow-[0_0_34px_rgba(0,255,255,0.14)]">
          <div className="terminal-scanline absolute inset-0 pointer-events-none z-10 opacity-30" />

          <div
            className="flex items-center justify-between gap-3 px-4 py-2 border-b border-neon-cyan/20 bg-[#050c14]/95 relative z-20 cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
          >
            <div className="flex items-center gap-3">
              <div className="flex space-x-2 group">
                <div className="w-3 h-3 rounded-full bg-text-dim/40 transition-colors group-hover:bg-neon-pink" />
                <div className="w-3 h-3 rounded-full bg-text-dim/40 transition-colors group-hover:bg-[#FFB000]" />
                <div className="w-3 h-3 rounded-full bg-text-dim/40 transition-colors group-hover:bg-[#00FF88]" />
              </div>
              <div className="font-orbitron text-[11px] uppercase tracking-widest text-text-dim ml-2 hidden sm:block">
                root@unknown03x:~
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="font-jetbrains text-[10px] md:text-xs text-text-dim flex items-center gap-2">
                <span className="terminal-connection-dot w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_#00FFFF]" />
                CONNECTION: SECURE
              </div>
              {adminBadgeVisible && (
                <div className="font-jetbrains text-[10px] md:text-xs text-[#00FF88] flex items-center gap-2 border border-[#00FF88]/40 px-2 rounded-sm shadow-[0_0_8px_rgba(0,255,136,0.3)] bg-[#00FF88]/10">
                  ◈ ADMIN
                </div>
              )}

              <button
                type="button"
                className="clickable rounded-full border border-neon-pink/30 bg-[#050c14] px-3 py-1 font-jetbrains text-[10px] uppercase tracking-[0.22em] text-neon-pink transition-all duration-300 hover:border-neon-pink hover:text-white hover:shadow-[0_0_16px_rgba(255,45,120,0.2)]"
                onClick={onClose}
              >
                close
              </button>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="relative max-h-[68vh] overflow-y-auto p-4 font-jetbrains text-sm md:text-[15px] leading-relaxed z-20 scrollbar-hide"
          >
            {matrixActive && <GlobalMatrixOverlay isExiting={matrixActive === 'exiting'} />}

            <div className="relative z-20 space-y-3">
              {history.map((item) => (
                <div key={item.id}>{renderEntry(item)}</div>
              ))}

              {!isBusy && (
                <div className="flex items-center gap-1 font-jetbrains text-[13px] md:text-sm tracking-[0.12em] uppercase">
                  <span className="text-neon-pink drop-shadow-[0_0_2px_#FF2D78]">guest</span>
                  <span className="text-text-dim">@unknown03x</span>
                  <span className="text-neon-cyan drop-shadow-[0_0_2px_#00FFFF]">:~$</span>
                  <input
                    ref={inputRef}
                    type={inputMode === 'password' ? 'password' : 'text'}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      if (inputMode === 'password') {
                        import('../../utils/audio').then(({ playSFX }) => playSFX('keystroke'));
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-text-primary font-jetbrains tracking-[0.08em] focus:ring-0 p-0 m-0 caret-[#00FFFF]"
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <span className="terminal-block-cursor shrink-0" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <input type="file" id="profile-upload-input" accept="image/*" className="hidden" onChange={handleProfileUpload} />
      <input type="file" id="cv-upload-input" accept=".pdf" className="hidden" onChange={handleCVUpload} />
    </div>
  );
}

function TerminalDock({ onOpen }) {
  return (
    <div className="relative rounded-3xl border border-neon-cyan/15 bg-[linear-gradient(180deg,rgba(5,12,20,0.92),rgba(1,3,8,0.98))] p-6 shadow-[0_0_0_1px_rgba(0,255,255,0.05),0_18px_60px_rgba(0,0,0,0.42)]">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.10),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(255,45,120,0.07),transparent_26%)]" />
      <div className="relative z-10 space-y-4">
        <div className="font-orbitron text-xl uppercase tracking-cyber text-neon-cyan terminal-chromatic">
          console link
        </div>
        <div className="space-y-2 font-jetbrains text-[11px] md:text-xs uppercase tracking-[0.22em] text-text-dim">
          <p>overlay terminal enabled</p>
          <p>drag window / close or relaunch anytime</p>
          <p>tweak commands installed</p>
        </div>

        <button
          type="button"
          className="clickable cyber-navbar-terminal-btn relative inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-[#050c14] px-4 py-2 font-jetbrains text-[11px] uppercase tracking-[0.22em] text-neon-cyan transition-all duration-300 hover:border-neon-cyan hover:text-white hover:shadow-[0_0_18px_rgba(0,255,255,0.16)]"
          onClick={onOpen}
        >
          launch console
        </button>
      </div>
    </div>
  );
}

function ProfileCard() {
  const containerRef = useRef(null);
  const cardInnerRef = useRef(null);
  const hexRingRef = useRef(null);
  const avatarSweepRef = useRef(null);
  const nameRef1 = useRef(null);
  const nameRef2 = useRef(null);
  const [avatarReady, setAvatarReady] = useState(false);
  const [profileData, setProfileData] = useState({
    first_name: 'SOORAJ',
    last_name: 'CHAKRAVARTHY S',
    university: 'M S RAMAIAH UNIVERSITY OF APPLIED SCIENCES',
    degree: 'B.TECH AI & ML | 2025 - PRESENT',
    avatar_url: '/profile.png',
    status: 'ONLINE'
  });

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase.from('profile').select('*').eq('id', 1).single();
      if (!error && data) {
        setProfileData(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchProfile();
    const handleSync = () => fetchProfile();
    window.addEventListener('profile-sync-pulse', handleSync);
    return () => window.removeEventListener('profile-sync-pulse', handleSync);
  }, []);

  const decodeText = (element, originalText) => {
    if (!element) return;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let iteration = 0;
    const interval = setInterval(() => {
      element.innerText = originalText.split("").map((letter, index) => {
        if (index < iteration) {
          return originalText[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join("");
      if (iteration >= originalText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 30);
    return interval;
  };

  useEffect(() => {
    if (avatarReady) {
      const int1 = decodeText(nameRef1.current, profileData.first_name);
      const int2 = decodeText(nameRef2.current, profileData.last_name);
      return () => {
        clearInterval(int1);
        clearInterval(int2);
      };
    }
  }, [profileData.first_name, profileData.last_name, avatarReady]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAvatarReady(true);
      return undefined;
    }

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        setAvatarReady(true);
        
        const tl = gsap.timeline();
        
        // Card entrance
        tl.fromTo(containerRef.current, 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        // Hexagon glow
        tl.fromTo(hexRingRef.current,
          { filter: 'brightness(0.3)' },
          { filter: 'brightness(1)', duration: 0.8, ease: 'power2.out' },
          "-=0.4"
        );

        // Scanline
        if (avatarSweepRef.current) {
          tl.fromTo(
            avatarSweepRef.current,
            { yPercent: -120, opacity: 0.6 },
            { yPercent: 120, opacity: 0, duration: 1.5, ease: 'power2.out' },
            "-=0.6"
          );
        }
      },
    });

    return () => st.kill();
  }, []);

  const handleHexHover = () => {
    if (avatarSweepRef.current) {
      gsap.fromTo(
        avatarSweepRef.current,
        { yPercent: -120, opacity: 0.5 },
        { yPercent: 120, opacity: 0, duration: 1.2, ease: 'power2.out', overwrite: true }
      );
    }
  };

  return (
    <div ref={containerRef} className="group relative w-full max-w-[380px] mx-auto p-[1px] rounded-sm transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] animate-border-gradient opacity-0">
      <div ref={cardInnerRef} className="profile-id-card relative w-full h-auto overflow-hidden bg-[#03080e] p-8 md:p-9">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.14),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(255,45,120,0.08),_transparent_28%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4 text-center">
          <div className="w-full flex flex-col items-center gap-3 pt-1">
            <div className="relative hex-breathing-ring group/hex">
              <div 
                ref={hexRingRef}
                onMouseEnter={handleHexHover}
                className="profile-id-avatar-ring relative flex h-36 w-36 items-center justify-center hex-clip bg-neon-cyan/40 p-[3px] md:h-40 md:w-40 group-hover/hex:brightness-125 transition-all duration-300 cursor-crosshair"
              >
                <div className="profile-id-avatar hex-clip relative flex h-full w-full items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 z-10 bg-neon-cyan/20 mix-blend-soft-light pointer-events-none" />
                  <img src={profileData.avatar_url || '/profile.png'} alt={`${profileData.first_name} ${profileData.last_name}`} onError={(e) => { e.target.onerror = null; e.target.src = '/profile.png'; }} className={`h-full w-full object-cover object-top transition-opacity duration-700 profile-glitch-fx filter brightness-105 contrast-110 saturate-50 ${avatarReady ? 'opacity-100' : 'opacity-0'}`}/>
                  <div
                    ref={avatarSweepRef}
                    className={`absolute inset-0 z-20 bg-[linear-gradient(to_bottom,transparent,rgba(0,255,255,0.4),transparent)] pointer-events-none ${avatarReady ? 'profile-id-sweep' : 'opacity-0'}`}
                  />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 z-30 text-neon-cyan font-jetbrains text-xs tracking-[0.2em] bg-[#001f1f]/80 backdrop-blur-sm px-2 py-0.5 border border-neon-cyan/40 rounded-sm">
                [ {profileData.status} ]
              </div>
            </div>

            <div className="space-y-1.5 mt-2">
              <h3 className="profile-id-gradient-text font-orbitron font-bold uppercase tracking-[0.14em] leading-[0.95] text-[clamp(1rem,3vw,1.2rem)]">
                <span ref={nameRef1} className="block whitespace-nowrap">{profileData.first_name}</span>
                <span ref={nameRef2} className="block whitespace-nowrap">{profileData.last_name}</span>
              </h3>
              <div className="font-jetbrains text-[10px] md:text-[11px] uppercase tracking-[0.26em] text-text-dim leading-relaxed max-w-[28ch] mx-auto">
                {profileData.university}
              </div>
            </div>
          </div>

          <div className="w-full pt-1 pb-1">
            <div className="profile-id-badge mx-auto inline-flex max-w-full items-center justify-center rounded-full border border-neon-pink/25 bg-[#050c14]/80 px-6 py-2.5 font-jetbrains text-[8.5px] md:text-[9.5px] uppercase text-neon-pink leading-snug">
              [ {profileData.degree} ]
            </div>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(1,3,8,0.7)] z-20" />
      </div>
    </div>
  );
}

export default function About({ terminalOpen, onOpenTerminal, onCloseTerminal, onLaunchGame, systemMessage, clearSystemMessage }) {
  const ref = useScrollReveal({ y: 30 });

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 bg-void overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="flex items-center gap-4 mb-12">
          <h2 className="terminal-chromatic font-orbitron text-xl sm:text-3xl md:text-4xl font-bold uppercase tracking-cyber neon-text-cyan break-all sm:break-normal">
            CLASSIFIED_INTEL
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-neon-cyan/50 to-transparent" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="w-full">
            <TerminalDock onOpen={onOpenTerminal} />
          </div>

          <div className="w-full flex justify-center mt-4 lg:mt-0">
            <ProfileCard />
          </div>
        </div>
      </div>

      <TerminalWindow 
        isOpen={terminalOpen} 
        onClose={onCloseTerminal} 
        onLaunchGame={onLaunchGame} 
        systemMessage={systemMessage}
        clearSystemMessage={clearSystemMessage}
      />
    </section>
  );
}
