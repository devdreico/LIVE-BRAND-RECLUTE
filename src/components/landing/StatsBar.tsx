import type { ApplicantStats } from '../../types'
import { formatCompact } from '../../utils/ui'
import { LogoMark } from '../Logo'

interface StatsBarProps {
  stats: ApplicantStats
}

export default function StatsBar({ stats }: StatsBarProps) {
  const items = [
    {
      value: formatCompact(stats.total),
      label: 'Postulantes recibidos',
      hint: 'En la convocatoria actual',
    },
    {
      value: formatCompact(stats.byStatus.aprobado),
      label: 'Creadores aprobados',
      hint: 'Incorporados a la agencia',
    },
    {
      value: `${stats.conversion}%`,
      label: 'Tasa de conversión',
      hint: 'Sobre postulaciones resueltas',
    },
    {
      value: formatCompact(stats.followersSum),
      label: 'Seguidores sumados',
      hint: 'Comunidad de nuestros creadores',
    },
  ]

  return (
    <section id="metricas" className="relative scroll-mt-24 py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-brand-400/25 bg-gradient-to-br from-ink-800 via-ink-700/60 to-ink-800 px-6 py-14 shadow-card sm:px-12">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-glow/25 blur-[110px]" />
          <LogoMark
            tone="dark"
            className="pointer-events-none absolute right-6 top-6 h-24 w-24 opacity-[0.07] sm:h-32 sm:w-32"
            alt=""
          />

          <div className="relative text-center">
            <span className="eyebrow">
              <LogoMark tone="dark" className="h-4 w-4" alt="" />
              Métricas en vivo
            </span>
            <h2 className="section-title mt-6">Los números de nuestra comunidad</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/55">
              Actualizados con cada postulación que entra a la convocatoria de Live Brand.
            </p>
          </div>

          <div className="relative mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-ink-950/60 p-6 text-center backdrop-blur transition hover:border-brand-400/40"
              >
                <div className="bg-gradient-to-r from-brand-300 to-glow bg-clip-text font-display text-4xl font-extrabold text-transparent">
                  {item.value}
                </div>
                <div className="mt-3 font-display text-sm font-semibold text-white">{item.label}</div>
                <div className="mt-1 text-xs text-white/60">{item.hint}</div>
              </div>
            ))}
          </div>

          <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse-glow rounded-full bg-emerald-400" />
              {stats.byStatus.pendiente} postulaciones pendientes de revisión
            </span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <span>{stats.byStatus.contactado} creadores en contacto</span>
            <span className="hidden h-4 w-px bg-white/15 sm:block" />
            <span>{formatCompact(stats.hoursSum)}h/semana de transmisiones</span>
          </div>
        </div>
      </div>
    </section>
  )
}
