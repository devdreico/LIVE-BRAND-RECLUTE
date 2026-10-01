import { useMemo, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'
import { STATUSES, STATUS_ORDER, avatarColor, formatCompact, formatDate } from '../../utils/ui.js'

function initials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const sortOptions = [
  { id: 'recent', label: 'Más recientes' },
  { id: 'followers', label: 'Más seguidores' },
  { id: 'viewers', label: 'Más viewers' },
]

export default function ApplicantsTable({ applicants, onSelect, onStatusChange }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [sortBy, setSortBy] = useState('recent')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = applicants.filter((item) => {
      const matchesStatus = statusFilter === 'todos' || item.status === statusFilter
      const matchesQuery =
        !q ||
        item.name?.toLowerCase().includes(q) ||
        item.handle?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })

    return [...list].sort((a, b) => {
      if (sortBy === 'followers') return (b.followers || 0) - (a.followers || 0)
      if (sortBy === 'viewers') return (b.avgViewers || 0) - (a.avgViewers || 0)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [applicants, query, statusFilter, sortBy])

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60">
      <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-sm">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m21 21-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            className="input !pl-11"
            placeholder="Buscar por nombre, @ o categoría…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {STATUS_ORDER.map((key) => (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? 'todos' : key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                statusFilter === key
                  ? 'border-brand-400 bg-brand-500/25 text-white'
                  : 'border-white/10 text-white/55 hover:border-white/25 hover:text-white'
              }`}
            >
              {STATUSES[key].label}
            </button>
          ))}

          <select
            className="input !w-auto !py-2 text-xs"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
              <th className="px-5 py-3.5 font-display font-semibold">Creador</th>
              <th className="px-5 py-3.5 font-display font-semibold">Categoría</th>
              <th className="px-5 py-3.5 font-display font-semibold">Seguidores</th>
              <th className="px-5 py-3.5 font-display font-semibold">Viewers</th>
              <th className="px-5 py-3.5 font-display font-semibold">Postulado</th>
              <th className="px-5 py-3.5 font-display font-semibold">Estado</th>
              <th className="px-5 py-3.5 text-right font-display font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/5 transition last:border-0 hover:bg-brand-500/5"
              >
                <td className="px-5 py-4">
                  <button onClick={() => onSelect(item)} className="flex items-center gap-3 text-left">
                    <span
                      className={`grid h-10 w-10 flex-none place-items-center rounded-xl bg-gradient-to-br ${avatarColor(
                        item.name,
                      )} font-display text-xs font-bold text-white`}
                    >
                      {initials(item.name)}
                    </span>
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
                <td className="px-5 py-4 text-sm text-white/50">{formatDate(item.createdAt)}</td>
                <td className="px-5 py-4"><StatusBadge status={item.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <select
                      className="input !w-auto !px-2.5 !py-1.5 text-xs"
                      value={item.status}
                      onChange={(event) => onStatusChange(item.id, event.target.value)}
                      aria-label={`Cambiar estado de ${item.name}`}
                    >
                      {STATUS_ORDER.map((key) => (
                        <option key={key} value={key}>{STATUSES[key].label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => onSelect(item)}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-brand-400/40 hover:text-white"
                    >
                      Ver ficha
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered.length && (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/5">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 21l-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mt-4 font-display text-sm font-semibold text-white">Sin resultados</p>
            <p className="mt-1 text-sm text-white/45">Prueba con otro nombre o cambia el filtro de estado.</p>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 px-5 py-3 text-xs text-white/40">
        {filtered.length} de {applicants.length} postulantes
      </div>
    </div>
  )
}
