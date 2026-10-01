import type { Status } from '../../types'
import { STATUSES } from '../../utils/ui'

interface StatusBadgeProps {
  status: Status
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUSES[status] ?? STATUSES.pendiente
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-wide ${config.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
