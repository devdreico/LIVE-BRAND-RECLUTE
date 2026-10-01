import type { Applicant } from '../types'
import { STATUSES } from './ui'

/** BOM UTF-8: Excel lo necesita para acentuar correctamente. */
export const CSV_BOM = '\uFEFF'

/** Fin de línea preferido por Excel. */
export const CSV_EOL = '\r\n'

export const CSV_COLUMNS = [
  'Nombre',
  'Handle',
  'Correo',
  'Teléfono',
  'Categoría',
  'Seguidores',
  'Viewers promedio',
  'Horas por semana',
  'Estado',
  'Disponibilidad',
  'Postulado',
  'Notas',
] as const

type CellValue = string | number | null | undefined

function escapeCell(value: CellValue): string {
  const text = value === null || value === undefined ? '' : String(value)
  return `"${text.replace(/"/g, '""')}"`
}

/** Convierte una fila en CSV: cada celda entre comillas y con comillas internas escapadas. */
export function toCsvRow(values: readonly CellValue[]): string {
  return values.map(escapeCell).join(',')
}

function applicantCells(item: Applicant): CellValue[] {
  return [
    item.name,
    item.handle,
    item.email,
    item.phone,
    item.category,
    item.followers,
    item.avgViewers,
    item.hoursPerWeek,
    (STATUSES[item.status] ?? STATUSES.pendiente).label,
    item.availability,
    item.createdAt,
    item.note,
  ]
}

/** Genera el contenido CSV (con BOM) de la lista recibida. */
export function buildApplicantsCsv(applicants: Applicant[]): string {
  const lines = [toCsvRow(CSV_COLUMNS), ...applicants.map((item) => toCsvRow(applicantCells(item)))]
  return `${CSV_BOM}${lines.join(CSV_EOL)}${CSV_EOL}`
}

/** Sufijo de fecha local `YYYY-MM-DD` para nombres de archivo. */
export function fileDateSuffix(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Nombre de archivo local `postulantes-YYYY-MM-DD.csv`. */
export function csvFileName(date: Date = new Date()): string {
  return `postulantes-${fileDateSuffix(date)}.csv`
}
