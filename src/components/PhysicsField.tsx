import { useEffect, useRef } from 'react'

interface PhysicsFieldProps {
  accent?: string
  variant?: 'orbit' | 'flow' | 'wave'
}

interface Particle {
  angle: number
  radius: number
  speed: number
  size: number
  phase: number
}

export default function PhysicsField({ accent = '#26A7FF', variant = 'orbit' }: PhysicsFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const particles: Particle[] = Array.from({ length: 42 }, (_, index) => ({
      angle: (index / 42) * Math.PI * 2,
      radius: 35 + Math.random() * 150,
      speed: 0.00012 + Math.random() * 0.00022,
      size: 0.7 + Math.random() * 1.8,
      phase: Math.random() * Math.PI * 2,
    }))
    let frame = 0
    let start = 0

    const resize = () => {
      const ratio = window.devicePixelRatio || 1
      const bounds = canvas.getBoundingClientRect()
      canvas.width = bounds.width * ratio
      canvas.height = bounds.height * ratio
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const draw = (time: number) => {
      if (!start) start = time
      const elapsed = time - start
      const { width, height } = canvas.getBoundingClientRect()
      const centerX = width * 0.72
      const centerY = height * 0.45
      context.clearRect(0, 0, width, height)

      context.strokeStyle = `${accent}18`
      context.lineWidth = 1
      for (let ring = 1; ring <= 3; ring += 1) {
        context.beginPath()
        context.ellipse(centerX, centerY, 48 + ring * 42, 26 + ring * 24, -0.25, 0, Math.PI * 2)
        context.stroke()
      }

      const positions: Array<{ x: number; y: number }> = []
      particles.forEach((particle, index) => {
        const orbit = particle.angle + elapsed * particle.speed
        const pulse = Math.sin(elapsed * 0.0014 + particle.phase) * 10
        const radius = particle.radius + pulse
        const x = centerX + Math.cos(orbit) * radius
        const y = centerY + Math.sin(orbit) * radius * 0.58
        positions.push({ x, y })

        context.beginPath()
        context.arc(x, y, particle.size, 0, Math.PI * 2)
        context.fillStyle = `${accent}${index % 3 === 0 ? 'cc' : '66'}`
        context.fill()
      })

      for (let index = 0; index < positions.length; index += 1) {
        const current = positions[index]
        const next = positions[(index + 7) % positions.length]
        const distance = Math.hypot(current.x - next.x, current.y - next.y)
        if (distance < 110) {
          context.beginPath()
          context.moveTo(current.x, current.y)
          context.lineTo(next.x, next.y)
          context.strokeStyle = `${accent}${variant === 'flow' ? '28' : '14'}`
          context.stroke()
        }
      }

      if (variant === 'wave') {
        context.beginPath()
        for (let x = 0; x <= width; x += 4) {
          const y = height * 0.72 + Math.sin(x * 0.018 + elapsed * 0.001) * 18 + Math.sin(x * 0.006 - elapsed * 0.0007) * 24
          x === 0 ? context.moveTo(x, y) : context.lineTo(x, y)
        }
        context.strokeStyle = `${accent}45`
        context.stroke()
      }

      frame = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [accent, variant])

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-90" />
}
