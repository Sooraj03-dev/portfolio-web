export default function HeroSubtitle() {
  const words = ['AI', 'ML', 'FULL STACK'];
  
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
        <span key={word}>
          {word}
          {i < words.length - 1 && (
            <span style={{ color: '#FF2D78' }}> &middot; </span>
          )}
        </span>
      ))}
    </div>
  );
}
