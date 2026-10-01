import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Applicant, Status } from '../../types'
import { usePanelPrefs } from '../../hooks/usePanelPrefs'
import type { SortKey } from '../../hooks/usePanelPrefs'
import DataActions from './DataActions'
import StatusBadge from './StatusBadge'
import UndoToast from './UndoToast'
import {
  STATUSES,
  STATUS_ORDER,
  avatarColor,
  formatCompact,
  formatDate,
  initials,
  isStatus,
} from '../../utils/ui'

const SEARCH_DEBOUNCE_MS = 250
const TOAST_DURATION_MS = 5000

const checkboxClass =
  'h-4 w-4 flex-none cursor-pointer rounded border-white/25 bg-ink-950 text-brand-500 accent-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900'

const chipClass =
  'rounded-full border px-3 py-1.5 text-xs font-medium transition'

const rowActionClass =
  'rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-brand-400/40 hover:text-white'

interface ToastState {
  message: string
  undo: () => void
}

interface ApplicantsTableProps {
  applicants: Applicant[]
  onSelect: (applicant: Applicant) => void
  onStatusChange: (id: string, status: Status) => void
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      className={`grid h-10 w-10 flex-none place-items-center rounded-xl bg-gradient-to-br ${avatarColor(
        name,
      )} font-display text-xs font-bold text-white`}
    >
      {initials(name)}
    </span>
  )
}

function StatusSelect({
  applicant,
  onStatusChange,
}: {
  applicant: Applicant
  onStatusChange: (id: string, status: Status) => void
}) {
  return (
    <select
      className="input !w-auto !px-2.5 !py-1.5 text-xs"
      value={applicant.status}
      onChange={(event) => {
        if (isStatus(event.target.value)) onStatusChange(applicant.id, event.target.value)
      }}
      aria-label={`Cambiar estado de ${applicant.name}`}
    >
      {STATUS_ORDER.map((key) => (
        <option key={key} value={key}>
          {STATUSES[key].label}
        </option>
      ))}
    </select>
  )
}

