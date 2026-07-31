import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from '../../hooks/useScrollReveal';

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

function MatrixRainOverlay({ seed }) {
  const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+-<>/';
  const columns = Array.from({ length: 20 }, (_, columnIndex) => {
    const length = 11 + ((seed + columnIndex * 3) % 14);
    const delay = ((seed + columnIndex) % 10) * 0.12;
    const duration = 1.7 + ((seed + columnIndex) % 6) * 0.22;
    const glyphs = Array.from({ length }, (_, rowIndex) => {
      const charIndex = (seed + columnIndex * 11 + rowIndex * 7) % chars.length;
      return chars[charIndex];
    });

    return {
      id: columnIndex,
      delay,
      duration,
      glyphs,
    };
  });

  return (
    <div className="terminal-matrix-overlay absolute inset-0 z-30 overflow-hidden pointer-events-none">
      {columns.map((column) => (
        <div
          key={column.id}
          className="terminal-matrix-column"
          style={{
            left: `${(column.id / columns.length) * 100}%`,
            animationDuration: `${column.duration}s`,
            animationDelay: `${column.delay}s`,
          }}
        >
          {column.glyphs.map((glyph, glyphIndex) => (
            <span
              key={`${column.id}-${glyphIndex}`}
              className="terminal-matrix-char"
              style={{
                opacity: 0.08 + ((glyphIndex + column.id) % 6) * 0.05,
              }}
            >
              {glyph}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function TerminalWindow({ isOpen, onClose }) {
  const [history, setHistory] = useState([makeBootEntry()]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isBusy, setIsBusy] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [matrixSeed, setMatrixSeed] = useState(0);
  const [glitchFlash, setGlitchFlash] = useState(false);
  const [position, setPosition] = useState(getInitialPosition);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const windowRef = useRef(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const timersRef = useRef([]);

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

    if (item.kind === 'error') {
      return (
        <div className={`terminal-error whitespace-pre-wrap pl-2 border-l-2 border-neon-pink/30 ${item.shake ? 'terminal-shake' : ''} ${item.glitch ? 'glitch-anim' : ''}`}>
          {item.text}
        </div>
      );
    }

    return (
      <div className="terminal-system whitespace-pre-wrap pl-2 border-l-2 border-neon-cyan/30">
        {item.text}
      </div>
    );
  };

  const handleCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

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

    if (trimmed === 'matrix') {
      setMatrixSeed((prev) => prev + 1);
      setMatrixActive(true);
      trackTimer(
        window.setTimeout(() => {
          setMatrixActive(false);
          setIsBusy(false);
        }, 3000)
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
        className={`terminal-shell absolute w-[min(92vw,760px)] max-w-[760px] p-[1px] ${glitchFlash ? 'terminal-glitch-flash' : ''} ${ready ? 'opacity-100' : 'opacity-0'}`}
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
                <div className="w-3 h-3 rounded-full bg-neon-pink shadow-[0_0_8px_#FF2D78] transition-transform duration-200 hover:scale-125 hover:brightness-125 cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-neon-cyan shadow-[0_0_8px_#00FFFF] transition-transform duration-200 hover:scale-125 hover:brightness-125 cursor-pointer" />
                <div className="w-3 h-3 rounded-full bg-neon-purple shadow-[0_0_8px_#9D00FF] transition-transform duration-200 hover:scale-125 hover:brightness-125 cursor-pointer" />
              </div>
              <div className="font-jetbrains text-[10px] md:text-xs text-text-dim uppercase tracking-[0.24em]">
                UNKNOWN03X // movable console
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="font-jetbrains text-[10px] md:text-xs text-text-dim flex items-center gap-2">
                <span className="terminal-connection-dot w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_#00FFFF]" />
                CONNECTION: SECURE
              </div>

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
            {matrixActive && <MatrixRainOverlay seed={matrixSeed} />}

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
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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
  const avatarSweepRef = useRef(null);
  const [avatarReady, setAvatarReady] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAvatarReady(true);
      return undefined;
    }

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        setAvatarReady(true);
        if (avatarSweepRef.current) {
          gsap.fromTo(
            avatarSweepRef.current,
            { yPercent: -120, opacity: 0 },
            { yPercent: 120, opacity: 0, duration: 1.8, ease: 'power2.out' }
          );
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-[380px] mx-auto p-[1px]" style={{ background: 'linear-gradient(135deg, rgba(0,255,255,0.7), rgba(255,45,120,0.68))' }}>
      <div className="profile-id-card relative w-full min-h-[460px] overflow-hidden bg-[#03080e] p-8 md:p-9">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.14),_transparent_34%),radial-gradient(circle_at_bottom,_rgba(255,45,120,0.08),_transparent_28%)]" />
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex min-h-[inherit] flex-col items-center justify-between gap-6 text-center">
          <div className="w-full flex flex-col items-center gap-5 pt-1">
            <div className="relative">
              <div className="profile-id-avatar-ring relative flex h-32 w-32 items-center justify-center hex-clip bg-[#010308]/90 p-[3px] md:h-36 md:w-36">
                <div className="profile-id-avatar hex-clip relative flex h-full w-full items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 100 100" className={`h-16 w-16 text-neon-cyan ${avatarReady ? 'opacity-100' : 'opacity-70'}`} aria-hidden="true">
                    <path fill="currentColor" d="M50 11a18 18 0 1 0 0 36 18 18 0 0 0 0-36Zm0 42c-17.6 0-32 12.9-32 28.8V88h64v-6.2C82 65.9 67.6 53 50 53Z" />
                  </svg>
                  <div
                    ref={avatarSweepRef}
                    className={`absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.14),transparent)] ${avatarReady ? 'profile-id-sweep' : 'opacity-0'}`}
                  />
                </div>
              </div>
              <div className="absolute -top-2 -right-6 text-neon-cyan/80 font-jetbrains text-xs tracking-[0.3em]">
                [ ]
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="profile-id-gradient-text font-orbitron font-bold uppercase tracking-[0.14em] leading-[0.95] text-[clamp(1rem,3vw,1.2rem)]">
                <span className="block whitespace-nowrap">SOORAJ</span>
                <span className="block whitespace-nowrap">CHAKRAVARTHY S</span>
              </h3>
              <div className="font-jetbrains text-[10px] md:text-[11px] uppercase tracking-[0.26em] text-text-dim leading-relaxed max-w-[28ch] mx-auto">
                M S RAMAIAH UNIVERSITY OF APPLIED SCIENCES
              </div>
            </div>
          </div>

          <div className="w-full pt-1 pb-1">
            <div className="profile-id-badge mx-auto inline-flex max-w-full items-center justify-center rounded-full border border-neon-pink/25 bg-[#050c14]/80 px-5 py-2.5 font-jetbrains text-[9px] md:text-[10px] uppercase text-neon-pink leading-snug">
              [ B.TECH AI &amp; ML | 2025 - PRESENT ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About({ terminalOpen, onOpenTerminal, onCloseTerminal }) {
  const ref = useScrollReveal({ y: 30 });

  return (
    <section id="about" className="relative py-24 px-6 md:px-12 bg-void overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <div className="flex items-center gap-4 mb-12">
          <h2 className="terminal-chromatic font-orbitron text-3xl md:text-4xl font-bold uppercase tracking-cyber neon-text-cyan">
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

      <TerminalWindow isOpen={terminalOpen} onClose={onCloseTerminal} />
    </section>
  );
}
