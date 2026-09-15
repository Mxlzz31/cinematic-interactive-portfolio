import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  life: number
  size: number
  vx: number
  vy: number
}

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -400, y: -400 })
  const dotPos = useRef({ x: -400, y: -400 })
  const ringPos = useRef({ x: -400, y: -400 })
  const particles = useRef<Particle[]>([])
  const raf = useRef(0)
  const isDown = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMove = (e: MouseEvent) => {
      let mx = e.clientX
      let my = e.clientY

      // Magnetic pull toward [data-magnetic] elements
      document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach(el => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
        if (dist < 110) {
          const f = (1 - dist / 110) * 0.38
          mx += (cx - e.clientX) * f
          my += (cy - e.clientY) * f
        }
      })

      mouse.current = { x: mx, y: my }

      // Spawn particles
      if (Math.random() > 0.35) {
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          life: 1,
          size: Math.random() * 2.5 + 0.5,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5 - 0.8,
        })
        if (particles.current.length > 90) particles.current.shift()
      }
    }

    const setHover = (on: boolean) => {
      if (!dotRef.current || !ringRef.current) return
      if (on) {
        dotRef.current.style.transform = 'translate(-50%, -50%) scale(0)'
        dotRef.current.style.opacity = '0'
        ringRef.current.style.transform = 'translate(-50%, -50%) scale(2)'
        ringRef.current.style.borderColor = 'rgba(200, 255, 0, 0.9)'
      } else {
        dotRef.current.style.transform = 'translate(-50%, -50%) scale(1)'
        dotRef.current.style.opacity = '1'
        ringRef.current.style.transform = 'translate(-50%, -50%) scale(1)'
        ringRef.current.style.borderColor = 'rgba(200, 255, 0, 0.45)'
      }
    }

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-hover]')) setHover(true)
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-hover]')) setHover(false)
    }
    const onDown = () => {
      isDown.current = true
      if (ringRef.current) ringRef.current.style.transform = 'translate(-50%, -50%) scale(0.8)'
    }
    const onUp = () => {
      isDown.current = false
      if (ringRef.current) ringRef.current.style.transform = 'translate(-50%, -50%) scale(1)'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const tick = () => {
      // Lerp positions
      dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.2
      dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.2
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.09
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.09

      if (dotRef.current) {
        dotRef.current.style.left = `${dotPos.current.x}px`
        dotRef.current.style.top = `${dotPos.current.y}px`
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`
        ringRef.current.style.top = `${ringPos.current.y}px`
      }

      // Draw particles
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.current = particles.current.filter(p => p.life > 0.01)

      for (const p of particles.current) {
        p.life -= 0.028
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96

        const r = p.size * p.life
        if (r <= 0) continue

        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 255, 0, ${p.life * 0.65})`
        ctx.fill()
      }

      raf.current = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
      />
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9998]"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#26A7FF',
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
          left: -400,
          top: -400,
        }}
      />
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9997]"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(200, 255, 0, 0.45)',
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s ease',
          left: -400,
          top: -400,
        }}
      />
    </>
  )
}
