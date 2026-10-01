import type { Applicant, ApplicantStats } from '../../types'
import StatusBadge from './StatusBadge'
import { formatCompact, formatDate, avatarColor, initials } from '../../utils/ui'

interface StatusOverviewProps {
  stats: ApplicantStats
  applicants: Applicant[]
  onSelect: (applicant: Applicant) => void
  onShowAll: () => void
}

export default function StatusOverview({
  stats,
  applicants,
  onSelect,
  onShowAll,
}: StatusOverviewProps) {
  const total = Math.max(stats.total, 1)

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white/70">
            Distribución de estados
          </h2>
          <span className="text-xs text-white/60">{stats.total} en total</span>
        </div>

        <div className="mt-6 space-y-5">
          {stats.statusList.map((item) => {
            const pct = Math.round((item.count / total) * 100)
            return (
              <div key={item.key}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-white/65">
                    <span className={`h-2 w-2 rounded-full ${item.dot}`} />
                    {item.label}
                  </span>
                  <span className="font-display font-semibold text-white">
                    {item.count} <span className="text-white/55">· {pct}%</span>
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-ink-950">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.key === 'aprobado' ? 'from-emerald-400 to-emerald-600' : item.key === 'contactado' ? 'from-sky-400 to-sky-600' : item.key === 'rechazado' ? 'from-rose-400 to-rose-600' : 'from-amber-300 to-amber-500'} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-7 rounded-xl border border-brand-400/25 bg-brand-500/10 p-4 text-xs leading-relaxed text-white/60">
          <span className="font-semibold text-brand-200">Tip:</span> prioriza contactar a los
          pendientes con más de 100k seguidores: suelen responder en menos de 24 horas.
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-white/70">
            Últimas postulaciones
          </h2>
          <button onClick={onShowAll} className="text-xs font-medium text-brand-300 transition hover:text-glow">
            Ver todas →
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {[...applicants]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item)}
                className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-ink-950/40 px-4 py-3 text-left transition hover:border-brand-400/30 hover:bg-brand-500/5"
              >
                <span
                  className={`grid h-10 w-10 flex-none place-items-center rounded-xl bg-gradient-to-br ${avatarColor(
                    item.name,
                  )} font-display text-xs font-bold text-white`}
                >
                  {initials(item.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-sm font-semibold text-white">{item.name}</span>
                  <span className="block text-xs text-white/60">
                    {item.handle} · {formatCompact(item.followers)} seguidores · {formatDate(item.createdAt)}
                  </span>
                </span>
                <StatusBadge status={item.status} />
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
