import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Applicant, Status } from '../../types'
import { resetApplicantsStore, useApplicants } from '../../hooks/useApplicants'
import { saveApplicants } from '../../services/applicantStorage'
import ApplicantDetail from './ApplicantDetail'

function makeApplicant(overrides: Partial<Applicant> = {}): Applicant {
  return {
    id: 'ap_modal_1',
    name: 'Luna Prueba',
    handle: '@lunaprueba',
    platform: 'TikTok',
    followers: 12000,
    avgViewers: 450,
    hoursPerWeek: 12,
    category: 'Gaming',
    email: 'luna@ejemplo.com',
    phone: '+56 9 1111 2222',
    availability: 'Tardes',
    note: 'Creadora de prueba',
    status: 'pendiente',
    createdAt: '2026-02-01T00:00:00.000Z',
    ...overrides,
  }
}

interface HarnessProps {
  applicant: Applicant
  onStatusChange?: (id: string, status: Status) => void
  onDelete?: (id: string) => void
  onClose?: () => void
}

function Harness({ applicant, onStatusChange, onDelete, onClose = () => {} }: HarnessProps) {
  const { updateStatus, removeApplicant } = useApplicants()
  return (
    <ApplicantDetail
      applicant={applicant}
      onClose={onClose}
      onStatusChange={(id, status) => {
        onStatusChange?.(id, status)
        updateStatus(id, status)
      }}
      onDelete={(id) => {
        onDelete?.(id)
        removeApplicant(id)
      }}
    />
  )
}

function renderDetail(overrides: Partial<Applicant> = {}) {
  const applicant = makeApplicant(overrides)

  // La ficha siempre trabaja sobre un postulante que vive en el store compartido.
  saveApplicants([applicant])
  resetApplicantsStore()

  const onStatusChange = vi.fn<(id: string, status: Status) => void>()
  const onDelete = vi.fn<(id: string) => void>()
  const onClose = vi.fn()

  render(
    <Harness
      applicant={applicant}
      onStatusChange={onStatusChange}
      onDelete={onDelete}
      onClose={onClose}
    />,
  )

  return { applicant, onStatusChange, onDelete, onClose }
}

beforeEach(() => {
  localStorage.clear()
  resetApplicantsStore()
})

describe('ApplicantDetail', () => {
  it('es un diálogo modal con aria-labelledby y foco atrapado', () => {
    renderDetail()

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('aria-labelledby', 'applicant-dialog-title')
    expect(screen.getByRole('heading', { level: 2, name: 'Luna Prueba' })).toBeInTheDocument()
    expect(document.activeElement).toHaveAttribute('tabindex', '-1')
    expect(dialog.contains(document.activeElement)).toBe(true)

    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    )
    expect(focusables.length).toBeGreaterThan(2)

    const first = focusables[0] as HTMLElement
    const last = focusables[focusables.length - 1] as HTMLElement

    last.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(first)

    first.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(last)
  })

  it('cierra con Escape y restaura el foco anterior', () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Abrir ficha'
    document.body.appendChild(trigger)
    trigger.focus()

    const { onClose } = renderDetail()

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
    trigger.remove()
  })

  it('enlaza al perfil de TikTok en una pestaña nueva', () => {
    renderDetail()

    const link = screen.getByRole('link', { name: /@lunaprueba/ })
    expect(link).toHaveAttribute('href', 'https://www.tiktok.com/lunaprueba')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer noopener')
  })

  it('quita el "@" inicial del handle al construir la URL', () => {
    renderDetail({ handle: '@@@con@' })

    expect(screen.getByRole('link', { name: /@@@con@/ })).toHaveAttribute(
      'href',
      'https://www.tiktok.com/con@',
    )
  })

  it('copia el email y el teléfono con feedback "Copiado"', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })

    renderDetail()

    await user.click(screen.getByRole('button', { name: 'Copiar email de Luna Prueba' }))
    expect(writeText).toHaveBeenCalledWith('luna@ejemplo.com')
    expect(await screen.findByText('Copiado')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Copiar teléfono de Luna Prueba' }))
    expect(writeText).toHaveBeenCalledWith('+56 9 1111 2222')
    expect(screen.getAllByText('Copiado')).toHaveLength(1)
  })

  it('muestra el historial de cambios de estado y permite deshacerlo', async () => {
    const user = userEvent.setup()
    renderDetail()

    expect(screen.getByText('Sin cambios registrados todavía.')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Contactado' }))

    const history = screen.getByRole('list')
    expect(within(history).getAllByRole('listitem')).toHaveLength(1)
    expect(within(history).getByText('Contactado')).toBeInTheDocument()
    expect(history.querySelector('time')).toHaveAttribute('datetime')

    expect(screen.getByRole('button', { name: 'Contactado' })).toHaveAttribute('aria-pressed', 'true')

    const undoMessage = screen.getByText('Estado cambiado a Contactado')
    const undoRegion = undoMessage.closest('[role="status"]')
    expect(undoRegion).not.toBeNull()
    await user.click(within(undoRegion as HTMLElement).getByRole('button', { name: 'Deshacer' }))

    expect(screen.getByRole('button', { name: 'Pendiente' })).toHaveAttribute('aria-pressed', 'true')
    const entries = within(screen.getByRole('list')).getAllByRole('listitem')
    expect(entries).toHaveLength(2)
    expect(within(screen.getByRole('list')).getByText('Pendiente')).toBeInTheDocument()
    expect(within(screen.getByRole('list')).getByText('Contactado')).toBeInTheDocument()
  })

  it('pide confirmación en línea antes de eliminar', async () => {
    const user = userEvent.setup()
    const { onDelete, onClose } = renderDetail()

    await user.click(screen.getByRole('button', { name: 'Eliminar postulante' }))

    expect(screen.getByText('¿Seguro? Esta acción no se puede deshacer.')).toBeInTheDocument()
    expect(onDelete).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.queryByText('¿Seguro? Esta acción no se puede deshacer.')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Eliminar postulante' }))
    await user.click(screen.getByRole('button', { name: 'Sí, eliminar' }))

    expect(onDelete).toHaveBeenCalledWith('ap_modal_1')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('no cierra el diálogo al hacer clic dentro del panel', async () => {
    const user = userEvent.setup()
    const { onClose } = renderDetail()

    await user.click(screen.getByRole('heading', { level: 2, name: 'Luna Prueba' }))

    expect(onClose).not.toHaveBeenCalled()
  })
})