export default function ApplicantsTable({ applicants, onSelect, onStatusChange }: ApplicantsTableProps) {
  const { prefs, updatePrefs } = usePanelPrefs()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selected, setSelected] = useState<ReadonlySet<string>>(() => new Set())
  const [toast, setToast] = useState<ToastState | null>(null)
  const toastTimer = useRef<number | null>(null)
  const headerCheckboxRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [query])

  const clearToastTimer = useCallback(() => {
    if (toastTimer.current !== null) {
      window.clearTimeout(toastTimer.current)
      toastTimer.current = null
    }
  }, [])

  const showToast = useCallback(
    (message: string, undo: () => void) => {
      clearToastTimer()
      setToast({ message, undo })
      toastTimer.current = window.setTimeout(() => {
        setToast(null)
        toastTimer.current = null
      }, TOAST_DURATION_MS)
    },
    [clearToastTimer],
  )

  const dismissToast = useCallback(() => {
    clearToastTimer()
    setToast(null)
  }, [clearToastTimer])

  useEffect(() => {
    return () => {
      clearToastTimer()
    }
  }, [clearToastTimer])

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    const list = applicants.filter((item) => {
      const matchesStatus = prefs.statusFilter === 'todos' || item.status === prefs.statusFilter
      const matchesQuery =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.handle?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })

    const factor = prefs.sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      if (prefs.sortKey === 'followers') return ((a.followers || 0) - (b.followers || 0)) * factor
      if (prefs.sortKey === 'avgViewers') return ((a.avgViewers || 0) - (b.avgViewers || 0)) * factor
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * factor
    })
  }, [applicants, debouncedQuery, prefs.statusFilter, prefs.sortKey, prefs.sortDir])

  const allSelected = filtered.length > 0 && filtered.every((item) => selected.has(item.id))
  const someSelected = filtered.some((item) => selected.has(item.id))

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = someSelected && !allSelected
    }
  }, [someSelected, allSelected])

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(filtered.map((item) => item.id)))
  }

  const handleStatusChange = useCallback(
    (id: string, next: Status) => {
      const target = applicants.find((item) => item.id === id)
      const previous = target?.status
      onStatusChange(id, next)
      if (previous === undefined || previous === next) return
      showToast(`Estado cambiado a ${STATUSES[next].label}`, () => onStatusChange(id, previous))
    },
    [applicants, onStatusChange, showToast],
  )

  const applyBulk = useCallback(
    (status: Status) => {
      const targets = applicants.filter((item) => selected.has(item.id))
      if (targets.length === 0) return
      const previous = targets.map((item) => ({ id: item.id, status: item.status }))
      targets.forEach((item) => onStatusChange(item.id, status))
      setSelected(new Set())

      const restore = () => {
        previous.forEach((entry) => onStatusChange(entry.id, entry.status))
      }
      const label = STATUSES[status].label
      showToast(
        targets.length === 1
          ? `Estado cambiado a ${label}`
          : `${targets.length} estados cambiados a ${label}`,
        restore,
      )
    },
    [applicants, onStatusChange, selected, showToast],
  )

  const clearFilters = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
    updatePrefs({ statusFilter: 'todos' })
  }, [updatePrefs])

  const toggleSort = useCallback(
    (key: SortKey) => {
      if (prefs.sortKey === key) updatePrefs({ sortDir: prefs.sortDir === 'asc' ? 'desc' : 'asc' })
      else updatePrefs({ sortKey: key, sortDir: 'desc' })
    },
    [prefs.sortKey, prefs.sortDir, updatePrefs],
  )

  const ariaSort = (key: SortKey): 'ascending' | 'descending' | 'none' => {
    if (prefs.sortKey !== key) return 'none'
    return prefs.sortDir === 'asc' ? 'ascending' : 'descending'
  }

  function sortHeader(key: SortKey, label: string, extraClass = '') {
    const active = prefs.sortKey === key
    const arrow = active ? (prefs.sortDir === 'asc' ? '↑' : '↓') : '↕'
    return (
      <th scope="col" aria-sort={ariaSort(key)} className={`px-5 py-3.5 font-display font-semibold ${extraClass}`}>
        <button
          type="button"
          onClick={() => toggleSort(key)}
          aria-label={`Ordenar por ${label}`}
          className={`inline-flex items-center gap-1.5 transition hover:text-white ${
            active ? 'text-white' : 'text-white/60'
          }`}
        >
          {label}
          <span aria-hidden="true" className={active ? 'text-brand-300' : 'text-white/35'}>
            {arrow}
          </span>
        </button>
      </th>
    )
  }

  const hasApplicants = applicants.length > 0
  const selectedCount = selected.size

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60">
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {hasApplicants && (
              <>
                <div className="relative flex-1 lg:max-w-sm">
                  <svg
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      d="m21 21-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    className="input !pl-11"
                    placeholder="Buscar por nombre, @ o categoría…"
                    aria-label="Buscar postulantes"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap items-center gap-2">
                  {STATUS_ORDER.map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updatePrefs({ statusFilter: prefs.statusFilter === key ? 'todos' : key })}
                      aria-pressed={prefs.statusFilter === key}
                      className={`${chipClass} ${
                        prefs.statusFilter === key
                          ? 'border-brand-400 bg-brand-500/25 text-white'
                          : 'border-white/10 text-white/55 hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {STATUSES[key].label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <DataActions rows={filtered} />
        </div>

        <div className="overflow-x-auto">
          {!hasApplicants ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-500/10">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-brand-200" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mt-4 font-display text-sm font-semibold text-white">Aún no hay postulantes</p>
              <p className="mt-1 text-sm text-white/60">
                Cuando alguien se postule desde la landing aparecerá aquí.
              </p>
              <a href="#/" className="btn-primary mt-5 !py-2.5 text-xs">
                Ir a la landing
              </a>
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/5">
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 21l-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="mt-4 font-display text-sm font-semibold text-white">Sin resultados</p>
              <p className="mt-1 text-sm text-white/60">
                Prueba con otro nombre o cambia el filtro de estado.
              </p>
              <button type="button" onClick={clearFilters} className="btn-ghost mt-5 !py-2.5 text-xs">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <table className="hidden w-full min-w-[820px] text-left md:table">
                <caption className="sr-only">Listado de postulantes de la agencia</caption>
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/60">
                    <th scope="col" className="px-5 py-3.5">
                      <input
                        ref={headerCheckboxRef}
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        aria-label="Seleccionar todos"
                        className={checkboxClass}
                      />
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-display font-semibold">Creador</th>
                    <th scope="col" className="px-5 py-3.5 font-display font-semibold">Categoría</th>
                    {sortHeader('followers', 'Seguidores')}
                    {sortHeader('avgViewers', 'Viewers')}
                    {sortHeader('createdAt', 'Postulado')}
                    <th scope="col" className="px-5 py-3.5 font-display font-semibold">Estado</th>
                    <th scope="col" className="px-5 py-3.5 text-right font-display font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 transition last:border-0 hover:bg-brand-500/5"
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selected.has(item.id)}
                          onChange={() => toggleOne(item.id)}
                          aria-label={`Seleccionar ${item.name}`}
                          className={checkboxClass}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => onSelect(item)}
                          className="flex items-center gap-3 text-left"
                        >
                          <Avatar name={item.name} />
                          <span>
                            <span className="block font-display text-sm font-semibold text-white">{item.name}</span>
                            <span className="block text-xs text-brand-300">{item.handle}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-5 py-4 text-sm text-white/60">{item.category || '—'}</td>
                      <td className="px-5 py-4 font-display text-sm font-semibold text-white">
                        {formatCompact(item.followers)}
                      </td>
                      <td className="px-5 py-4 text-sm text-white/60">{formatCompact(item.avgViewers)}</td>
                      <td className="px-5 py-4 text-sm text-white/60">{formatDate(item.createdAt)}</td>
                      <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <StatusSelect applicant={item} onStatusChange={handleStatusChange} />
                          <button type="button" onClick={() => onSelect(item)} className={rowActionClass}>
                            Ver ficha
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ul className="divide-y divide-white/5 md:hidden">
                {filtered.map((item) => (
                  <li key={item.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(item.id)}
                        onChange={() => toggleOne(item.id)}
                        aria-label={`Seleccionar ${item.name}`}
                        className={`${checkboxClass} mt-1`}
                      />
                      <button
                        type="button"
                        onClick={() => onSelect(item)}
                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                      >
                        <Avatar name={item.name} />
                        <span className="min-w-0">
                          <span className="block truncate font-display text-sm font-semibold text-white">{item.name}</span>
                          <span className="block text-xs text-brand-300">{item.handle}</span>
                        </span>
                      </button>
                      <StatusBadge status={item.status} />
                    </div>

                    <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg border border-white/10 bg-ink-950/50 px-2 py-2">
                        <dt className="text-[10px] uppercase tracking-wide text-white/55">Seguidores</dt>
                        <dd className="font-display text-sm font-semibold text-white">{formatCompact(item.followers)}</dd>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-ink-950/50 px-2 py-2">
                        <dt className="text-[10px] uppercase tracking-wide text-white/55">Viewers</dt>
                        <dd className="font-display text-sm font-semibold text-white">{formatCompact(item.avgViewers)}</dd>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-ink-950/50 px-2 py-2">
                        <dt className="text-[10px] uppercase tracking-wide text-white/55">Postulado</dt>
                        <dd className="text-sm text-white/70">{formatDate(item.createdAt)}</dd>
                      </div>
                    </dl>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <StatusSelect applicant={item} onStatusChange={handleStatusChange} />
                      <button type="button" onClick={() => onSelect(item)} className={rowActionClass}>
                        Ver ficha
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div aria-live="polite" className="border-t border-white/10 px-5 py-3 text-xs text-white/60">
          {filtered.length} de {applicants.length} postulantes
        </div>
      </div>

      {selectedCount > 0 && (
        <div
          role="group"
          aria-label="Acciones masivas"
          className="fixed bottom-24 left-1/2 z-40 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap items-center justify-center gap-2 rounded-2xl border border-brand-400/40 bg-ink-800/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl"
        >
          <span className="text-sm font-medium text-white">
            {`${selectedCount} ${selectedCount === 1 ? 'seleccionado' : 'seleccionados'}`}
          </span>
          <button
            type="button"
            onClick={() => applyBulk('contactado')}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-display text-xs font-semibold text-white/75 transition hover:border-sky-400/50 hover:text-white"
          >
            Marcar como contactado
          </button>
          <button
            type="button"
            onClick={() => applyBulk('aprobado')}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-display text-xs font-semibold text-white/75 transition hover:border-emerald-400/50 hover:text-white"
          >
            Marcar como aprobado
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            aria-label="Cancelar selección"
            className="rounded-full border border-white/10 px-3 py-1.5 font-display text-xs font-semibold text-white/55 transition hover:border-white/30 hover:text-white"
          >
            Cancelar
          </button>
        </div>
      )}

      {toast && (
        <UndoToast
          message={toast.message}
          onUndo={() => {
            toast.undo()
            dismissToast()
          }}
          onDismiss={dismissToast}
        />
      )}
    </>
  )
}
