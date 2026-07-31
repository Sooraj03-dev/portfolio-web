import { useEffect, useRef, useState } from 'react';

// Constants
const TARGET_FPS = 60;
const FRAME_MS = 1000 / TARGET_FPS;

export default function RocketRaidGame({ onExit }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  
  // Game State (useRef to avoid re-renders)
  const lastTimeRef = useRef(0);
  const keysRef = useRef({ up: false, down: false, left: false, right: false, space: false });
  const touchRef = useRef({ 
    active: false, startX: 0, startY: 0, currentX: 0, currentY: 0, firing: false 
  });
  
  const stateRef = useRef({
    width: 0,
    height: 0,
    player: { x: 0, y: 0, width: 24, height: 32, vx: 0, vy: 0, speed: 0.8, drag: 0.88, lives: 3, invulnTimer: 0, lastFire: 0 },
    projectiles: [],
    enemies: [],
    particles: [],
    stars: [],
    score: 0,
    timeElapsed: 0,
    lastEnemySpawn: 0,
    baseSpawnRate: 700, // ms
    gameOver: false,
    scoreSaved: false
  });

  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Audio setup (fire and forget)
  const playSound = (type) => {
    try {
      const audio = new Audio(`/sfx/${type}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore if audio fails or is missing
    }
  };

  const spawnExplosion = (x, y, color) => {
    const numParticles = 8 + Math.random() * 4;
    for (let i = 0; i < numParticles; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      stateRef.current.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0, // fades to 0
        color: color || (Math.random() > 0.5 ? '#00FFFF' : '#FF2D78'),
        size: 2 + Math.random() * 3
      });
    }
    playSound('explosion');
  };

  const spawnEnemy = (t) => {
    const { width, enemies, score } = stateRef.current;
    
    const rand = Math.random();
    let type = 'A';
    if (score > 200 && rand < 0.1) type = 'C';
    else if (rand < 0.4) type = 'B';
    
    let w = 24, h = 24, hp = 1, pts = 10;
    if (type === 'B') { w = 28; h = 28; hp = 2; pts = 25; }
    if (type === 'C') { w = 48; h = 32; hp = 5; pts = 75; }
    
    enemies.push({
      type,
      x: Math.random() * (width - w * 2) + w,
      y: -h,
      width: w,
      height: h,
      hp,
      scoreVal: pts,
      spawnTime: t,
      lastFire: t
    });
  };

  const spawnAsteroid = () => {
    const { width, enemies } = stateRef.current;
    enemies.push({
      type: 'ASTEROID',
      x: Math.random() * width,
      y: -40,
      width: 32,
      height: 32,
      hp: 2,
      scoreVal: 5,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 1 + Math.random() * 1.5,
      angle: 0,
      rotSpeed: (Math.random() - 0.5) * 0.1
    });
  };

  // Main Loop
  const gameLoop = (timestamp) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = Math.min(timestamp - lastTimeRef.current, 50); // Cap delta to prevent huge jumps
    lastTimeRef.current = timestamp;

    const s = stateRef.current;
    if (s.gameOver) {
      if (!isGameOver) {
        setFinalScore(s.score);
        setIsGameOver(true);
        playSound('gameover');
        
        let hs = parseInt(localStorage.getItem('rocketRaidHighScore') || '0', 10);
        if (s.score > hs) {
          hs = s.score;
          localStorage.setItem('rocketRaidHighScore', hs.toString());
        }
        setHighScore(hs);
      }
      return; // Stop updating/drawing if handled by React overlay
    }

    s.timeElapsed += delta;

    // UPDATE LOGIC
    // ----------------------------------------------------
    const { player, projectiles, enemies, particles, stars, width, height } = s;

    // --- Player Movement ---
    let ax = 0, ay = 0;
    if (keysRef.current.left) ax -= player.speed;
    if (keysRef.current.right) ax += player.speed;
    if (keysRef.current.up) ay -= player.speed;
    if (keysRef.current.down) ay += player.speed;

    // Mobile Virtual Joystick overriding
    if (touchRef.current.active) {
      const dx = touchRef.current.currentX - touchRef.current.startX;
      const dy = touchRef.current.currentY - touchRef.current.startY;
      const maxD = 40;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nx = dist > 0 ? dx / dist : 0;
      const ny = dist > 0 ? dy / dist : 0;
      const intensity = Math.min(dist / maxD, 1.0);
      ax = nx * player.speed * intensity;
      ay = ny * player.speed * intensity;
    }

    player.vx = (player.vx + ax * delta) * player.drag;
    player.vy = (player.vy + ay * delta) * player.drag;

    player.x += player.vx;
    player.y += player.vy;

    // Clamp to screen bounds
    player.x = Math.max(player.width/2, Math.min(width - player.width/2, player.x));
    player.y = Math.max(player.height/2, Math.min(height - player.height/2, player.y));

    if (player.invulnTimer > 0) player.invulnTimer -= delta;

    // --- Player Firing ---
    const isFiring = keysRef.current.space || touchRef.current.firing;
    if (isFiring && timestamp - player.lastFire > 90) {
      projectiles.push({ x: player.x, y: player.y - 10, width: 4, height: 12, speed: -16, type: 'player' });
      player.lastFire = timestamp;
      playSound('shoot');
    }

    // --- Starfield ---
    stars.forEach(star => {
      star.y += star.speed * 3.5 * (delta / 16);
      if (star.y > height) {
        star.y = 0;
        star.x = Math.random() * width;
      }
    });

    // --- Projectiles ---
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.y += p.speed * (delta / 16);
      if (p.y < -50 || p.y > height + 50) projectiles.splice(i, 1);
    }

    // --- Enemies ---
    // Spawn logic
    const currentSpawnRate = Math.max(150, s.baseSpawnRate * Math.pow(0.95, s.timeElapsed / 10000));
    if (timestamp - s.lastEnemySpawn > currentSpawnRate) {
      if (Math.random() < 0.15) spawnAsteroid();
      else spawnEnemy(timestamp);
      s.lastEnemySpawn = timestamp;
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      
      if (e.type === 'ASTEROID') {
        e.x += e.vx * 1.5 * (delta/16);
        e.y += e.vy * 2.0 * (delta/16);
        e.angle += e.rotSpeed * 1.5;
      } else {
        const age = timestamp - e.spawnTime;
        e.y += (e.type === 'C' ? 1.5 : e.type === 'B' ? 3.0 : 5.0) * (delta/16);
        
        if (e.type === 'B') {
          e.x += Math.sin(age * 0.005) * 3;
          if (timestamp - e.lastFire > 1200) {
            projectiles.push({ x: e.x, y: e.y + e.height/2, width: 4, height: 12, speed: 10, type: 'enemy' });
            e.lastFire = timestamp;
          }
        } else if (e.type === 'C') {
          if (timestamp - e.lastFire > 1800) {
            projectiles.push({ x: e.x, y: e.y + e.height/2, width: 6, height: 12, speed: 7, type: 'enemy' });
            projectiles.push({ x: e.x - 12, y: e.y + e.height/2, width: 6, height: 12, speed: 7, type: 'enemy', vx: -2.5 });
            projectiles.push({ x: e.x + 12, y: e.y + e.height/2, width: 6, height: 12, speed: 7, type: 'enemy', vx: 2.5 });
            e.lastFire = timestamp;
          }
        }
      }
      
      if (e.y > height + 50) enemies.splice(i, 1);
    }

    // --- Particles ---
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * (delta/16);
      p.y += p.vy * (delta/16);
      p.life -= 0.02 * (delta/16);
      if (p.life <= 0) particles.splice(i, 1);
    }
    
    // Engine Trail Particle
    if (player.vy < 0 || Math.abs(player.vx) > 0.5) {
      if (Math.random() < 0.5) {
        particles.push({
          x: player.x + (Math.random()-0.5)*10,
          y: player.y + 16,
          vx: (Math.random()-0.5)*0.5,
          vy: 1 + Math.random(),
          life: 0.6,
          color: '#FF2D78',
          size: 1.5 + Math.random() * 2
        });
      }
    }

    // --- Collisions ---
    const checkRectCollision = (x1, y1, w1, h1, x2, y2, w2, h2) => {
      return (Math.abs(x1 - x2) * 2 < (w1 + w2)) && (Math.abs(y1 - y2) * 2 < (h1 + h2));
    };

    // Projectile vs Enemy
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      if (p.type !== 'player') continue;
      
      let hit = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        if (checkRectCollision(p.x, p.y, p.width, p.height, e.x, e.y, e.width, e.height)) {
          e.hp--;
          hit = true;
          if (e.hp <= 0) {
            s.score += e.scoreVal;
            spawnExplosion(e.x, e.y, e.type === 'C' ? '#FF5E8A' : undefined);
            enemies.splice(j, 1);
          }
          break;
        }
      }
      if (hit) projectiles.splice(i, 1);
    }

    // Player vs Enemy / Projectile
    if (player.invulnTimer <= 0) {
      let playerHit = false;
      
      // Enemy projectile hit
      for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        if (p.type === 'enemy' && checkRectCollision(p.x, p.y, p.width, p.height, player.x, player.y, player.width, player.height)) {
          playerHit = true;
          projectiles.splice(i, 1);
          break;
        }
      }
      
      // Enemy collision
      if (!playerHit) {
        for (let j = enemies.length - 1; j >= 0; j--) {
          const e = enemies[j];
          if (checkRectCollision(player.x, player.y, player.width, player.height, e.x, e.y, e.width, e.height)) {
            playerHit = true;
            e.hp--;
            if (e.hp <= 0) {
              spawnExplosion(e.x, e.y);
              enemies.splice(j, 1);
            }
            break;
          }
        }
      }

      if (playerHit) {
        player.lives--;
        player.invulnTimer = 1500;
        spawnExplosion(player.x, player.y, '#00FFFF');
        // Screen shake
        s.screenShake = 150;
        if (player.lives <= 0) {
          s.gameOver = true;
        }
      }
    }


    // DRAWING
    // ----------------------------------------------------
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#010308';
    ctx.fillRect(0, 0, width, height);

    // Shake
    if (s.screenShake > 0) {
      s.screenShake -= delta;
      const dx = (Math.random() - 0.5) * 8;
      const dy = (Math.random() - 0.5) * 8;
      ctx.save();
      ctx.translate(dx, dy);
    } else {
      ctx.save();
    }

    // Draw Stars
    ctx.fillStyle = '#FFFFFF';
    stars.forEach(star => {
      ctx.globalAlpha = star.size / 2;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
    ctx.globalAlpha = 1.0;

    // Draw Enemies
    enemies.forEach(e => {
      ctx.save();
      ctx.translate(e.x, e.y);
      if (e.type === 'ASTEROID') {
        ctx.rotate(e.angle);
        ctx.strokeStyle = '#555';
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.moveTo(-16, -8);
        ctx.lineTo(-4, -16);
        ctx.lineTo(12, -10);
        ctx.lineTo(16, 4);
        ctx.lineTo(4, 16);
        ctx.lineTo(-12, 10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.strokeStyle = e.type === 'C' ? '#FF5E8A' : e.type === 'B' ? '#9D00FF' : '#FF2D78';
        ctx.lineWidth = 2;
        if (e.type === 'A') { // Hexagon
          ctx.beginPath();
          for (let i=0; i<6; i++) {
            const a = i * Math.PI / 3;
            const r = e.width / 2;
            ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (e.type === 'B') { // Diamond
          ctx.beginPath();
          ctx.moveTo(0, -e.height/2);
          ctx.lineTo(e.width/2, 0);
          ctx.lineTo(0, e.height/2);
          ctx.lineTo(-e.width/2, 0);
          ctx.closePath();
          ctx.stroke();
        } else if (e.type === 'C') { // Cruiser
          ctx.strokeRect(-e.width/2, -e.height/2, e.width, e.height);
          ctx.fillStyle = '#FF5E8A';
          ctx.fillRect(-e.width/2 + 4, -e.height/2 + 4, e.width - 8, e.height - 8);
        }
      }
      ctx.restore();
    });

    // Draw Projectiles
    projectiles.forEach(p => {
      ctx.fillStyle = p.type === 'player' ? '#00FFFF' : '#FF5E8A';
      if (p.vx) {
        p.x += p.vx * (delta/16);
      }
      ctx.fillRect(p.x - p.width/2, p.y - p.height/2, p.width, p.height);
    });

    // Draw Particles
    particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    });
    ctx.globalAlpha = 1.0;

    // Draw Player
    if (player.invulnTimer <= 0 || Math.floor(timestamp / 100) % 2 === 0) {
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.fillStyle = '#00FFFF';
      ctx.beginPath();
      ctx.moveTo(0, -player.height/2);
      ctx.lineTo(player.width/2, player.height/2);
      ctx.lineTo(0, player.height/4);
      ctx.lineTo(-player.width/2, player.height/2);
      ctx.closePath();
      ctx.fill();
      // Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FFFF';
      ctx.fill();
      ctx.restore();
    }

    ctx.restore(); // Restore shake transform

    // UI HUD
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00FFFF';
    ctx.textAlign = 'right';
    ctx.fillText(`SCORE: ${s.score}`, width - 20, 30);
    
    let hs = parseInt(localStorage.getItem('rocketRaidHighScore') || '0', 10);
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(232, 244, 248, 0.5)';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(`HIGH SCORE: ${Math.max(hs, s.score)}`, width / 2, 25);

    // Lives
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FF2D78';
    let livesText = '';
    for(let i=0; i<player.lives; i++) livesText += '▲ ';
    ctx.fillText(livesText, 20, 30);
    
    ctx.fillStyle = 'rgba(232, 244, 248, 0.3)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('[ESC] TO EXIT', width / 2, height - 20);

    // Request next frame
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  // Setup / Teardown
  useEffect(() => {
    const s = stateRef.current;
    s.width = window.innerWidth;
    s.height = window.innerHeight;
    s.player.x = s.width / 2;
    s.player.y = s.height - 100;
    
    // Init stars
    for (let i = 0; i < 150; i++) {
      s.stars.push({
        x: Math.random() * s.width,
        y: Math.random() * s.height,
        speed: 0.2 + Math.random() * 1.5,
        size: Math.random() > 0.8 ? 2 : 1
      });
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onExit();
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = true;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = true;
      if (e.key === ' ') keysRef.current.space = true;
    };
    
    const handleKeyUp = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') keysRef.current.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') keysRef.current.down = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keysRef.current.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keysRef.current.right = false;
      if (e.key === ' ') keysRef.current.space = false;
    };

    const handleResize = () => {
      s.width = window.innerWidth;
      s.height = window.innerHeight;
      if (canvasRef.current) {
        canvasRef.current.width = s.width;
        canvasRef.current.height = s.height;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    
    handleResize(); // set initial canvas size
    
    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restartGame = () => {
    const s = stateRef.current;
    s.player.lives = 3;
    s.player.x = s.width / 2;
    s.player.y = s.height - 100;
    s.player.vx = 0;
    s.player.vy = 0;
    s.player.invulnTimer = 2000;
    s.projectiles = [];
    s.enemies = [];
    s.particles = [];
    s.score = 0;
    s.timeElapsed = 0;
    s.gameOver = false;
    
    setIsGameOver(false);
    lastTimeRef.current = 0;
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  // Mobile Touch Handlers
  const handleJoyStart = (e) => {
    e.preventDefault();
    const touch = e.changedTouches[0];
    touchRef.current.active = true;
    touchRef.current.startX = touch.clientX;
    touchRef.current.startY = touch.clientY;
    touchRef.current.currentX = touch.clientX;
    touchRef.current.currentY = touch.clientY;
  };
  
  const handleJoyMove = (e) => {
    e.preventDefault();
    if (!touchRef.current.active) return;
    const touch = e.changedTouches[0];
    touchRef.current.currentX = touch.clientX;
    touchRef.current.currentY = touch.clientY;
  };
  
  const handleJoyEnd = (e) => {
    e.preventDefault();
    touchRef.current.active = false;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[600] bg-void"
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block"
      />

      {/* Mobile Controls (Visible on small screens or touch devices) */}
      <div className="md:hidden absolute inset-0 pointer-events-none">
        {/* Joystick */}
        <div 
          className="absolute bottom-8 left-8 w-[90px] h-[90px] rounded-full border-2 border-neon-cyan opacity-30 pointer-events-auto flex items-center justify-center touch-none"
          onTouchStart={handleJoyStart}
          onTouchMove={handleJoyMove}
          onTouchEnd={handleJoyEnd}
          onTouchCancel={handleJoyEnd}
        >
          <div className="w-[40px] h-[40px] rounded-full bg-neon-cyan opacity-60 pointer-events-none" 
            style={{
              transform: touchRef.current.active 
                ? `translate(${Math.min(25, Math.max(-25, touchRef.current.currentX - touchRef.current.startX))}px, ${Math.min(25, Math.max(-25, touchRef.current.currentY - touchRef.current.startY))}px)`
                : 'translate(0, 0)'
            }}
          />
        </div>
        
        {/* Fire Button */}
        <button 
          className="absolute bottom-10 right-10 w-[70px] h-[70px] rounded-full border-2 border-neon-pink bg-neon-pink/20 opacity-50 pointer-events-auto touch-none flex items-center justify-center"
          onTouchStart={(e) => { e.preventDefault(); touchRef.current.firing = true; }}
          onTouchEnd={(e) => { e.preventDefault(); touchRef.current.firing = false; }}
          onTouchCancel={(e) => { e.preventDefault(); touchRef.current.firing = false; }}
        >
          <div className="w-8 h-8 rounded-full bg-neon-pink opacity-80" />
        </button>
      </div>

      {/* Game Over Screen */}
      {isGameOver && (
        <div className="absolute inset-0 bg-[#010308]/90 backdrop-blur-md flex flex-col items-center justify-center z-[610] animate-in fade-in duration-300">
          <h2 className="font-orbitron text-6xl font-bold text-neon-pink mb-4" style={{ textShadow: '0 0 20px rgba(255,45,120,0.5)' }}>
            GAME OVER
          </h2>
          <div className="font-jetbrains text-2xl text-text-primary mb-2">
            SCORE: <span className="text-neon-cyan">{finalScore}</span>
          </div>
          <div className="font-jetbrains text-xl text-text-dim mb-10">
            HIGH SCORE: <span className={finalScore >= highScore ? "text-neon-cyan glow-text" : ""}>{highScore}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <button 
              onClick={restartGame}
              className="cyber-cta cyber-cta-primary"
            >
              <span className="cyber-cta-core">PLAY AGAIN</span>
            </button>
            <button 
              onClick={() => onExit(finalScore)}
              className="cyber-cta cyber-cta-secondary"
            >
              <span className="cyber-cta-core">RETURN TO TERMINAL</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
