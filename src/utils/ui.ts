import type { Status, StatusMeta } from '../types'
import { STATUS_ORDER } from '../types'

export const STATUSES: Record<Status, StatusMeta> = {
  pendiente: {
    label: 'Pendiente',
    classes: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
    dot: 'bg-amber-400',
  },
  contactado: {
    label: 'Contactado',
    classes: 'bg-sky-400/10 text-sky-300 border-sky-400/30',
    dot: 'bg-sky-400',
  },
  aprobado: {
    label: 'Aprobado',
    classes: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
    dot: 'bg-emerald-400',
  },
  rechazado: {
    label: 'Rechazado',
    classes: 'bg-rose-400/10 text-rose-300 border-rose-400/30',
    dot: 'bg-rose-400',
  },
}

export { STATUS_ORDER }

export function isStatus(value: string): value is Status {
  return (STATUS_ORDER as readonly string[]).includes(value)
}

const AVATAR_COLORS = [
  'from-brand-500 to-glow',
  'from-fuchsia-500 to-brand-500',
  'from-violet-500 to-indigo-500',
  'from-purple-500 to-pink-500',
  'from-indigo-500 to-brand-400',
  'from-pink-500 to-rose-500',
]

export function avatarColor(seed = ''): string {
  let total = 0
  for (const char of seed) total += char.charCodeAt(0)
  return AVATAR_COLORS[total % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]
}

export function formatCompact(value = 0): string {
  return new Intl.NumberFormat('es', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function formatDate(iso?: string): string {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function initials(name = ''): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
