import StatusBadge from './StatusBadge.jsx'
import { STATUS_ORDER, STATUSES, avatarColor, formatCompact, formatDate } from '../../utils/ui.js'

function initials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <span className="text-xs uppercase tracking-wider text-white/40">{label}</span>
      <span className="text-right text-sm font-medium text-white">{value || '—'}</span>
    </div>
  )
}

export default function ApplicantDetail({ applicant, onClose, onStatusChange, onDelete }) {
  if (!applicant) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[92vh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-800 shadow-glow-lg sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`relative h-24 bg-gradient-to-br ${avatarColor(applicant.name)} opacity-90`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.3),transparent_55%)]" />
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-ink-950/60 text-white transition hover:bg-ink-950/90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-9 flex items-end gap-4">
            <span
              className={`grid h-[72px] w-[72px] place-items-center rounded-2xl border-4 border-ink-800 bg-gradient-to-br ${avatarColor(
                applicant.name,
              )} font-display text-xl font-bold text-white shadow-glow-sm`}
            >
              {initials(applicant.name)}
            </span>
            <div className="pb-1">
              <h2 className="font-display text-xl font-bold text-white">{applicant.name}</h2>
              <p className="text-sm text-brand-300">{applicant.handle}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <StatusBadge status={applicant.status} />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              {applicant.category || 'Sin categoría'}
            </span>
            <span className="text-xs text-white/40">Postulado {formatDate(applicant.createdAt)}</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { value: formatCompact(applicant.followers), label: 'Seguidores' },
              { value: formatCompact(applicant.avgViewers), label: 'Viewers' },
              { value: `${applicant.hoursPerWeek || 0}h`, label: 'Por semana' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-ink-950/50 px-3 py-3 text-center">
                <div className="font-display text-lg font-bold text-white">{item.value}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wide text-white/40">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Row label="Email" value={applicant.email} />
            <Row label="Teléfono" value={applicant.phone} />
            <Row label="Disponibilidad" value={applicant.availability} />
            <Row label="Plataforma" value={applicant.platform || 'TikTok'} />
            <Row label="Notas" value={applicant.note} />
          </div>

          <div className="mt-7">
            <span className="label">Cambiar estado</span>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_ORDER.map((key) => (
                <button
                  key={key}
                  onClick={() => onStatusChange(applicant.id, key)}
                  className={`rounded-xl border px-3 py-2.5 font-display text-xs font-semibold transition ${
                    applicant.status === key
                      ? 'border-brand-400 bg-brand-500/25 text-white shadow-glow-sm'
                      : 'border-white/10 text-white/60 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {STATUSES[key].label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-7 flex gap-3">
            <button onClick={onClose} className="btn-ghost flex-1 !py-2.5 text-xs">
              Cerrar
            </button>
            <button
              onClick={() => {
                onDelete(applicant.id)
                onClose()
              }}
              className="flex-1 rounded-full border border-rose-400/30 bg-rose-500/10 px-7 py-2.5 font-display text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
            >
              Eliminar postulante
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
