import { formatCompact } from '../../utils/ui.js'

function Sparkline({ values, color = '#C084FC' }) {
  const max = Math.max(...values, 1)
  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100
      const y = 40 - (value / max) * 34
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 100 44" className="h-11 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,44 ${points} 100,44`} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const cards = [
  { key: 'total', label: 'Postulantes', hint: 'Total recibidos', color: '#C084FC', series: [3, 5, 4, 7, 6, 9, 12] },
  { key: 'aprobado', label: 'Aprobados', hint: 'Incorporados al squad', color: '#34D399', series: [1, 2, 2, 3, 4, 5, 6] },
  { key: 'conversion', label: 'Conversión', hint: 'Sobre resueltas', color: '#D946EF', series: [40, 45, 52, 48, 58, 62, 70] },
  { key: 'pendiente', label: 'Pendientes', hint: 'Por revisar hoy', color: '#FBBF24', series: [2, 4, 3, 5, 4, 3, 4] },
]

export default function KpiCards({ stats, applicants }) {
  const values = {
    total: stats.total,
    aprobado: stats.byStatus.aprobado,
    conversion: `${stats.conversion}%`,
    pendiente: stats.byStatus.pendiente,
  }

  const week = [...applicants]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .reduce((acc, item) => {
      const day = new Date(item.createdAt).toLocaleDateString('es', { weekday: 'short' })
      acc[day] = (acc[day] || 0) + 1
      return acc
    }, {})

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="group rounded-2xl border border-white/10 bg-ink-800/60 p-5 transition hover:border-brand-400/40 hover:shadow-card"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/40">{card.label}</div>
              <div className="mt-2 font-display text-3xl font-extrabold text-white">{values[card.key]}</div>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/45">
              {card.hint}
            </span>
          </div>
          <div className="mt-4">
            <Sparkline values={card.series} color={card.color} />
          </div>
        </div>
      ))}

      <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-5 sm:col-span-2 xl:col-span-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/40">Comunidad agregada</div>
            <div className="mt-2 flex flex-wrap gap-6">
              <div>
                <span className="font-display text-2xl font-bold text-white">{formatCompact(stats.followers)}</span>
                <span className="ml-2 text-sm text-white/45">seguidores</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-white">{formatCompact(stats.avgViewers)}</span>
                <span className="ml-2 text-sm text-white/45">viewers promedio</span>
              </div>
              <div>
                <span className="font-display text-2xl font-bold text-white">{formatCompact(stats.hours)}h</span>
                <span className="ml-2 text-sm text-white/45">en vivo por semana</span>
              </div>
            </div>
          </div>
          <div className="text-right text-xs text-white/45">
            <div className="font-display text-sm font-semibold text-brand-200">Actividad semanal</div>
            <div className="mt-1">{Object.entries(week).map(([day, count]) => `${day}: ${count}`).join(' · ') || 'Sin datos'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
