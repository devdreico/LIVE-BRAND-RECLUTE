import { useEffect, useRef, useState } from 'react'
import { avatarColor, initials } from '../../utils/ui'
import { LogoMark } from '../Logo'
import HeroBackdrop from './HeroBackdrop'

const highlights = [
  '+320 creadores',
  '9.4M vistas/mes',
  'Equipos por categoría',
  'Pagos semanales',
]

const proofAvatars = [
  'Luna Vargas',
  'Mateo Cruz',
  'Sofía Rivas',
  'Kevin Ortiz',
  'Valentina Mora',
]

const proofStats = [
  '92% de aprobación en postulaciones',
  '+3.400 h de live gestionadas al mes',
  'Respuesta habitual en <48 h',
]

const heroStats = [
  { value: 3.4, suffix: 'x', decimals: 1, label: 'Crecimiento medio de views en 90 días' },
  { value: 78, suffix: '%', decimals: 0, label: 'De creadores supera su récord de regalos' },
]

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

interface CountUpProps {
  value: number
  suffix: string
  decimals: number
}

function CountUp({ value, suffix, decimals }: CountUpProps) {
  const [display, setDisplay] = useState(value)
  const frameRef = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const duration = 1100
    const start = performance.now()
    setDisplay(0)

    const step = (now: number): void => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(value * eased)
      if (progress < 1) frameRef.current = window.requestAnimationFrame(step)
    }

    frameRef.current = window.requestAnimationFrame(step)
    return () => window.cancelAnimationFrame(frameRef.current)
  }, [value])

  return (
    <span>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

interface HeroProps {
  onApply: () => void
}

export default function Hero({ onApply }: HeroProps) {
  return (
    <section className="relative overflow-hidden pb-24 pt-36">
      <div className="pointer-events-none absolute inset-0">
        <HeroBackdrop />
      </div>
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-600/30 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-glow/20 blur-[120px]" />

      <div className="container-page relative text-center">
        <div className="mx-auto mb-8 flex animate-fade-up flex-col items-center justify-center gap-4">
          <LogoMark
            tone="dark"
            className="h-20 w-20 drop-shadow-[0_0_24px_rgba(217,70,239,0.55)]"
          />
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-ink-900/70 px-4 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-200 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-glow" />
            Agencia oficial de TikTok LIVE · LATAM
          </span>
        </div>

        <span className="eyebrow animate-fade-up">
          <span className="h-2 w-2 animate-pulse-glow rounded-full bg-glow" />
          Reclutamiento abierto · Temporada 2026
        </span>

        <h1 className="mx-auto mt-8 max-w-5xl animate-fade-up font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-8xl">
          Convierte tus{' '}
          <span className="bg-gradient-to-r from-brand-300 via-glow to-brand-400 bg-clip-text text-transparent">
            lives en TikTok
          </span>{' '}
          en un negocio real
        </h1>

        <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-base leading-relaxed text-white/60 sm:text-lg">
          Live Brand es la agencia oficial de TikTok LIVE en LATAM: tomamos a creadores que ya hacen
          lives y los formamos con clases y asesorías gratuitas de profesionales de la plataforma y
          de crecimiento digital, para que cada live tenga más vistas, más regalos y más diamantes.
        </p>

        <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row">
          <button onClick={onApply} className="btn-primary">
            Postularme gratis
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <a href="#como-funciona" className="btn-ghost">
            Ver el plan de reclutamiento
          </a>
        </div>

        <p className="mx-auto mt-5 max-w-xl animate-fade-up text-sm font-medium leading-relaxed text-brand-200">
          Inscripción 100% gratuita · Te contactamos en menos de 48 h (máximo 3 días) un pilar de la
          agencia
        </p>

        <div className="mx-auto mt-8 flex max-w-3xl animate-fade-up flex-col items-center justify-center gap-5 sm:flex-row sm:gap-7">
          <div className="flex flex-none -space-x-3" aria-hidden="true">
            {proofAvatars.map((name) => (
              <span
                key={name}
                className={`grid h-9 w-9 place-items-center rounded-full border-2 border-ink-900 bg-gradient-to-br ${avatarColor(
                  name,
                )} font-display text-[10px] font-bold text-white shadow-glow-sm`}
              >
                {initials(name)}
              </span>
            ))}
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/70 sm:text-sm">
            {proofStats.map((stat) => (
              <li key={stat} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-glow" aria-hidden="true" />
                {stat}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto mt-14 flex max-w-3xl animate-fade-up flex-wrap items-center justify-center gap-3">
          {highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-display text-xs font-medium text-white/70"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="card overflow-hidden p-1 shadow-card">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-ink-800 via-ink-900 to-ink-800 px-6 py-10 sm:px-12 sm:py-14">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.35),transparent_60%)]" />
              <div className="relative grid gap-6 sm:grid-cols-3">
                {heroStats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-ink-950/50 p-5 text-left backdrop-blur"
                  >
                    <div className="font-display text-3xl font-bold text-brand-300">
                      <CountUp
                        value={item.value}
                        suffix={item.suffix}
                        decimals={item.decimals}
                      />
                    </div>
                    <div className="mt-2 text-sm leading-snug text-white/60">{item.label}</div>
                  </div>
                ))}
                <div className="rounded-2xl border border-white/10 bg-ink-950/50 p-5 text-left backdrop-blur sm:col-span-1">
                  <div className="font-display text-3xl font-bold text-brand-300">24/7</div>
                  <div className="mt-2 text-sm leading-snug text-white/60">
                    Soporte de equipo durante tus transmisiones
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
