import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  life: number
  size: number
  vx: number
  vy: number
}

interface MagnetTarget {
  cx: number
  cy: number
}

const MAGNET_RADIUS = 110

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const dotScaleRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringScaleRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: -400, y: -400 })
  const ringPos = useRef({ x: -400, y: -400 })
  const particles = useRef<Particle[]>([])
  const raf = useRef(0)

  const [enabled, setEnabled] = useState(false)

  // Pointer-driven only: no custom cursor on touch, or when motion is reduced.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setEnabled(fine.matches && !still.matches)
    sync()
    fine.addEventListener('change', sync)
    still.addEventListener('change', sync)
    return () => {
      fine.removeEventListener('change', sync)
      still.removeEventListener('change', sync)
    }
  }, [])

  // Hide the native pointer only while the custom one is live.
  useEffect(() => {
    document.documentElement.classList.toggle('custom-cursor', enabled)
    return () => document.documentElement.classList.remove('custom-cursor')
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    // Magnet centres are cached: measuring every [data-magnetic] element on
    // every mousemove forced a layout per event, which is what made this drag.
    let magnets: MagnetTarget[] = []
    const measureMagnets = () => {
      magnets = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]')).map(el => {
        const r = el.getBoundingClientRect()
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 }
      })
    }
    measureMagnets()

    let remeasureQueued = false
    const queueRemeasure = () => {
      if (remeasureQueued) return
      remeasureQueued = true
      requestAnimationFrame(() => {
        remeasureQueued = false
        measureMagnets()
      })
    }

    const onResize = () => {
      resize()
      queueRemeasure()
    }
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('scroll', queueRemeasure, { passive: true })

    // The move handler now only records the pointer and spawns particles.
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

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

    // Scale and colour live on inner elements so they can transition without
    // fighting the transform that positions the outer ones every frame.
    const setHover = (on: boolean) => {
      if (!dotScaleRef.current || !ringScaleRef.current) return
      dotScaleRef.current.style.transform = on ? 'scale(0)' : 'scale(1)'
      dotScaleRef.current.style.opacity = on ? '0' : '1'
      ringScaleRef.current.style.transform = on ? 'scale(2)' : 'scale(1)'
      ringScaleRef.current.style.borderColor = on ? 'rgba(38, 167, 255, 0.95)' : 'rgba(38, 167, 255, 0.45)'
    }

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-hover]')) setHover(true)
    }
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button, [data-hover]')) setHover(false)
    }
    const onDown = () => {
      if (ringScaleRef.current) ringScaleRef.current.style.transform = 'scale(0.8)'
    }
    const onUp = () => {
      if (ringScaleRef.current) ringScaleRef.current.style.transform = 'scale(1)'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const tick = () => {
      const mx = mouse.current.x
      const my = mouse.current.y

      // The dot sits exactly on the pointer - no easing, no magnet offset.
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`
      }

      // Only the trailing ring is pulled toward magnetic targets, so the
      // effect survives without the dot ever drifting off the real pointer.
      let tx = mx
      let ty = my
      for (const m of magnets) {
        const dist = Math.hypot(mx - m.cx, my - m.cy)
        if (dist < MAGNET_RADIUS) {
          const f = (1 - dist / MAGNET_RADIUS) * 0.38
          tx += (m.cx - mx) * f
          ty += (m.cy - my) * f
        }
      }

      ringPos.current.x += (tx - ringPos.current.x) * 0.22
      ringPos.current.y += (ty - ringPos.current.y) * 0.22
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
      }

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
        ctx.fillStyle = `rgba(38, 167, 255, ${p.life * 0.65})`
        ctx.fill()
      }

      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', queueRemeasure)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999]" />

      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{ transform: 'translate3d(-400px, -400px, 0)', willChange: 'transform' }}
      >
        <div
          ref={dotScaleRef}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#26A7FF',
            marginLeft: -4,
            marginTop: -4,
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
          }}
        />
      </div>

      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9997]"
        style={{ transform: 'translate3d(-400px, -400px, 0)', willChange: 'transform' }}
      >
        <div
          ref={ringScaleRef}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '1px solid rgba(38, 167, 255, 0.45)',
            marginLeft: -20,
            marginTop: -20,
            transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), border-color 0.25s ease',
          }}
        />
      </div>
    </>
  )
}
