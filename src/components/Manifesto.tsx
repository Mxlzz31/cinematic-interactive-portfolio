import { useEffect, useRef, useState } from 'react'

const PHRASES = [
  { text: 'The best AI', accent: false },
  { text: "doesn't", accent: false },
  { text: 'announce itself.', accent: false },
  { text: 'It disappears', accent: true },
  { text: 'into the workflow', accent: false },
  { text: '—', accent: false },
  { text: 'making teams', accent: false },
  { text: 'faster,', accent: false },
  { text: 'products', accent: false },
  { text: 'sharper,', accent: false },
  { text: 'decisions', accent: false },
  { text: 'invisible.', accent: false },
  { text: 'I build', accent: false },
  { text: 'at the intersection', accent: false },
  { text: 'of intelligence', accent: true },
  { text: 'and product', accent: false },
  { text: '—', accent: false },
  { text: 'where systems', accent: false },
  { text: 'think,', accent: true },
  { text: 'adapt,', accent: false },
  { text: 'and compound.', accent: true },
]

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrollable = containerRef.current.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      setProgress(Math.max(0, Math.min(1, scrolled / scrollable)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={containerRef} style={{ height: '380vh' }} className="relative">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="px-10 sm:px-16 lg:px-24 max-w-[1200px]">

          <p
            className="font-display font-black uppercase leading-[0.92]"
            style={{ fontSize: 'clamp(38px, 5.5vw, 86px)' }}
          >
            {PHRASES.map((phrase, i) => {
              const threshold = i / PHRASES.length
              const wordProgress = Math.max(0, Math.min(1, (progress - threshold) / (1 / PHRASES.length)))
              const isLit = progress > threshold + 0.02

              return (
                <span
                  key={i}
                  className="inline-block mr-[0.22em] transition-all duration-500"
                  style={{
                    opacity: 0.1 + wordProgress * 0.9,
                    color: isLit && phrase.accent ? '#C8FF00' : '#EEEAE0',
                    transform: `translateY(${(1 - wordProgress) * 10}px)`,
                  }}
                >
                  {phrase.text}
                </span>
              )
            })}
          </p>

          {/* Subtle progress bar */}
          <div className="mt-16 sm:mt-20 flex items-center gap-4">
            <div className="h-px flex-1 max-w-[200px]" style={{ background: 'rgba(238,234,224,0.08)' }}>
              <div
                className="h-full transition-all duration-100"
                style={{ width: `${progress * 100}%`, background: '#C8FF00' }}
              />
            </div>
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#EEEAE0]/20">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
