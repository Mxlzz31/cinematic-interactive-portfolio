import { useEffect, useRef, useState } from 'react'


interface GridNode {
  x: number
  y: number
  phase: number
}

interface Pulse {
  x: number
  y: number
  tx: number
  ty: number
  progress: number
  speed: number
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 150)
    return () => clearTimeout(t)
  }, [])


  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const nodes: GridNode[] = []
    const pulses: Pulse[] = []
    let animFrame = 0
    let lastPulseTime = 0
    let scanY = 0

    const buildGrid = () => {
      nodes.length = 0
      const gapX = 70
      const gapY = 70
      const cols = Math.ceil(canvas.width / gapX) + 1
      const rows = Math.ceil(canvas.height / gapY) + 1
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          nodes.push({
            x: i * gapX,
            y: j * gapY,
            phase: Math.random() * Math.PI * 2,
          })
        }
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      buildGrid()
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const draw = (ts: number) => {
      const t = ts * 0.001
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Advance scan line
      scanY = (scanY + 0.6) % (canvas.height + 80)

      // Spawn pulse along grid edges
      if (ts - lastPulseTime > 500 && nodes.length > 4) {
        lastPulseTime = ts
        const a = nodes[Math.floor(Math.random() * nodes.length)]
        const candidates = nodes.filter(n => {
          const d = Math.hypot(n.x - a.x, n.y - a.y)
          return d > 5 && d < 100
        })
        if (candidates.length > 0) {
          const b = candidates[Math.floor(Math.random() * candidates.length)]
          pulses.push({ x: a.x, y: a.y, tx: b.x, ty: b.y, progress: 0, speed: 0.018 + Math.random() * 0.012 })
        }
        if (pulses.length > 20) pulses.splice(0, 1)
      }

      // Advance pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i].progress += pulses[i].speed
        if (pulses[i].progress >= 1) pulses.splice(i, 1)
      }

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(38, 167, 255, 0.04)'
      ctx.lineWidth = 0.5
      const gapX = 70
      const gapY = 70
      const cols = Math.ceil(canvas.width / gapX) + 1
      const rows = Math.ceil(canvas.height / gapY) + 1
      for (let i = 0; i < cols; i++) {
        ctx.beginPath()
        ctx.moveTo(i * gapX, 0)
        ctx.lineTo(i * gapX, canvas.height)
        ctx.stroke()
      }
      for (let j = 0; j < rows; j++) {
        ctx.beginPath()
        ctx.moveTo(0, j * gapY)
        ctx.lineTo(canvas.width, j * gapY)
        ctx.stroke()
      }

      // Scan line glow band
      const scanGrad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50)
      scanGrad.addColorStop(0, 'transparent')
      scanGrad.addColorStop(0.5, 'rgba(38, 167, 255, 0.035)')
      scanGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = scanGrad
      ctx.fillRect(0, scanY - 50, canvas.width, 100)

      // Draw grid nodes
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      for (const node of nodes) {
        const mouseDist = Math.hypot(node.x - mx, node.y - my)
        const mouseGlow = Math.max(0, 1 - mouseDist / 160)
        const scanDist = Math.abs(node.y - scanY)
        const scanGlow = Math.max(0, 1 - scanDist / 35) * 0.45
        const blink = (Math.sin(t * 1.2 + node.phase) * 0.5 + 0.5) * 0.04
        const alpha = 0.06 + blink + mouseGlow * 0.75 + scanGlow

        const radius = 1.2 + mouseGlow * 3.5

        // Outer glow for mouse proximity
        if (mouseGlow > 0.25) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, radius * 5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(38, 167, 255, ${mouseGlow * 0.08})`
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(38, 167, 255, ${Math.min(alpha, 0.9)})`
        ctx.fill()
      }

      // Draw pulses
      for (const p of pulses) {
        const px = p.x + (p.tx - p.x) * p.progress
        const py = p.y + (p.ty - p.y) * p.progress
        const tailProgress = Math.max(0, p.progress - 0.18)
        const tailX = p.x + (p.tx - p.x) * tailProgress
        const tailY = p.y + (p.ty - p.y) * tailProgress
        const fade = 1 - p.progress

        // Tail
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(px, py)
        ctx.strokeStyle = `rgba(38, 167, 255, ${fade * 0.55})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Head
        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(38, 167, 255, ${fade * 0.95})`
        ctx.fill()

        // Halo
        ctx.beginPath()
        ctx.arc(px, py, 7, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(38, 167, 255, ${fade * 0.12})`
        ctx.fill()
      }

      // Animated waveform at bottom
      const waveY = canvas.height * 0.88
      ctx.beginPath()
      for (let x = 0; x <= canvas.width; x += 2) {
        const y =
          waveY +
          Math.sin(x * 0.016 + t * 0.7) * 18 +
          Math.sin(x * 0.005 + t * 0.28) * 35 +
          Math.sin(x * 0.065 + t * 1.6) * 5
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(38, 167, 255, 0.28)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Second wave, dimmer
      ctx.beginPath()
      for (let x = 0; x <= canvas.width; x += 3) {
        const y =
          waveY - 20 +
          Math.sin(x * 0.011 + t * 0.5 + 1.2) * 12 +
          Math.sin(x * 0.006 + t * 0.35) * 22
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(38, 167, 255, 0.08)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      animFrame = requestAnimationFrame(draw)
    }

    animFrame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  const delay = (ms: number) => `${ms}ms`

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#07070A]">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Vignette overlay */}
      <div className="absolute inset-0 z-[1]"
        style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #07070A 100%)',
        }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-[1]"
        style={{ background: 'linear-gradient(to bottom, transparent, #07070A)' }}
      />

      {/* Main content */}
      <div className="relative z-10 h-full flex items-center px-10 sm:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-5xl">
          <div
            className="transition-all duration-700"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(18px)',
              transitionDelay: delay(100),
            }}
          >
            <div className="mb-6">
              <span className="blue-label uppercase tracking-[0.2em] text-[#26A7FF]/80">
                AI &amp; Product Engineer
              </span>
            </div>

            <div className="mb-0">
              <h1
                className="font-display uppercase leading-none text-[#EEEAE0]"
                style={{
                  fontSize: 'clamp(36px, 5vw, 72px)',
                  letterSpacing: '0.045em',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  textShadow: '0 0 18px rgba(238,234,224,0.08)',
                }}
              >
                MALAVIKA
              </h1>
            </div>

            <div className="mb-8">
              <h1
                className="font-display uppercase leading-none"
                style={{
                  fontSize: 'clamp(36px, 5vw, 72px)',
                  letterSpacing: '0.045em',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  color: '#26A7FF',
                  textShadow: '0 0 22px rgba(38,167,255,0.32)',
                }}
              >
                LOGANATHAN
              </h1>
            </div>

            <div className="mb-10 max-w-lg">
              <p className="font-sans font-semibold text-white/85 text-sm sm:text-base leading-relaxed">
                Building AI systems that disappear into the workflow. Shipping products that redefine what teams can do at scale.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <a
                href="/Malavika-Loganathan-Resume.pdf"
                download="Malavika-Loganathan-Resume.pdf"
                data-magnetic
                data-hover
                className="font-sans font-bold text-sm tracking-[0.08em] uppercase text-[#07070A] bg-[#26A7FF] px-7 sm:px-9 py-3.5 sm:py-4 inline-block hover:bg-white transition-colors duration-300"
              >
                Download Resume
              </a>
              <a
                href="#contact"
                data-hover
                className="font-sans font-bold text-sm tracking-[0.08em] uppercase text-white/85 border-b border-white/30 pb-0.5 hover:text-white hover:border-white/70 transition-all duration-300"
              >
                Get In Touch
              </a>
            </div>
          </div>

        </div>
      </div>

    </section>
  )
}
