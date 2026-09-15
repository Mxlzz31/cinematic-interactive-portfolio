import { useEffect, useState } from 'react'
import Achievements from './components/Achievements'
import Education from './components/Education'
import Hero from './components/Hero'
import Metrics from './components/Metrics'
import Projects from './components/Projects'
import Timeline from './components/Timeline'

function Nav({ progress }: { progress: number }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-10 sm:px-16 lg:px-24 py-6 sm:py-8 flex items-center justify-between transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(7,7,10,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(238,234,224,0.05)' : '1px solid transparent',
      }}
    >
      {/* Logo mark */}
      <a
        href="#"
        data-hover
        className="font-display font-black text-[#FFF7FC] text-lg tracking-tight hover:text-[#26A7FF] transition-colors duration-300"
      >
        M L
      </a>

      {/* Nav links */}
      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-6 whitespace-nowrap sm:flex lg:gap-10 xl:gap-12">
        {[
          { label: 'Education', href: '#education' },
          { label: 'Experience', href: '#experience' },
          { label: 'Projects', href: '#projects' },
          { label: 'TechStack', href: '#techstack' },
          { label: 'Achievements', href: '#achievements' },
          { label: 'Contact', href: '#contact' },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            data-hover
            onClick={event => {
              if (label === 'Education') {
                window.dispatchEvent(new CustomEvent('education-toggle'))
              }
            }}
            className="font-mono font-semibold text-[11px] lg:text-[12px] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors duration-300"
          >
            {label}
          </a>
        ))}
      </div>

      {/* Scroll progress */}
      <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 items-center gap-3 sm:flex lg:right-24">
        <div
          className="h-px w-20 lg:w-28"
          style={{ background: 'rgba(238,234,224,0.1)' }}
        >
          <div
            className="h-full bg-[#26A7FF] transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="font-sans text-[11px] font-extrabold text-[#26A7FF] tabular-nums w-10 text-right">
          {Math.round(progress * 100)}%
        </span>
      </div>
    </nav>
  )
}

function Contact() {
  return (
    <section
      id="contact"
      className="relative py-36 sm:py-48 px-10 sm:px-16 lg:px-24 bg-[#07070A] overflow-hidden"
    >
      {/* Giant background arrow */}
      <div
        className="absolute inset-0 flex items-center justify-end pointer-events-none select-none pr-16 opacity-[0.025]"
        aria-hidden
      >
        <span
          className="font-display font-black leading-none"
          style={{ fontSize: 'clamp(180px, 28vw, 380px)', color: '#EEEAE0' }}
        >
          ↗
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[#EEEAE0]/25">
          </span>
        </div>

        <h2
          className="font-display font-black uppercase text-[#EEEAE0] leading-none mb-8"
          style={{ fontSize: 'clamp(32px, 5vw, 64px)', letterSpacing: '-0.025em' }}
        >
          Let's Build
          <br />
          <span style={{ color: '#26A7FF' }}>Something</span>
          <br />
          That Matters.
        </h2>


        <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-8">
          <a
            href="mailto:malz311204@gmail.com"
            data-magnetic
            data-hover
            className="font-sans font-bold text-sm tracking-[0.08em] uppercase text-[#07070A] bg-[#26A7FF] px-8 sm:px-10 py-4 sm:py-5 hover:bg-white transition-colors duration-300"
          >
            malz311204@gmail.com
          </a>

          <div className="flex items-center gap-6 sm:gap-8 pt-4 sm:pt-5">
              {[
                { label: 'GitHub', href: 'https://github.com/Mxlzz31' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/malavika-l-a7663b256/' },
              ].map(link => (
              <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                data-hover
                className="font-sans font-bold text-sm tracking-[0.08em] uppercase text-white/70 hover:text-white transition-colors duration-300"
              >
                  {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer
      className="px-10 sm:px-16 lg:px-24 py-7 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
      style={{ borderTop: '1px solid rgba(238,234,224,0.06)' }}
    >
      <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.22em] uppercase text-[#EEEAE0]/18">
        © 2026 Malavika Loganathan. All rights reserved.
      </span>
    </footer>
  )
}

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      if (max > 0) setScrollProgress(window.scrollY / max)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="bg-[#07070A] min-h-screen">
      <Nav progress={scrollProgress} />
      <Hero />
      <Education />
      <Timeline />
      <Projects />
      <Metrics />
      <Achievements />
      <Contact />
      <Footer />
    </div>
  )
}
