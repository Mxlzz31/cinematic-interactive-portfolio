import { useEffect, useRef, useState } from 'react'
import PhysicsField from './PhysicsField'

const TECH_STACK = [
  {
    label: 'Languages',
    context: 'The languages I use to reason, prototype, and ship.',
    role: 'Core development',
    accent: '#26A7FF',
    tint: 'rgba(38,167,255,0.14)',
    items: ['Python', 'C/C++', 'JavaScript', 'TypeScript', 'HTML/CSS'],
  },
  {
    label: 'Frameworks',
    context: 'The frameworks that turn models and ideas into products.',
    role: 'Product engineering',
    accent: '#178CE0',
    tint: 'rgba(23,140,224,0.14)',
    items: ['React.js', 'Node.js', 'Flask', 'Django', 'PyTorch', 'TensorFlow', 'OpenCV', 'DeepStream', 'Firebase'],
  },
  {
    label: 'Technical Tools',
    context: 'The infrastructure and tools behind reliable delivery.',
    role: 'Systems and workflow',
    accent: '#6BCBFF',
    tint: 'rgba(107,203,255,0.14)',
    items: ['MySQL', 'MongoDB', 'Git', 'Docker', 'Selenium', 'Linux/Unix', 'Cucumber', 'REST API', 'PostgreSQL'],
  },
  {
    label: 'Spoken Languages',
    context: 'The languages I use to collaborate across people and teams.',
    role: 'Communication',
    accent: '#8ED8FF',
    tint: 'rgba(142,216,255,0.14)',
    items: ['English', 'Hindi', 'Japanese', 'Tamil', 'Telugu'],
  },
]

export default function Metrics() {
  const ref = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const selectCluster = (index: number) => {
    setActiveIndex(index)
  }

  return (
    <section id="techstack" ref={ref} className="relative overflow-hidden px-10 sm:px-16 lg:px-24 py-24 sm:py-32 bg-[radial-gradient(circle_at_50%_10%,rgba(38,167,255,0.18),transparent_30%),#07070A]">
      <PhysicsField variant="flow" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16 max-w-2xl">
          <h2
            className="font-display font-black uppercase leading-none text-[#EEEAE0]"
            style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', letterSpacing: '-0.03em' }}
          >
            Tech Stack
          </h2>
          <p className="mt-5 max-w-xl font-sans font-semibold text-sm leading-relaxed text-white/80">A living map of the tools I use to turn ideas into working systems.</p>
        </div>

        <div className="relative mx-auto max-w-5xl overflow-hidden border border-[#26A7FF]/30 bg-[#080A0F] shadow-[0_25px_100px_rgba(0,0,0,0.45)]">
          <div className="grid lg:grid-cols-[260px_1fr]">
            <nav className="border-b border-white/10 p-4 sm:p-6 lg:border-b-0 lg:border-r">
              <div className="mb-5 font-sans text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/35">Explore by role</div>
              <div className="space-y-2">
                {TECH_STACK.map((group, index) => (
                  <button key={group.label} type="button" onClick={() => selectCluster(index)} className="group flex w-full items-center justify-between border px-4 py-3 text-left transition-all duration-300 hover:translate-x-1" style={{ borderColor: activeIndex === index ? `${group.accent}cc` : 'rgba(255,255,255,0.1)', background: activeIndex === index ? group.tint : 'transparent' }}>
                    <span className="font-sans text-xs font-extrabold uppercase text-white">{group.label}</span>
                    <span className="blue-label" style={{ color: group.accent }}>{String(group.items.length).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            </nav>

            <div className="relative p-5 sm:p-8 lg:p-10">
              <div className="absolute right-8 top-8 h-28 w-28 rounded-full border border-[#26A7FF]/20" />
              <div className="relative">
                <div className="flex items-start justify-between border-b border-white/10 pb-6">
                  <div>
                    <div className="blue-label uppercase tracking-[0.16em]" style={{ color: TECH_STACK[activeIndex].accent }}>Selected toolkit</div>
                    <h3 className="mt-3 font-sans text-3xl font-extrabold uppercase leading-none text-white">{TECH_STACK[activeIndex].label}</h3>
                  </div>
                  <span className="font-sans text-sm font-extrabold" style={{ color: TECH_STACK[activeIndex].accent }}>{String(TECH_STACK[activeIndex].items.length).padStart(2, '0')} tools</span>
                </div>
                <p className="max-w-xl py-6 font-sans text-sm font-semibold leading-relaxed text-white/60">{TECH_STACK[activeIndex].context}</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {TECH_STACK[activeIndex].items.map((item, index) => <div key={item} className="flex items-center gap-3 border border-white/10 bg-white/[0.025] px-4 py-3 transition-all duration-300 hover:border-[#26A7FF]/60 hover:bg-[#26A7FF]/[0.08]"><span className="h-2 w-2 rounded-full" style={{ background: TECH_STACK[activeIndex].accent, boxShadow: `0 0 10px ${TECH_STACK[activeIndex].accent}` }} /><span className="font-sans text-sm font-bold text-white/85">{item}</span><span className="ml-auto font-sans text-[10px] font-bold text-white/30">0{index + 1}</span></div>)}
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5"><span className="font-sans text-[10px] font-extrabold uppercase tracking-[0.16em] text-white/35">Primary use</span><span className="blue-label uppercase tracking-[0.1em]" style={{ color: TECH_STACK[activeIndex].accent }}>{TECH_STACK[activeIndex].role}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
