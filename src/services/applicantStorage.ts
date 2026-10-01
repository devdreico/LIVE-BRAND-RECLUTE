import type { Applicant, NewApplicantData, StatusHistoryEntry } from '../types'
import { STATUS_ORDER } from '../types'
import { seedApplicants } from '../data/seedApplicants'

export const STORAGE_KEY = 'livebrand.applicants'
export const SCHEMA_VERSION = 2

interface StoredShape {
  version: number
  applicants: Applicant[]
}

function isValidStatus(value: unknown): value is StatusHistoryEntry['status'] {
  return typeof value === 'string' && (STATUS_ORDER as readonly string[]).includes(value)
}

function isValidHistoryEntry(value: unknown): value is StatusHistoryEntry {
  if (typeof value !== 'object' || value === null) return false
  const entry = value as Partial<StatusHistoryEntry>
  return isValidStatus(entry.status) && typeof entry.at === 'string'
}

function sanitizeHistory(value: unknown): StatusHistoryEntry[] | undefined {
  if (!Array.isArray(value)) return undefined
  const entries = value.filter(isValidHistoryEntry)
  return entries.length > 0 ? entries : undefined
}

function isValidApplicant(value: unknown): value is Applicant {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Partial<Applicant>
  return typeof item.id === 'string' && typeof item.name === 'string' && typeof item.status === 'string'
}

function normalizeItem(value: Applicant): Applicant {
  const history = sanitizeHistory((value as Applicant).history)
  return history ? { ...value, history } : value
}

function normalize(items: unknown[]): Applicant[] {
  return items.filter(isValidApplicant).map(normalizeItem)
}

/** Devuelve los postulantes guardados, `null` si nunca se guardó nada (semilla inicial). */
export function loadApplicants(): Applicant[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null

    const parsed: unknown = JSON.parse(raw)

    // v1: array plano
    if (Array.isArray(parsed)) return normalize(parsed)

    // v2: { version, applicants }
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      Array.isArray((parsed as StoredShape).applicants)
    ) {
      return normalize((parsed as StoredShape).applicants)
    }

    return null
  } catch {
    return null
  }
}

export function saveApplicants(applicants: Applicant[]): boolean {
  try {
    const payload: StoredShape = { version: SCHEMA_VERSION, applicants }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

export function seedIfEmpty(): Applicant[] {
  return loadApplicants() ?? seedApplicants
}

export function createApplicant(data: NewApplicantData): Applicant {
  return {
    id: `ap_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
    ...data,
  }
}

export function exportApplicants(applicants: Applicant[]): string {
  const payload: StoredShape = { version: SCHEMA_VERSION, applicants }
  return JSON.stringify(payload, null, 2)
}

export function importApplicants(raw: string): Applicant[] {
  const parsed: unknown = JSON.parse(raw)
  const items = Array.isArray(parsed) ? parsed : (parsed as StoredShape)?.applicants
  if (!Array.isArray(items)) throw new Error('Formato de backup no válido')
  return normalize(items)
}
