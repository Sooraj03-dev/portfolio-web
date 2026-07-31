export default function VideoBackground() {
  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          filter: 'brightness(0.55) saturate(1.3) contrast(1.1)'
        }}
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* 1. Color grade overlay */}
      <div 
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(135deg, rgba(0, 20, 40, 0.45) 0%, rgba(0, 5, 15, 0.35) 50%, rgba(20, 0, 40, 0.45) 100%)',
          mixBlendMode: 'multiply',
          pointerEvents: 'none'
        }}
      />

      {/* 2. Scanline texture overlay */}
      <div 
        style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.08) 2px, rgba(0, 0, 0, 0.08) 4px)',
          pointerEvents: 'none'
        }}
      />

      {/* 3. Vignette overlay */}
      <div 
        style={{
          position: 'absolute', inset: 0, zIndex: 3,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(1, 3, 8, 0.6) 70%, rgba(1, 3, 8, 0.92) 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* 4. Bottom section fade */}
      <div 
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '220px', zIndex: 4,
          background: 'linear-gradient(transparent, rgba(1, 3, 8, 0.8) 60%, #010308 100%)',
          pointerEvents: 'none'
        }}
      />
    </>
  );
}
