import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import type { Applicant, ApplicantStats, NewApplicantData, Status } from '../types'
import { STATUSES, STATUS_ORDER } from '../utils/ui'
import {
  STORAGE_KEY,
  createApplicant,
  saveApplicants,
  seedIfEmpty,
} from '../services/applicantStorage'

const HISTORY_LIMIT = 50

type Listener = () => void

const listeners = new Set<Listener>()

let snapshot: Applicant[] | null = null

function readSnapshot(): Applicant[] {
  if (snapshot === null) snapshot = seedIfEmpty()
  return snapshot
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function emit(): void {
  listeners.forEach((listener) => listener())
}

function writeSnapshot(next: Applicant[]): void {
  if (next === snapshot) return
  snapshot = next
  saveApplicants(next)
  emit()
}

/** Reinicia la fuente de verdad compartida entre instancias del hook (solo para pruebas). */
export function resetApplicantsStore(): void {
  snapshot = null
  emit()
}

function computeStats(applicants: Applicant[]): ApplicantStats {
  const total = applicants.length
  const byStatus = STATUS_ORDER.reduce(
    (acc, key) => {
      acc[key] = applicants.filter((item) => item.status === key).length
      return acc
    },
    { pendiente: 0, contactado: 0, aprobado: 0, rechazado: 0 } as Record<Status, number>,
  )

  const resolved = byStatus.aprobado + byStatus.rechazado
  const conversion = resolved ? Math.round((byStatus.aprobado / resolved) * 100) : 0

  const followersSum = applicants.reduce((sum, item) => sum + (item.followers || 0), 0)
  const hoursSum = applicants.reduce((sum, item) => sum + (item.hoursPerWeek || 0), 0)
  const avgViewers = total
    ? Math.round(applicants.reduce((sum, item) => sum + (item.avgViewers || 0), 0) / total)
    : 0

  return {
    total,
    byStatus,
    conversion,
    followersSum,
    avgViewers,
    hoursSum,
    statusList: STATUS_ORDER.map((key) => ({ key, ...STATUSES[key], count: byStatus[key] })),
  }
}

export function useApplicants() {
  const applicants = useSyncExternalStore(subscribe, readSnapshot, readSnapshot)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== STORAGE_KEY) return
      writeSnapshot(seedIfEmpty())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addApplicant = useCallback((data: NewApplicantData): Applicant => {
    const applicant = createApplicant(data)
    writeSnapshot([applicant, ...readSnapshot()])
    return applicant
  }, [])

  const updateStatus = useCallback((id: string, status: Status): void => {
    const current = readSnapshot()
    let changed = false
    const next = current.map((item) => {
      if (item.id !== id || item.status === status) return item
      changed = true
      const at = new Date().toISOString()
      const history = [...(item.history ?? []), { status, at }]
      return {
        ...item,
        status,
        updatedAt: at,
        history: history.slice(-HISTORY_LIMIT),
      }
    })
    if (changed) writeSnapshot(next)
  }, [])

  const removeApplicant = useCallback((id: string): void => {
    writeSnapshot(readSnapshot().filter((item) => item.id !== id))
  }, [])

  const replaceAll = useCallback((next: Applicant[]): void => {
    writeSnapshot(next)
  }, [])

  const stats = useMemo(() => computeStats(applicants), [applicants])

  return { applicants, stats, addApplicant, updateStatus, removeApplicant, replaceAll }
}
