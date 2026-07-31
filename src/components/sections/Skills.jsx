import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillCategories } from '../../data/skills';
import { useGlitch } from '../../hooks/useGlitch';

gsap.registerPlugin(ScrollTrigger);

function SkillCard({ skill, color, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="skill-card relative overflow-hidden rounded-2xl border border-neon-cyan/10 bg-[#050C14]/85 p-4 md:p-5 backdrop-blur-sm transition-transform duration-300 clickable"
      data-target-level={skill.level}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? `0 0 0 1px ${color}33, 0 0 30px ${color}12, inset 0 0 18px ${color}10`
          : 'inset 0 0 0 1px rgba(255,255,255,0.03)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle at top right, ${color}18, transparent 48%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-jetbrains text-[10px] uppercase tracking-[0.35em] text-text-dim">
            node {String(index + 1).padStart(2, '0')}
          </div>
          <h3
            className="mt-2 font-orbitron text-lg md:text-xl uppercase tracking-cyber transition-colors duration-300"
            style={{ color: hovered ? color : '#E8F4F8' }}
          >
            {skill.name}
          </h3>
        </div>

        <div className="skill-pct font-jetbrains text-sm md:text-base text-right" style={{ color }}>
          0%
        </div>
      </div>

      <div className="relative mt-4 h-px overflow-hidden bg-white/5">
        <div
          className="skill-bar-fill absolute inset-y-0 left-0 w-0"
          style={{
            background: `linear-gradient(90deg, ${color}, rgba(232,244,248,0.9))`,
            boxShadow: `0 0 14px ${color}55`,
          }}
        />
      </div>

      <div className="relative mt-4 flex items-center justify-between gap-3">
        <div className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-text-dim">
          proficiency index
        </div>
        <div className="hex-clip flex h-10 w-10 items-center justify-center border border-neon-cyan/20 bg-[#010308]/90">
          <span className="font-jetbrains text-[10px] text-neon-cyan">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Skills() {
  const { ref: titleRef, text: titleText } = useGlitch('SKILL MATRIX', 1500);
  const sectionRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(skillCategories[0].name);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scanline = section.querySelector('.skill-scanline');
    const cards = section.querySelectorAll('.skill-card');
    const activeCategoryData = skillCategories.find((category) => category.name === activeCategory);

    if (!activeCategoryData) return;

    const setFinalState = () => {
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
      cards.forEach((card) => {
        const pct = card.querySelector('.skill-pct');
        const fill = card.querySelector('.skill-bar-fill');
        const target = Number(card.dataset.targetLevel || 0);
        if (pct) pct.innerText = `${target}%`;
        if (fill) fill.style.width = `${target}%`;
      });
    };

    if (prefersReducedMotion) {
      setFinalState();
      return undefined;
    }

    gsap.set(cards, { opacity: 0, y: 22, scale: 0.98 });
    gsap.set(scanline, { top: '0%', opacity: 0 });
    cards.forEach((card) => {
      const pct = card.querySelector('.skill-pct');
      const fill = card.querySelector('.skill-bar-fill');
      if (pct) pct.innerText = '0%';
      if (fill) fill.style.width = '0%';
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 65%',
        end: 'bottom 20%',
        toggleActions: 'play none none none',
      },
    });

    tl.to(scanline, { opacity: 1, duration: 0.2 })
      .to(scanline, { top: '100%', duration: 1.05, ease: 'none' });

    cards.forEach((card, index) => {
      const pctEl = card.querySelector('.skill-pct');
      const fillEl = card.querySelector('.skill-bar-fill');
      const target = Number(card.dataset.targetLevel || 0);
      const nodeTime = 0.18 + index * 0.1;
      const counter = { value: 0 };

      tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.35)' }, nodeTime);

      if (fillEl) {
        tl.to(fillEl, { width: `${target}%`, duration: 0.7, ease: 'power2.out' }, nodeTime + 0.05);
      }

      if (pctEl) {
        tl.to(counter, {
          value: target,
          duration: 0.7,
          ease: 'power1.out',
          onUpdate: () => {
            pctEl.innerText = `${Math.round(counter.value)}%`;
          },
        }, nodeTime + 0.05);
      }
    });

    tl.to(scanline, { opacity: 0, duration: 0.25 }, '>');

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [activeCategory]);

  const activeCategoryData = skillCategories.find((category) => category.name === activeCategory);
  const skillCount = activeCategoryData?.skills.length ?? 0;
  const averageLevel = activeCategoryData
    ? Math.round(activeCategoryData.skills.reduce((total, skill) => total + skill.level, 0) / activeCategoryData.skills.length)
    : 0;
  const peakSkill = activeCategoryData
    ? activeCategoryData.skills.reduce((best, skill) => (skill.level > best.level ? skill : best), activeCategoryData.skills[0])
    : null;

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative overflow-hidden px-6 py-24 md:px-12"
      style={{ background: '#010308' }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.1),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(157,0,255,0.08),_transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/70 to-transparent" />
        <div className="skill-scanline absolute left-0 top-0 z-20 h-[2px] w-full pointer-events-none bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_15px_rgba(0,255,255,0.8),0_0_30px_rgba(0,255,255,0.5)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <h2
            ref={titleRef}
            className="font-orbitron text-3xl font-bold uppercase tracking-cyber md:text-4xl neon-text-cyan"
            data-text={titleText}
          >
            {titleText || 'SKILL MATRIX'}
          </h2>
          <div className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
          <p className="mx-auto mt-5 max-w-2xl font-rajdhani text-sm uppercase tracking-[0.24em] text-text-dim md:text-base">
            Structured capability map // active loadout overview
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-neon-cyan/15 bg-[linear-gradient(180deg,rgba(5,12,20,0.92),rgba(1,3,8,0.98))] p-4 shadow-[0_0_0_1px_rgba(0,255,255,0.04),0_24px_80px_rgba(0,0,0,0.5)] md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,255,255,0.04)_1px,transparent_1px),linear-gradient(rgba(0,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,45,120,0.06),transparent_24%)]" />

          <div className="relative">
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {skillCategories.map((category, index) => {
                const isActive = category.name === activeCategory;

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => setActiveCategory(category.name)}
                    className="clickable group relative flex items-center gap-3 rounded-full border px-4 py-2 text-left font-rajdhani text-sm uppercase tracking-[0.24em] transition-all duration-300"
                    style={{
                      borderColor: isActive ? category.color : 'rgba(58,106,122,0.25)',
                      background: isActive ? `${category.color}16` : 'rgba(1,3,8,0.65)',
                      boxShadow: isActive ? `0 0 0 1px ${category.color}22, 0 0 24px ${category.color}10` : 'none',
                      color: isActive ? '#E8F4F8' : '#86A9B8',
                    }}
                  >
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-jetbrains"
                      style={{
                        borderColor: isActive ? category.color : 'rgba(58,106,122,0.25)',
                        color: isActive ? category.color : '#86A9B8',
                        background: isActive ? `${category.color}10` : 'transparent',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{category.name}</span>
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: isActive ? category.color : '#3A6A7A' }}
                    />
                  </button>
                );
              })}
            </div>

            {activeCategoryData && (
              <>
                <div className="mb-6 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-neon-cyan/12 bg-black/25 p-4">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.35em] text-text-dim">active array</div>
                    <div className="mt-2 font-orbitron text-lg uppercase tracking-cyber text-text-primary">
                      {activeCategoryData.name}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neon-cyan/12 bg-black/25 p-4">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.35em] text-text-dim">average mastery</div>
                    <div className="mt-2 font-orbitron text-lg uppercase tracking-cyber text-neon-cyan">
                      {averageLevel}%
                    </div>
                  </div>

                  <div className="rounded-2xl border border-neon-cyan/12 bg-black/25 p-4">
                    <div className="font-jetbrains text-[10px] uppercase tracking-[0.35em] text-text-dim">peak node</div>
                    <div className="mt-2 font-orbitron text-lg uppercase tracking-cyber text-neon-pink">
                      {peakSkill ? `${peakSkill.name} · ${peakSkill.level}%` : '—'}
                    </div>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-3 font-jetbrains text-[10px] uppercase tracking-[0.35em] text-text-dim">
                  <span>{skillCount} nodes online</span>
                  <span>hover to inspect</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {activeCategoryData.skills.map((skill, index) => (
                    <SkillCard
                      key={skill.name}
                      skill={skill}
                      color={activeCategoryData.color}
                      index={index}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
