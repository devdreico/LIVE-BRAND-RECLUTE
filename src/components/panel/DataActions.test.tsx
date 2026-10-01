import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Applicant } from '../../types'
import { seedApplicants } from '../../data/seedApplicants'
import { resetApplicantsStore } from '../../hooks/useApplicants'
import { loadApplicants } from '../../services/applicantStorage'
import DataActions from './DataActions'

function makeApplicant(overrides: Partial<Applicant> = {}): Applicant {
  return {
    id: 'ap_data_1',
    name: 'Export Uno',
    handle: '@exportuno',
    followers: 1500,
    avgViewers: 220,
    hoursPerWeek: 9,
    category: 'Gaming',
    email: 'uno@ejemplo.com',
    status: 'pendiente',
    createdAt: '2026-03-01T00:00:00.000Z',
    ...overrides,
  }
}

const rows: Applicant[] = [
  makeApplicant(),
  makeApplicant({ id: 'ap_data_2', name: 'Export Dos', handle: '@exportdos', status: 'contactado' }),
]

let createdBlobs: Blob[] = []
let downloads: string[] = []
let createObjectURL: ReturnType<typeof vi.fn>
let revokeObjectURL: ReturnType<typeof vi.fn>

function renderActions(list: Applicant[] = rows) {
  return render(<DataActions rows={list} />)
}

beforeEach(() => {
  localStorage.clear()
  resetApplicantsStore()
  createdBlobs = []
  downloads = []

  createObjectURL = vi.fn((blob: Blob) => {
    createdBlobs.push(blob)
    return 'blob:mock'
  })
  revokeObjectURL = vi.fn()
  URL.createObjectURL = createObjectURL as unknown as typeof URL.createObjectURL
  URL.revokeObjectURL = revokeObjectURL as unknown as typeof URL.revokeObjectURL

  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function click(
    this: HTMLAnchorElement,
  ) {
    downloads.push(this.download)
  })
})

describe('DataActions', () => {
  it('exporta el CSV de los postulantes filtrados con nombre por fecha', async () => {
    const user = userEvent.setup()
    renderActions()

    await user.click(screen.getByRole('button', { name: 'Exportar CSV' }))

    expect(createObjectURL).toHaveBeenCalledTimes(1)
    expect(revokeObjectURL).toHaveBeenCalledTimes(1)
    expect(downloads[0]).toMatch(/^postulantes-\d{4}-\d{2}-\d{2}\.csv$/)

    // Blob.text() descodifica UTF-8 y elimina el BOM; el BOM se valida en exportCsv.test.
    const blob = createdBlobs[0] as Blob
    expect(blob.type).toContain('text/csv')
    const csv = await blob.text()
    expect(csv).toContain('Nombre')
    expect(csv).toContain('Export Uno')
    expect(csv).toContain('Export Dos')

    expect(screen.getByRole('status')).toHaveTextContent('CSV exportado con 2 postulantes.')
  })

  it('deshabilita el CSV cuando no hay filas filtradas', () => {
    renderActions([])

    expect(screen.getByRole('button', { name: 'Exportar CSV' })).toBeDisabled()
  })

  it('exporta el backup completo en JSON', async () => {
    const user = userEvent.setup()
    renderActions()

    await user.click(screen.getByRole('button', { name: 'Exportar backup' }))

    expect(downloads[0]).toMatch(/^livebrand-backup-\d{4}-\d{2}-\d{2}\.json$/)

    const json = await (createdBlobs[0] as Blob).text()
    const parsed = JSON.parse(json) as { version: number; applicants: Applicant[] }
    expect(parsed.version).toBe(2)
    expect(parsed.applicants).toHaveLength(seedApplicants.length)

    expect(screen.getByRole('status')).toHaveTextContent(
      `Backup exportado con ${seedApplicants.length} postulantes.`,
    )
  })

  it('importa un backup válido y reemplaza la lista', async () => {
    const user = userEvent.setup()
    renderActions()

    const backup = {
      version: 2,
      applicants: [
        makeApplicant({ id: 'imp_1', name: 'Importado Uno' }),
        makeApplicant({ id: 'imp_2', name: 'Importado Dos', status: 'aprobado' }),
      ],
    }
    const file = new File([JSON.stringify(backup)], 'backup.json', { type: 'application/json' })

    await user.upload(screen.getByLabelText('Importar backup'), file)

    await waitFor(() => expect(loadApplicants()).toHaveLength(2))
    expect(loadApplicants()?.map((item) => item.id)).toEqual(['imp_1', 'imp_2'])
    expect(screen.getByRole('status')).toHaveTextContent('Backup importado: 2 postulantes.')
  })

  it('rechaza un archivo que no es un backup válido', async () => {
    const user = userEvent.setup()
    renderActions()

    const file = new File(['esto no es json'], 'malvado.json', { type: 'application/json' })

    await user.upload(screen.getByLabelText('Importar backup'), file)

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(
        'No se pudo importar el archivo: formato de backup no válido.',
      ),
    )
    expect(loadApplicants()).toBeNull()
  })

  it('restaura los datos demo tras una importación', async () => {
    const user = userEvent.setup()
    renderActions()

    const backup = { version: 2, applicants: [makeApplicant({ id: 'imp_only' })] }
    const file = new File([JSON.stringify(backup)], 'backup.json', { type: 'application/json' })
    await user.upload(screen.getByLabelText('Importar backup'), file)
    await waitFor(() => expect(loadApplicants()).toHaveLength(1))

    await user.click(screen.getByRole('button', { name: 'Restaurar datos demo' }))

    await waitFor(() => expect(loadApplicants()).toHaveLength(seedApplicants.length))
    expect(loadApplicants()?.[0]?.id).toBe(seedApplicants[0].id)
    expect(screen.getByRole('status')).toHaveTextContent('Datos demo restaurados.')
  })
})
