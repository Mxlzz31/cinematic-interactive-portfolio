import { useEffect, useRef, useState } from 'react'
import PhysicsField from './PhysicsField'

const ACHIEVEMENTS = [
  {
    title: 'Kynnovate 2025',
    description: 'Finalist in the Kynnovate 2025 hackathon. Developed an AI solution for content moderation on social media platforms.',
    accent: '#26A7FF',
  },
  {
    title: 'IIT Roorkee ProductathonAI 2024',
    description: 'Received a Special Mention for developing an AI solution focused on sustainable agriculture.',
    accent: '#178CE0',
  },
  {
    title: 'Technology Infusion Grand Challenge',
    description: 'Finalist in the La Trobe University challenge. Created an open-source real-time video call translation app.',
    accent: '#8ED8FF',
  },
]

export default function Achievements() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="achievements" ref={sectionRef} className="relative overflow-hidden px-10 sm:px-16 lg:px-24 py-24 sm:py-32 bg-[linear-gradient(125deg,rgba(38,167,255,0.16),transparent_45%,rgba(142,216,255,0.12)),#07070A]">
      <PhysicsField variant="flow" accent="#6BCBFF" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-12 sm:mb-16">
          <h2
            className="font-display font-black uppercase leading-none text-[#EEEAE0]"
            style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', letterSpacing: '-0.03em' }}
          >
            Achievements
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ACHIEVEMENTS.map((item, index) => (
            <div
              key={item.title}
              className="group relative overflow-hidden border border-[#26A7FF]/25 bg-[#0A1018]/90 p-6 sm:p-8 transition-all duration-700 hover:-translate-y-3 hover:border-[#26A7FF]/70"
              style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transitionDelay: `${index * 120}ms` }}
            >
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#26A7FF]/15 transition-transform duration-700 group-hover:scale-150" />
              <div
                className="mb-5 h-1.5 w-12"
                style={{ background: item.accent, boxShadow: `0 0 18px ${item.accent}` }}
              />
              <h3
                className="font-display font-black uppercase leading-none text-[#EEEAE0] mb-4"
                style={{ fontSize: 'clamp(20px, 2vw, 28px)', letterSpacing: '-0.03em' }}
              >
                {item.title}
              </h3>
              <p className="font-sans font-medium text-[14px] sm:text-[15px] leading-relaxed text-white/80">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
