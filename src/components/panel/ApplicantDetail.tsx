import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Applicant, Status } from '../../types'
import StatusBadge from './StatusBadge'
import { useApplicants } from '../../hooks/useApplicants'
import { STATUS_ORDER, STATUSES, avatarColor, formatCompact, formatDate, initials } from '../../utils/ui'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

const UNDO_DURATION_MS = 5000

type CopiedField = 'email' | 'phone'

function Row({ label, value, action }: { label: string; value?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-3 last:border-0">
      <span className="text-xs uppercase tracking-wider text-white/60">{label}</span>
      <span className="flex items-center justify-end gap-2 text-right text-sm font-medium text-white">
        <span className="min-w-0 break-all">{value || '—'}</span>
        {action}
      </span>
    </div>
  )
}

function tiktokUrl(handle: string): string {
  return `https://www.tiktok.com/${handle.replace(/^@+/, '')}`
}

function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function writeClipboard(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // Continúa con el fallback clásico.
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    textarea.remove()
    return ok
  } catch {
    return false
  }
}

interface ApplicantDetailProps {
  applicant: Applicant | null
  onClose: () => void
  onStatusChange: (id: string, status: Status) => void
  onDelete: (id: string) => void
}

export default function ApplicantDetail({ applicant, onClose, onStatusChange, onDelete }: ApplicantDetailProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const [confirming, setConfirming] = useState(false)
  const [copied, setCopied] = useState<CopiedField | null>(null)
  const [undo, setUndo] = useState<{ message: string; previous: Status } | null>(null)
  const undoTimer = useRef<number | null>(null)

  const { applicants } = useApplicants()

  const applicantId = applicant?.id

  // El objeto recibido por props puede quedar desactualizado tras cambiar el estado:
  // se lee la versión viva desde el store compartido.
  const current = useMemo(() => {
    if (!applicant) return null
    return applicants.find((item) => item.id === applicant.id) ?? applicant
  }, [applicants, applicant])

  const clearUndoTimer = useCallback(() => {
    if (undoTimer.current !== null) {
      window.clearTimeout(undoTimer.current)
      undoTimer.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearUndoTimer()
    }
  }, [clearUndoTimer])

  useEffect(() => {
    if (!applicantId) return

    setConfirming(false)
    setCopied(null)
    setUndo(null)
    clearUndoTimer()

    previouslyFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== 'Tab') return
      const panel = panelRef.current
      if (!panel) return

      const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusables.length === 0) return

      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (!first || !last) return

      const active = document.activeElement
      const inside = active instanceof Node && panel.contains(active)

      if (event.shiftKey && (!inside || active === first)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused.current?.focus()
    }
  }, [applicantId, clearUndoTimer])

  if (!applicant || !current) return null

  const history = [...(current.history ?? [])].reverse()

  const changeStatus = (next: Status): void => {
    const previous = current.status
    onStatusChange(current.id, next)
    if (previous === next) return
    clearUndoTimer()
    setUndo({ message: `Estado cambiado a ${STATUSES[next].label}`, previous })
    undoTimer.current = window.setTimeout(() => {
      setUndo(null)
      undoTimer.current = null
    }, UNDO_DURATION_MS)
  }

  const handleUndo = (): void => {
    if (!undo) return
    onStatusChange(current.id, undo.previous)
    clearUndoTimer()
    setUndo(null)
  }

  const handleCopy = async (field: CopiedField, value: string): Promise<void> => {
    const ok = await writeClipboard(value)
    if (ok) setCopied(field)
  }

  const copyButtonClass =
    'rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-medium text-white/60 transition hover:border-brand-400/50 hover:text-white'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="applicant-dialog-title"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="max-h-[92vh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-t-3xl border border-white/10 bg-ink-800 shadow-glow-lg focus:outline-none sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`relative h-24 bg-gradient-to-br ${avatarColor(current.name)} opacity-90`}>
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
                current.name,
              )} font-display text-xl font-bold text-white shadow-glow-sm`}
            >
              {initials(current.name)}
            </span>
            <div className="pb-1">
              <h2 id="applicant-dialog-title" className="font-display text-xl font-bold text-white">
                {current.name}
              </h2>
              <p className="text-sm">
                <a
                  href={tiktokUrl(current.handle)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-brand-300 underline-offset-2 transition hover:text-glow hover:underline"
                >
                  {current.handle}
                  <span className="sr-only"> — ver perfil en TikTok (se abre en una pestaña nueva)</span>
                </a>
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <StatusBadge status={current.status} />
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              {current.category || 'Sin categoría'}
            </span>
            <span className="text-xs text-white/60">Postulado {formatDate(current.createdAt)}</span>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { value: formatCompact(current.followers), label: 'Seguidores' },
              { value: formatCompact(current.avgViewers), label: 'Viewers' },
              { value: `${current.hoursPerWeek || 0}h`, label: 'Por semana' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-ink-950/50 px-3 py-3 text-center">
                <div className="font-display text-lg font-bold text-white">{item.value}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wide text-white/60">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Row
              label="Email"
              value={current.email}
              action={
                <>
                  <button
                    type="button"
                    onClick={() => handleCopy('email', current.email)}
                    className={copyButtonClass}
                    aria-label={`Copiar email de ${current.name}`}
                  >
                    Copiar
                  </button>
                  <span role="status" className="text-[11px] font-semibold text-emerald-300">
                    {copied === 'email' ? 'Copiado' : ''}
                  </span>
                </>
              }
            />
            <Row
              label="Teléfono"
              value={current.phone}
              action={
                current.phone ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCopy('phone', current.phone ?? '')}
                      className={copyButtonClass}
                      aria-label={`Copiar teléfono de ${current.name}`}
                    >
                      Copiar
                    </button>
                    <span role="status" className="text-[11px] font-semibold text-emerald-300">
                      {copied === 'phone' ? 'Copiado' : ''}
                    </span>
                  </>
                ) : undefined
              }
            />
            <Row label="Disponibilidad" value={current.availability} />
            <Row label="Plataforma" value={current.platform || 'TikTok'} />
            <Row label="Notas" value={current.note} />
          </div>

          <div className="mt-7">
            <span className="label">Cambiar estado</span>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_ORDER.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => changeStatus(key)}
                  aria-pressed={current.status === key}
                  className={`rounded-xl border px-3 py-2.5 font-display text-xs font-semibold transition ${
                    current.status === key
                      ? 'border-brand-400 bg-brand-500/25 text-white shadow-glow-sm'
                      : 'border-white/10 text-white/60 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {STATUSES[key].label}
                </button>
              ))}
            </div>

            {undo && (
              <div
                role="status"
                aria-live="polite"
                className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-brand-400/30 bg-brand-500/10 px-4 py-2.5"
              >
                <span className="text-sm text-white">{undo.message}</span>
                <span aria-hidden="true" className="text-white/40">
                  ·
                </span>
                <button
                  type="button"
                  onClick={handleUndo}
                  className="font-display text-sm font-semibold text-brand-200 transition hover:text-white"
                >
                  Deshacer
                </button>
              </div>
            )}
          </div>

          <div className="mt-7">
            <span className="label">Historial de cambios</span>
            {history.length > 0 ? (
              <ol className="space-y-2">
                {history.map((entry, index) => (
                  <li
                    key={`${entry.at}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-ink-950/40 px-3 py-2"
                  >
                    <span className="flex items-center gap-2 text-xs text-white/75">
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUSES[entry.status].dot}`} />
                      {STATUSES[entry.status].label}
                    </span>
                    <time dateTime={entry.at} className="text-[11px] text-white/55">
                      {formatDateTime(entry.at)}
                    </time>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-white/60">Sin cambios registrados todavía.</p>
            )}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={onClose} className="btn-ghost flex-1 !py-2.5 text-xs">
              Cerrar
            </button>

            {confirming ? (
              <div className="flex-1 rounded-2xl border border-rose-400/40 bg-rose-500/10 p-3" role="group" aria-label="Confirmar eliminación">
                <p className="text-xs font-medium text-rose-200">
                  ¿Seguro? Esta acción no se puede deshacer.
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(current.id)
                      onClose()
                    }}
                    className="flex-1 rounded-full border border-rose-400/40 bg-rose-500/20 px-4 py-2 font-display text-xs font-semibold text-rose-100 transition hover:bg-rose-500/30"
                  >
                    Sí, eliminar
                  </button>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => setConfirming(false)}
                    className="flex-1 rounded-full border border-white/15 px-4 py-2 font-display text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="flex-1 rounded-full border border-rose-400/30 bg-rose-500/10 px-7 py-2.5 font-display text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20"
              >
                Eliminar postulante
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
