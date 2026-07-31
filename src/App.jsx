import { Suspense, lazy, useEffect, useState } from 'react';
import Navbar from './components/ui/Navbar';
import CustomCursor from './components/ui/CustomCursor';
import LoadingScreen from './components/ui/LoadingScreen';
import Hero from './components/hero/Hero';

// Lazy load below-fold sections
const Skills = lazy(() => import('./components/sections/Skills'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Timeline = lazy(() => import('./components/sections/Timeline'));
const About = lazy(() => import('./components/sections/About'));
const Contact = lazy(() => import('./components/sections/Contact'));
const Footer = lazy(() => import('./components/sections/Footer'));

export default function App() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  // Prevent hydration mismatch issues on load
  useEffect(() => {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-void text-text-primary selection:bg-neon-cyan/30">
      <CustomCursor />
      <Navbar terminalOpen={terminalOpen} onToggleTerminal={() => setTerminalOpen((prev) => !prev)} />
      
      <main className="relative z-10 w-full flex flex-col">
        <Hero />
        
        <Suspense fallback={<LoadingScreen />}>
          <About
            terminalOpen={terminalOpen}
            onOpenTerminal={() => setTerminalOpen(true)}
            onCloseTerminal={() => setTerminalOpen(false)}
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
    </div>
  );
}
