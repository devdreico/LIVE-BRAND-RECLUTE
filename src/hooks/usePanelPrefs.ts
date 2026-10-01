import { useCallback, useEffect, useRef, useState } from 'react'
import type { Status } from '../types'
import { isStatus } from '../utils/ui'

export const PANEL_PREFS_KEY = 'livebrand.panel.prefs'

export type StatusFilter = Status | 'todos'
export type SortKey = 'createdAt' | 'followers' | 'avgViewers'
export type SortDir = 'asc' | 'desc'

export interface PanelPrefs {
  statusFilter: StatusFilter
  sortKey: SortKey
  sortDir: SortDir
}

export const DEFAULT_PANEL_PREFS: PanelPrefs = {
  statusFilter: 'todos',
  sortKey: 'createdAt',
  sortDir: 'desc',
}

const SORT_KEYS: readonly SortKey[] = ['createdAt', 'followers', 'avgViewers']
const SORT_DIRS: readonly SortDir[] = ['asc', 'desc']

function isSortKey(value: unknown): value is SortKey {
  return typeof value === 'string' && (SORT_KEYS as readonly string[]).includes(value)
}

function isSortDir(value: unknown): value is SortDir {
  return typeof value === 'string' && (SORT_DIRS as readonly string[]).includes(value)
}

function isStatusFilter(value: unknown): value is StatusFilter {
  return value === 'todos' || (typeof value === 'string' && isStatus(value))
}

/** Valida y normaliza cualquier objeto guardado; nunca lanza. */
export function parsePanelPrefs(value: unknown): PanelPrefs {
  if (typeof value !== 'object' || value === null) return { ...DEFAULT_PANEL_PREFS }
  const raw = value as Partial<PanelPrefs>
  return {
    statusFilter: isStatusFilter(raw.statusFilter) ? raw.statusFilter : DEFAULT_PANEL_PREFS.statusFilter,
    sortKey: isSortKey(raw.sortKey) ? raw.sortKey : DEFAULT_PANEL_PREFS.sortKey,
    sortDir: isSortDir(raw.sortDir) ? raw.sortDir : DEFAULT_PANEL_PREFS.sortDir,
  }
}

/** Lee las preferencias de la tabla. Seguro en SSR y con storage roto. */
export function readPanelPrefs(): PanelPrefs {
  if (typeof window === 'undefined') return { ...DEFAULT_PANEL_PREFS }
  try {
    const raw = window.localStorage.getItem(PANEL_PREFS_KEY)
    if (raw === null) return { ...DEFAULT_PANEL_PREFS }
    return parsePanelPrefs(JSON.parse(raw) as unknown)
  } catch {
    return { ...DEFAULT_PANEL_PREFS }
  }
}

export function savePanelPrefs(prefs: PanelPrefs): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PANEL_PREFS_KEY, JSON.stringify(parsePanelPrefs(prefs)))
  } catch {
    // Storage lleno o bloqueado: las preferencias son prescindibles.
  }
}

/**
 * Filtro de estado y orden de la tabla persistidos en `localStorage`.
 * La hidratación ocurre en un efecto (cliente) para no romper la hidratación de SSR
 * y solo se escribe cuando el usuario cambia algo.
 */
export function usePanelPrefs(): {
  prefs: PanelPrefs
  updatePrefs: (patch: Partial<PanelPrefs>) => void
} {
  const [prefs, setPrefs] = useState<PanelPrefs>({ ...DEFAULT_PANEL_PREFS })
  const dirtyRef = useRef(false)

  useEffect(() => {
    if (dirtyRef.current) savePanelPrefs(prefs)
  }, [prefs])

  useEffect(() => {
    setPrefs(readPanelPrefs())
  }, [])

  const updatePrefs = useCallback((patch: Partial<PanelPrefs>) => {
    dirtyRef.current = true
    setPrefs((prev) => parsePanelPrefs({ ...prev, ...patch }))
  }, [])

  return { prefs, updatePrefs }
}
