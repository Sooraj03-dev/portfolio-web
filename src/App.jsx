import { Suspense, lazy, useEffect, useState, useRef } from 'react';
import Navbar from './components/ui/Navbar';
import CustomCursor from './components/ui/CustomCursor';
import LoadingScreen from './components/ui/LoadingScreen';
import Hero from './components/hero/Hero';
import SystemOverrideHUD from './components/ui/SystemOverrideHUD';
import RocketRaidGame from './components/ui/RocketRaidGame';
import DrawCanvas from './components/ui/DrawCanvas';
import { useFaviconPulse } from './hooks/useFaviconPulse';

// Lazy load below-fold sections
const Skills = lazy(() => import('./components/sections/Skills'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Timeline = lazy(() => import('./components/sections/Timeline'));
const About = lazy(() => import('./components/sections/About'));
const Contact = lazy(() => import('./components/sections/Contact'));
const Footer = lazy(() => import('./components/sections/Footer'));

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [systemOverride, setSystemOverride] = useState(false);
  const [systemMessage, setSystemMessage] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [currentTrack, setCurrentTrack] = useState('/music1.mp3');

  // Use the favicon pulse hook
  useFaviconPulse(isPlaying);

  useEffect(() => {
    const armAutoplay = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.volume = 0.35;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
        setHasInteracted(true);
      }
    };
    window.addEventListener('click', armAutoplay, { once: true });
    window.addEventListener('keydown', armAutoplay, { once: true });
    return () => {
      window.removeEventListener('click', armAutoplay);
      window.removeEventListener('keydown', armAutoplay);
    };
  }, [hasInteracted]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const nextTrack = () => {
    if (!audioRef.current) return;
    const isCurrentlyPlaying = !audioRef.current.paused;
    const newTrack = currentTrack === '/music1.mp3' ? '/music2.mp3' : '/music1.mp3';
    setCurrentTrack(newTrack);
    // After state update, play the new track if it was playing before
    setTimeout(() => {
      if (audioRef.current && isCurrentlyPlaying) {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }, 50);
  };

  // Audio ducking during gameplay
  useEffect(() => {
    if (audioRef.current) {
      let targetVolume = gameActive ? 0.1 : 0.35;
      let startVolume = audioRef.current.volume;
      let startTime = performance.now();
      
      const transition = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / 300, 1);
        if (audioRef.current) {
          audioRef.current.volume = startVolume + (targetVolume - startVolume) * progress;
        }
        if (progress < 1) {
          requestAnimationFrame(transition);
        }
      };
      requestAnimationFrame(transition);
    }
  }, [gameActive]);

  // Temporary ducking for SFX
  useEffect(() => {
    const handleDuck = () => {
      if (!audioRef.current || gameActive) return;
      
      const startVolume = audioRef.current.volume;
      const targetVolume = 0.1;
      let startTime = performance.now();
      
      const duckDown = (time) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / 100, 1);
        if (audioRef.current) {
          audioRef.current.volume = startVolume - (startVolume - targetVolume) * progress;
        }
        if (progress < 1) {
          requestAnimationFrame(duckDown);
        }
      };
      requestAnimationFrame(duckDown);
      
      setTimeout(() => {
        startTime = performance.now();
        const duckUp = (time) => {
          const elapsed = time - startTime;
          const progress = Math.min(elapsed / 500, 1);
          if (audioRef.current && !gameActive) {
            audioRef.current.volume = targetVolume + (startVolume - targetVolume) * progress;
          }
          if (progress < 1) {
            requestAnimationFrame(duckUp);
          }
        };
        requestAnimationFrame(duckUp);
      }, 1500); // Wait 1.5s then fade back up
    };
    
    window.addEventListener('sfx-duck', handleDuck);
    return () => window.removeEventListener('sfx-duck', handleDuck);
  }, [gameActive]);

  // Tab title easter egg
  useEffect(() => {
    const originalTitle = document.title || 'Sooraj | Portfolio';
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "⚠ COME BACK...";
      } else {
        document.title = originalTitle;
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Prevent hydration mismatch issues on load
  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }, []);

  return (
    <div className={`relative w-full min-h-screen bg-void text-text-primary selection:bg-neon-cyan/30 transition-all duration-300 ${systemOverride ? 'system-override' : ''}`}>
      <audio ref={audioRef} src={currentTrack} loop preload="auto" />
      <CustomCursor />
      <DrawCanvas />
      <Navbar 
        terminalOpen={terminalOpen} 
        onToggleTerminal={() => setTerminalOpen((prev) => !prev)} 
        isPlaying={isPlaying}
        toggleMute={toggleMute}
        onNextTrack={nextTrack}
      />
      
      <main className="relative z-10 w-full flex flex-col">
        <Hero />
        
        <Suspense fallback={<LoadingScreen />}>
          <About
            terminalOpen={terminalOpen}
            onOpenTerminal={() => setTerminalOpen(true)}
            onCloseTerminal={() => {
              setTerminalOpen(false);
              setSystemMessage(null);
            }}
            onLaunchGame={() => setGameActive(true)}
            onSystemOverride={() => setSystemOverride(true)}
            systemMessage={systemMessage}
            clearSystemMessage={() => setSystemMessage(null)}
          />
          <Skills />
          <Projects />
          <Timeline />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {gameActive && (
        <RocketRaidGame 
          onExit={(score) => {
            setGameActive(false);
            if (score !== undefined) {
              setSystemMessage(`> RUN COMPLETE. SCORE: ${score}`);
            }
            setTerminalOpen(true);
          }} 
        />
      )}

      {systemOverride && (
        <SystemOverrideHUD onRestore={() => setSystemOverride(false)} />
      )}
    </div>
  );
}
