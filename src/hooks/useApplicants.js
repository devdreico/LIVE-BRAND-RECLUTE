import { useCallback, useEffect, useMemo, useState } from 'react'
import { seedApplicants } from '../data/seedApplicants.js'
import { STATUSES, STATUS_ORDER } from '../utils/ui.js'

const STORAGE_KEY = 'livebrand.applicants.v1'

function readStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedApplicants
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : seedApplicants
  } catch {
    return seedApplicants
  }
}

export function useApplicants() {
  const [applicants, setApplicants] = useState(readStorage)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applicants))
    } catch {
      /* storage not available */
    }
  }, [applicants])

  const addApplicant = useCallback((data) => {
    const applicant = {
      id: `ap_${Date.now().toString(36)}`,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
      ...data,
    }
    setApplicants((prev) => [applicant, ...prev])
    return applicant
  }, [])

  const updateStatus = useCallback((id, status) => {
    setApplicants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status, updatedAt: new Date().toISOString() } : item)),
    )
  }, [])

  const removeApplicant = useCallback((id) => {
    setApplicants((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const stats = useMemo(() => {
    const total = applicants.length
    const byStatus = applicants.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1
        return acc
      },
      { pendiente: 0, contactado: 0, aprobado: 0, rechazado: 0 },
    )
    const resolved = byStatus.aprobado + byStatus.rechazado
    const conversion = resolved ? Math.round((byStatus.aprobado / resolved) * 100) : 0
    const followers = applicants.reduce((sum, item) => sum + (item.followers || 0), 0)
    const avgViewers = applicants.reduce((sum, item) => sum + (item.avgViewers || 0), 0)
    const hours = applicants.reduce((sum, item) => sum + (item.hoursPerWeek || 0), 0)

    return {
      total,
      byStatus,
      conversion,
      followers,
      avgViewers,
      hours,
      statusList: STATUS_ORDER.map((key) => ({ key, ...STATUSES[key], count: byStatus[key] || 0 })),
    }
  }, [applicants])

  return { applicants, stats, addApplicant, updateStatus, removeApplicant }
}
