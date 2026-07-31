import { Suspense, lazy, useEffect, useState, useRef } from 'react';
import Navbar from './components/ui/Navbar';
import CustomCursor from './components/ui/CustomCursor';
import LoadingScreen from './components/ui/LoadingScreen';
import Hero from './components/hero/Hero';
import RocketRaidGame from './components/ui/RocketRaidGame';

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
  const [systemMessage, setSystemMessage] = useState(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [currentTrack, setCurrentTrack] = useState('/music1.mp3');

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
      audioRef.current.volume = 0.15;
      setTimeout(() => {
        if (audioRef.current && !gameActive) {
          audioRef.current.volume = 0.35;
        }
      }, 1000);
    };
    window.addEventListener('duck-audio', handleDuck);
    return () => window.removeEventListener('duck-audio', handleDuck);
  }, [gameActive]);

  // Prevent hydration mismatch issues on load
  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-void text-text-primary selection:bg-neon-cyan/30">
      <audio ref={audioRef} src={currentTrack} loop preload="auto" />
      <CustomCursor />
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
    </div>
  );
}
