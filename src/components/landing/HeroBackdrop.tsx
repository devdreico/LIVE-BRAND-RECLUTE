import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  size: number
  speed: number
  drift: number
  phase: number
  hue: number
  alpha: number
  spin: number
  kind: 'gem' | 'dot'
}

const COLORS = ['#C084FC', '#A855F7', '#D946EF', '#E9D5FF', '#F0ABFC']

function makeParticles(width: number, height: number, count: number): Particle[] {
  return Array.from({ length: count }, () => {
    const size = 3 + Math.random() * 7
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      speed: 0.15 + Math.random() * 0.45,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      hue: Math.floor(Math.random() * COLORS.length),
      alpha: 0.25 + Math.random() * 0.55,
      spin: Math.random() * Math.PI * 2,
      kind: Math.random() > 0.35 ? 'gem' : 'dot',
    }
  })
}

function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle, time: number): void {
  const twinkle = 0.6 + 0.4 * Math.sin(time / 600 + particle.phase)
  ctx.save()
  ctx.globalAlpha = particle.alpha * twinkle
  ctx.translate(particle.x, particle.y)
  ctx.rotate(particle.spin + time / 4000)
  ctx.fillStyle = COLORS[particle.hue] ?? COLORS[0]

  if (particle.kind === 'gem') {
    const s = particle.size
    ctx.beginPath()
    ctx.moveTo(0, -s)
    ctx.lineTo(s * 0.75, 0)
    ctx.lineTo(0, s)
    ctx.lineTo(-s * 0.75, 0)
    ctx.closePath()
    ctx.fill()
    ctx.globalAlpha = particle.alpha * twinkle * 0.35
    ctx.fillStyle = '#FFFFFF'
    ctx.beginPath()
    ctx.moveTo(0, -s * 0.55)
    ctx.lineTo(s * 0.35, 0)
    ctx.lineTo(0, 0)
    ctx.closePath()
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.arc(0, 0, particle.size * 0.45, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

interface HeroBackdropProps {
  className?: string
}

export default function HeroBackdrop({ className = '' }: HeroBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let particles: Particle[] = []
    let raf = 0
    let width = 0
    let height = 0

    const resize = (): void => {
      const parent = canvas.parentElement
      if (!parent) return
      width = parent.clientWidth || window.innerWidth
      height = parent.clientHeight || window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.max(36, Math.min(90, Math.round((width * height) / 16000)))
      particles = makeParticles(width, height, count)
    }

    const render = (time: number): void => {
      ctx.clearRect(0, 0, width, height)
      for (const particle of particles) {
        drawParticle(ctx, particle, time)
      }
    }

    const tick = (time: number): void => {
      for (const particle of particles) {
        particle.y -= particle.speed
        particle.x += particle.drift + Math.sin(time / 1400 + particle.phase) * 0.25
        if (particle.y < -12) {
          particle.y = height + 12
          particle.x = Math.random() * width
        }
        if (particle.x < -12) particle.x = width + 12
        if (particle.x > width + 12) particle.x = -12
      }
      render(time)
      raf = window.requestAnimationFrame(tick)
    }

    resize()

    if (reduceMotion) {
      render(0)
    } else {
      raf = window.requestAnimationFrame(tick)
    }

    const onVisibility = (): void => {
      if (reduceMotion) return
      if (document.hidden) {
        window.cancelAnimationFrame(raf)
      } else {
        raf = window.requestAnimationFrame(tick)
      }
    }

    let resizeObserver: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resize()
        if (reduceMotion) render(0)
      })
      if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)
    } else {
      window.addEventListener('resize', resize)
    }

    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
      resizeObserver?.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
