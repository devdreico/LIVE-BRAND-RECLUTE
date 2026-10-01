import { describe, expect, it } from 'vitest'
import type { Applicant } from '../types'
import {
  CSV_BOM,
  CSV_COLUMNS,
  buildApplicantsCsv,
  csvFileName,
  fileDateSuffix,
  toCsvRow,
} from './exportCsv'

function makeApplicant(overrides: Partial<Applicant> = {}): Applicant {
  return {
    id: 'ap_csv_1',
    name: 'Camila Torres',
    handle: '@camilalive',
    platform: 'TikTok',
    followers: 84000,
    avgViewers: 1250,
    hoursPerWeek: 20,
    category: 'Gaming',
    email: 'camila@ejemplo.com',
    phone: '+56 9 8123 4477',
    availability: 'Tardes',
    note: 'Sin notas',
    status: 'aprobado',
    createdAt: '2026-01-15T10:00:00.000Z',
    ...overrides,
  }
}

function bodyLines(csv: string): string[] {
  return csv.slice(CSV_BOM.length).split('\r\n').filter(Boolean)
}

describe('toCsvRow', () => {
  it('envuelve cada celda entre comillas', () => {
    expect(toCsvRow(['Ana', 'Gaming', 12])).toBe('"Ana","Gaming","12"')
  })

  it('escapa las comillas internas duplicándolas', () => {
    expect(toCsvRow(['Dijo "hola"'])).toBe('"Dijo ""hola"""')
  })

  it('deja las comas y saltos de línea dentro de la celda', () => {
    expect(toCsvRow(['Gaming, en vivo'])).toBe('"Gaming, en vivo"')
    expect(toCsvRow(['línea 1\nlínea 2'])).toBe('"línea 1\nlínea 2"')
  })

  it('usa cadena vacía para valores nulos o indefinidos', () => {
    expect(toCsvRow([null, undefined])).toBe('"",""')
  })
})

describe('buildApplicantsCsv', () => {
  it('empieza con BOM UTF-8 para Excel', () => {
    const csv = buildApplicantsCsv([])

    expect(csv.startsWith(CSV_BOM)).toBe(true)
    expect(csv.charCodeAt(0)).toBe(0xfeff)
  })

  it('incluye la cabecera con todas las columnas', () => {
    const csv = buildApplicantsCsv([])
    const lines = bodyLines(csv)

    expect(lines[0]).toBe(toCsvRow(CSV_COLUMNS))
    expect(lines).toHaveLength(1)
  })

  it('genera una fila por postulante con los valores legibles', () => {
    const csv = buildApplicantsCsv([makeApplicant()])
    const lines = bodyLines(csv)

    expect(lines).toHaveLength(2)
    expect(lines[1]).toContain('"Camila Torres"')
    expect(lines[1]).toContain('"@camilalive"')
    expect(lines[1]).toContain('"camila@ejemplo.com"')
    expect(lines[1]).toContain('"84000"')
    expect(lines[1]).toContain('"Aprobado"')
    expect(lines[1]).toContain('"2026-01-15T10:00:00.000Z"')
  })

  it('escapa comillas de los textos libres', () => {
    const csv = buildApplicantsCsv([makeApplicant({ note: 'Dice "quiero lives"' })])
    const lines = bodyLines(csv)

    expect(lines[1]).toContain('"Dice ""quiero lives"""')
  })

  it('respeta el orden de columnas de la cabecera', () => {
    const csv = buildApplicantsCsv([makeApplicant({ name: 'Ana "La Voz"', category: 'Música, en vivo' })])
    const header = bodyLines(csv)[0]?.split(',') ?? []
    const row = bodyLines(csv)[1] ?? ''

    expect(header).toHaveLength(CSV_COLUMNS.length)
    expect(row.startsWith('"Ana ""La Voz""","@camilalive","camila@ejemplo.com","+56 9 8123 4477","Música, en vivo"')).toBe(
      true,
    )
  })
})

describe('csvFileName / fileDateSuffix', () => {
  it('usa el formato postulantes-YYYY-MM-DD.csv con fecha local', () => {
    const date = new Date(2026, 9, 1)

    expect(csvFileName(date)).toBe('postulantes-2026-10-01.csv')
    expect(fileDateSuffix(date)).toBe('2026-10-01')
  })

  it('rellena con ceros el mes y el día', () => {
    expect(csvFileName(new Date(2026, 0, 5))).toBe('postulantes-2026-01-05.csv')
  })
})
