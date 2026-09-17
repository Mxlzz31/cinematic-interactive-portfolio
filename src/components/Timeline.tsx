import { useEffect, useRef, useState } from 'react'
import PhysicsField from './PhysicsField'

const EXPERIENCES = [
  {
    period: 'June 2026 — Present',
    role: 'Associate Product Engineer',
    company: 'Predigle',
    location: 'Remote / Product Team',
    description:
      'Promoted to Associate Product Engineer after successfully contributing to end-to-end full-stack product development. Engineered scalable and optimized solutions using Angular, Django, Python, TypeScript, MongoDB, and Firebase.',
    achievement: 'Enhanced vessel tracking, mapping, social networking, and platform performance through feature development and bug fixes',
    tech: ['Angular', 'Django', 'Python', 'TypeScript', 'MongoDB', 'Firebase'],
    color: '#26A7FF',
  },
  {
    period: 'December 2025 — June 2026',
    role: 'Full Stack Developer Intern',
    company: 'Predigle',
    location: 'Remote',
    description:
      'Developed and maintained backend APIs for the Esperwave platform, a social application focused on sharing boating tips. Cut response times on the heaviest feed endpoints by restructuring MongoDB queries into aggregation pipelines and adding the indexes they needed.',
    achievement: 'Collaborated on social features including user interactions, feeds, chat, and engagement systems',
    tech: ['MongoDB', 'API Design', 'Node.js', 'JavaScript', 'Backend Engineering'],
    color: '#178CE0',
  },
  {
    period: 'June 2025 — October 2025',
    role: 'AI Research Intern',
    company: 'Proglint',
    location: 'Remote / Research',
    description:
      'Built and deployed computer vision models addressing problems in QSR, manufacturing, and medical industries. Developed and maintained backend APIs for 5+ manufacturing use cases, improving system response times by 40%.',
    achievement: 'Architected a DeepStream-based inference pipeline that processed 60+ FPS video streams and reduced memory leaks by 30%',
    tech: ['Computer Vision', 'DeepStream', 'Python', 'OpenCV', 'Backend APIs'],
    color: '#8ED8FF',
  },
]

export default function Timeline() {
  const [active, setActive] = useState(0)
  const [lineProgress, setLineProgress] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const detailKey = active

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let p = 0
          const tick = () => {
            p = Math.min(p + 0.8, 100)
            setLineProgress(p)
            if (p < 100) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const exp = EXPERIENCES[active]

  return (
    <section id="experience" ref={sectionRef} className="relative overflow-hidden py-24 sm:py-32 px-10 sm:px-16 lg:px-24 bg-[radial-gradient(circle_at_12%_50%,rgba(38,167,255,0.2),transparent_30%),#07070A]">
      <PhysicsField variant="orbit" accent="#8ED8FF" />
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-12 sm:mb-16">
          <h2
            className="font-display font-black uppercase text-[#EEEAE0] leading-none"
            style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', letterSpacing: '-0.03em' }}
          >
            Experience
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,420px)_1fr] gap-0 lg:gap-16">

          {/* Left: selectable list with animated track */}
          <div className="flex gap-6 sm:gap-8 mb-12 lg:mb-0">

            {/* Vertical line track */}
            <div className="relative flex-shrink-0 w-px mt-6 mb-6">
              <div className="absolute inset-0" style={{ background: 'rgba(238,234,224,0.08)' }} />
              <div
                className="absolute top-0 left-0 w-full transition-all duration-200"
                style={{
                  height: `${lineProgress}%`,
                  background: exp.color,
                }}
              />
            </div>

            {/* Entries */}
            <div className="flex-1">
              {EXPERIENCES.map((e, i) => (
                <button
                  key={i}
                  data-hover
                  onClick={() => setActive(i)}
                  className="block w-full text-left pb-8 mb-0 relative group"
                  style={{ borderBottom: i < EXPERIENCES.length - 1 ? '1px solid rgba(238,234,224,0.06)' : 'none', transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                  onMouseEnter={event => { event.currentTarget.style.transform = 'translateX(10px)' }}
                  onMouseLeave={event => { event.currentTarget.style.transform = 'translateX(0)' }}
                >
                  {/* Dot on track */}
                  <div
                    className="absolute transition-all duration-300"
                    style={{
                      left: -34,
                      top: 22,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: i <= active ? e.color : 'rgba(238,234,224,0.15)',
                      boxShadow: i === active ? `0 0 12px ${e.color}60` : 'none',
                      transform: i === active ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />

                  <div className="pt-5">
                    <div
                      className={i === active ? 'blue-label uppercase mb-1.5' : 'font-sans text-xs font-semibold uppercase mb-1.5 text-white/60'}
                    >
                      {e.period}
                    </div>
                    <div
                      className="font-display font-bold uppercase leading-tight transition-colors duration-300"
                      style={{
                        fontSize: 'clamp(18px, 2vw, 24px)',
                        color: i === active ? '#EEEAE0' : 'rgba(238,234,224,0.6)',
                      }}
                    >
                      {e.role}
                    </div>
                    <div
                      className="font-mono text-[10px] tracking-[0.12em] mt-1 transition-colors duration-300"
                      style={{ color: i === active ? 'rgba(238,234,224,0.5)' : 'rgba(238,234,224,0.55)' }}
                    >
                      {e.company}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right: detail panel */}
          <div
            className="lg:pl-12"
            style={{ borderLeft: '1px solid rgba(238,234,224,0.06)' }}
          >
            <div key={detailKey} className="animate-fade-slide">
              <div className="blue-label uppercase mb-6">
                {exp.period}
              </div>

              <h3
                className="font-display font-black uppercase text-[#EEEAE0] leading-tight mb-2"
                style={{ fontSize: 'clamp(24px, 2.5vw, 40px)' }}
              >
                {exp.role}
              </h3>

              <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#EEEAE0]/65 mb-8">
                {exp.company} · {exp.location}
              </div>

              <p className="font-sans font-medium text-[14px] sm:text-[15px] leading-relaxed text-white/80 mb-10">
                {exp.description}
              </p>

              {/* Achievement callout */}
              <div
                className="pl-5 mb-10"
                style={{ borderLeft: `2px solid ${exp.color}` }}
              >
                <div className="blue-label uppercase mb-2">
                  Key Achievement
                </div>
                <p className="font-sans font-semibold text-[13px] sm:text-[14px] text-white/90">
                  {exp.achievement}
                </p>
              </div>

              {/* Stack */}
              <div>
                <div className="blue-label uppercase mb-4">
                  Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map(t => (
                    <span
                      key={t}
                      className="font-mono text-[9px] sm:text-[10px] tracking-[0.12em] uppercase px-3 py-1.5 text-[#EEEAE0]/65"
                      style={{ border: '1px solid rgba(238,234,224,0.1)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
