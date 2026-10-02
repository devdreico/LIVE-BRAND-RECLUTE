export const STATUS_ORDER = ['pendiente', 'contactado', 'aprobado', 'rechazado'] as const

export type Status = (typeof STATUS_ORDER)[number]

export type PanelTab = 'resumen' | 'postulantes'

export interface StatusHistoryEntry {
  status: Status
  at: string
}

export interface Applicant {
  id: string
  name: string
  handle: string
  platform?: string
  followers: number
  avgViewers: number
  hoursPerWeek: number
  category?: string
  email: string
  phone?: string
  availability?: string
  source?: string
  note?: string
  status: Status
  createdAt: string
  updatedAt?: string
  history?: StatusHistoryEntry[]
}

export type NewApplicantData = Omit<
  Applicant,
  'id' | 'status' | 'createdAt' | 'updatedAt' | 'history'
>

export interface StatusMeta {
  label: string
  classes: string
  dot: string
}

export interface StatusCount extends StatusMeta {
  key: Status
  count: number
}

export interface ApplicantStats {
  total: number
  byStatus: Record<Status, number>
  conversion: number
  followersSum: number
  avgViewers: number
  hoursSum: number
  statusList: StatusCount[]
}
