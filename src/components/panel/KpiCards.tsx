import { useMemo } from 'react'
import type { Applicant, ApplicantStats } from '../../types'
import { formatCompact } from '../../utils/ui'

interface SparklineProps {
  values: number[]
  color?: string
  label: string
}

function Sparkline({ values, color = '#C084FC', label }: SparklineProps) {
  const max = Math.max(...values, 1)
  const points = values
    .map((value, index) => {
      const x = values.length > 1 ? (index / (values.length - 1)) * 100 : 50
      const y = 40 - (value / max) * 34
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg
      viewBox="0 0 100 44"
      className="h-11 w-full"
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,44 ${points} 100,44`} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type CardKey = 'total' | 'aprobado' | 'conversion' | 'pendiente'

const cards: { key: CardKey; label: string; hint: string; color: string }[] = [
  { key: 'total', label: 'Postulantes', hint: 'Últimos 7 días', color: '#C084FC' },
  { key: 'aprobado', label: 'Aprobados', hint: 'Acumulado', color: '#34D399' },
  { key: 'conversion', label: 'Conversión', hint: 'Sobre resueltas', color: '#D946EF' },
  { key: 'pendiente', label: 'Pendientes', hint: 'Acumulado', color: '#FBBF24' },
]

function lastDays(count: number): Date[] {
  const days: Date[] = []
  for (let i = count - 1; i >= 0; i -= 1) {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    day.setDate(day.getDate() - i)
    days.push(day)
  }
  return days
}

function createdBefore(applicant: Applicant, limit: Date): boolean {
  return new Date(applicant.createdAt).getTime() < limit.getTime() + 86400000
}

interface KpiCardsProps {
  stats: ApplicantStats
  applicants: Applicant[]
}

export default function KpiCards({ stats, applicants }: KpiCardsProps) {
  const series = useMemo(() => {
    const days = lastDays(7)
    const createdPerDay = days.map((day) =>
      applicants.filter((item) => new Date(item.createdAt).toDateString() === day.toDateString()).length,
    )
    const cumulative = (match: (item: Applicant) => boolean) =>
      days.map((day) => applicants.filter((item) => match(item) && createdBefore(item, day)).length)

    const approvedSeries = cumulative((item) => item.status === 'aprobado')
    const resolvedSeries = cumulative((item) => item.status === 'aprobado' || item.status === 'rechazado')
    const pendingSeries = cumulative((item) => item.status === 'pendiente')
    const conversionSeries = resolvedSeries.map((resolved, index) =>
      resolved ? Math.round((approvedSeries[index] / resolved) * 100) : 0,
    )

    return {
      total: createdPerDay,
      aprobado: approvedSeries,
      conversion: conversionSeries,
      pendiente: pendingSeries,
    }
  }, [applicants])

  const values: Record<CardKey, string | number> = {
    total: stats.total,
    aprobado: stats.byStatus.aprobado,
    conversion: `${stats.conversion}%`,
    pendiente: stats.byStatus.pendiente,
  }

  const week = useMemo(
    () =>
      [...applicants]
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .reduce<Record<string, number>>((acc, item) => {
          const day = new Date(item.createdAt).toLocaleDateString('es', { weekday: 'short' })
          acc[day] = (acc[day] ?? 0) + 1
          return acc
        }, {}),
    [applicants],
  )

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="group rounded-2xl border border-white/10 bg-ink-800/60 p-5 transition hover:border-brand-400/40 hover:shadow-card"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/60">{card.label}</div>
              <div className="mt-2 font-display text-3xl font-extrabold text-white">
                {values[card.key]}
              </div>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/60">
              {card.hint}
            </span>
          </div>
          <div className="mt-4">
            <Sparkline
              values={series[card.key]}
              color={card.color}
              label={`Serie de ${card.label.toLowerCase()} de los últimos 7 días`}
            />
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-5 sm:col-span-2 xl:col-span-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/60">Comunidad agregada</div>
            <div className="mt-2 flex flex-wrap gap-6">
              <div>
                <span className="font-display text-2xl font-bold text-white">
                  {formatCompact(stats.followersSum)}
                </span>
                <span className="ml-2 text-sm text-white/60">seguidores</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-white">
                  {formatCompact(stats.avgViewers)}
                </span>
                <span className="ml-2 text-sm text-white/60">viewers promedio</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-white">
                  {formatCompact(stats.hoursSum)}h
                </span>
                <span className="ml-2 text-sm text-white/60">en vivo por semana</span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-white/60">
            <div className="font-display text-sm font-semibold text-brand-200">Actividad semanal</div>
            <div className="mt-1">
              {Object.entries(week)
                .map(([day, count]) => `${day}: ${count}`)
                .join(' · ') || 'Sin datos'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
