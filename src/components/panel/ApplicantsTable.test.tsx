import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Applicant, Status } from '../../types'
import { resetApplicantsStore, useApplicants } from '../../hooks/useApplicants'
import { loadApplicants, saveApplicants } from '../../services/applicantStorage'
import { seedApplicants } from '../../data/seedApplicants'
import { PANEL_PREFS_KEY } from '../../hooks/usePanelPrefs'
import ApplicantsTable from './ApplicantsTable'

function makeApplicant(overrides: Partial<Applicant> = {}): Applicant {
  return {
    id: 'ap_test_1',
    name: 'Applicant Test',
    handle: '@applicant',
    followers: 1000,
    avgViewers: 100,
    hoursPerWeek: 10,
    category: 'Gaming',
    email: 'applicant@example.com',
    status: 'pendiente',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const applicants: Applicant[] = [
  makeApplicant({
    id: 'ap1',
    name: 'Camila Torres',
    handle: '@camilalive',
    status: 'aprobado',
    category: 'Gaming',
    followers: 84000,
    createdAt: '2026-01-03T00:00:00.000Z',
  }),
  makeApplicant({
    id: 'ap2',
    name: 'Javier Peña',
    handle: '@javierpena',
    status: 'contactado',
    category: 'Música en vivo',
    followers: 45200,
    createdAt: '2026-01-02T00:00:00.000Z',
  }),
  makeApplicant({
    id: 'ap3',
    name: 'Antonia Rojas',
    handle: '@antorojas',
    status: 'pendiente',
    category: 'Lifestyle',
    followers: 210500,
    createdAt: '2026-01-01T00:00:00.000Z',
  }),
]

function renderTable(list: Applicant[] = applicants) {
  const onSelect = vi.fn()
  const onStatusChange = vi.fn<(id: string, status: Status) => void>()
  const utils = render(
    <ApplicantsTable applicants={list} onSelect={onSelect} onStatusChange={onStatusChange} />,
  )
  return { onSelect, onStatusChange, ...utils }
}

function StoreTable({
  onSelect,
  onStatusChange,
}: {
  onSelect: (applicant: Applicant) => void
  onStatusChange: (id: string, status: Status) => void
}) {
  const { applicants } = useApplicants()
  return <ApplicantsTable applicants={applicants} onSelect={onSelect} onStatusChange={onStatusChange} />
}

const desktop = () => within(screen.getByRole('table'))
const mobile = () => within(screen.getByRole('list'))

function expectVisible(name: string): void {
  expect(screen.getAllByText(name).length).toBeGreaterThan(0)
}

function expectHidden(name: string): void {
  expect(screen.queryAllByText(name)).toHaveLength(0)
}

function firstDesktopRow(): string {
  const rows = desktop().getAllByRole('row')
  return rows[1]?.textContent ?? ''
}

const searchPlaceholder = 'Buscar por nombre, @ o categoría…'

beforeEach(() => {
  localStorage.clear()
  resetApplicantsStore()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ApplicantsTable', () => {
  it('filtra por estado con los botones', async () => {
    const user = userEvent.setup()
    renderTable()

    expectVisible('Javier Peña')

    const aprobado = screen.getByRole('button', { name: 'Aprobado' })
    expect(aprobado).toHaveAttribute('aria-pressed', 'false')
    await user.click(aprobado)

    expectVisible('Camila Torres')
    expectHidden('Javier Peña')
    expectHidden('Antonia Rojas')
    expect(screen.getByText('1 de 3 postulantes')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Aprobado' })).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: 'Aprobado' }))

    expectVisible('Javier Peña')
    expect(screen.getByText('3 de 3 postulantes')).toBeInTheDocument()
  })

  it('aplica la búsqueda con debounce de 250 ms', async () => {
    renderTable()
    const search = screen.getByPlaceholderText(searchPlaceholder)

    fireEvent.change(search, { target: { value: 'camila' } })

    expect(screen.getByText('3 de 3 postulantes')).toBeInTheDocument()

    await waitFor(() => expect(screen.getByText('1 de 3 postulantes')).toBeInTheDocument(), {
      timeout: 2000,
    })

    expectVisible('Camila Torres')
    expectHidden('Javier Peña')
    expectHidden('Antonia Rojas')
  })

  it('muestra el estado vacío cuando la búsqueda no tiene resultados', async () => {
    const user = userEvent.setup()
    renderTable()
    const search = screen.getByPlaceholderText(searchPlaceholder)

    await user.type(search, 'zzzznoexiste')

    await waitFor(() => expect(screen.getByText('Sin resultados')).toBeInTheDocument(), {
      timeout: 2000,
    })
    expectHidden('Camila Torres')
    expect(screen.getByText('0 de 3 postulantes')).toBeInTheDocument()

    await user.clear(search)

    await waitFor(() => expect(screen.getByText('3 de 3 postulantes')).toBeInTheDocument(), {
      timeout: 2000,
    })
    expectVisible('Camila Torres')
    expect(screen.queryByText('Sin resultados')).not.toBeInTheDocument()
  })

  it('busca por @ y por categoría', async () => {
    const user = userEvent.setup()
    renderTable()
    const search = screen.getByPlaceholderText(searchPlaceholder)

    await user.type(search, 'javierpena')
    await waitFor(() => expectHidden('Camila Torres'), { timeout: 2000 })
    expectVisible('Javier Peña')

    await user.clear(search)
    await user.type(search, 'lifestyle')
    await waitFor(() => expectHidden('Javier Peña'), { timeout: 2000 })
    expectVisible('Antonia Rojas')
  })

  it('ofrece limpiar filtros cuando no hay resultados por filtro', async () => {
    const user = userEvent.setup()
    renderTable()

    await user.click(screen.getByRole('button', { name: 'Rechazado' }))
    expect(screen.getByText('0 de 3 postulantes')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText(searchPlaceholder), 'camila')
    await waitFor(() => expect(screen.getByText('Sin resultados')).toBeInTheDocument(), {
      timeout: 2000,
    })

    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }))

    await waitFor(() => expect(screen.getByText('3 de 3 postulantes')).toBeInTheDocument(), {
      timeout: 2000,
    })
    expect(screen.queryByText('Sin resultados')).not.toBeInTheDocument()
  })

  it('llama a onStatusChange al cambiar el estado desde el select', async () => {
    const user = userEvent.setup()
    const { onStatusChange } = renderTable()

    const select = desktop().getByRole('combobox', { name: 'Cambiar estado de Camila Torres' })
    await user.selectOptions(select, 'rechazado')

    expect(onStatusChange).toHaveBeenCalledTimes(1)
    expect(onStatusChange).toHaveBeenCalledWith('ap1', 'rechazado')
  })

  it('ignora cambios a valores que no son estados válidos', () => {
    const { onStatusChange } = renderTable()

    const select = desktop().getByRole('combobox', { name: 'Cambiar estado de Antonia Rojas' })
    fireEvent.change(select, { target: { value: 'no-es-estado' } })

    expect(onStatusChange).not.toHaveBeenCalled()
  })

  it('muestra el toast con Deshacer al cambiar un estado y lo revierte', async () => {
    const user = userEvent.setup()
    const { onStatusChange } = renderTable()

    await user.selectOptions(
      desktop().getByRole('combobox', { name: 'Cambiar estado de Camila Torres' }),
      'contactado',
    )

    const toast = screen.getByRole('status')
    expect(toast).toHaveAttribute('aria-live', 'polite')
    expect(toast).toHaveTextContent('Estado cambiado a Contactado')

    await user.click(within(toast).getByRole('button', { name: 'Deshacer' }))

    expect(onStatusChange).toHaveBeenLastCalledWith('ap1', 'aprobado')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('oculta el toast a los 5 segundos', () => {
    vi.useFakeTimers()
    const { onStatusChange } = renderTable()

    fireEvent.change(
      desktop().getByRole('combobox', { name: 'Cambiar estado de Camila Torres' }),
      { target: { value: 'contactado' } },
    )

    expect(onStatusChange).toHaveBeenCalledWith('ap1', 'contactado')
    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(4999)
    })
    expect(screen.getByRole('status')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('renderiza la tabla y las tarjetas responsivas con las clases de responsive', () => {
    renderTable()

    const table = screen.getByRole('table')
    expect(table).toHaveClass('hidden')
    expect(table).toHaveClass('md:table')

    const list = screen.getByRole('list')
    expect(list).toHaveClass('md:hidden')
    expect(mobile().getAllByRole('listitem')).toHaveLength(3)
    expect(desktop().getAllByRole('row')).toHaveLength(4)

    expect(desktop().getByRole('checkbox', { name: 'Seleccionar Camila Torres' })).toBeInTheDocument()
    expect(mobile().getByRole('checkbox', { name: 'Seleccionar Camila Torres' })).toBeInTheDocument()
    expect(
      mobile().getByRole('combobox', { name: 'Cambiar estado de Camila Torres' }),
    ).toBeInTheDocument()
  })

  it('permite seleccionar filas y muestra la barra de acciones masivas', async () => {
    const user = userEvent.setup()
    const { onStatusChange } = renderTable()

    await user.click(desktop().getByRole('checkbox', { name: 'Seleccionar Camila Torres' }))

    const bar = screen.getByRole('group', { name: 'Acciones masivas' })
    expect(within(bar).getByText('1 seleccionado')).toBeInTheDocument()
    expect(desktop().getByRole('checkbox', { name: 'Seleccionar todos' })).toBePartiallyChecked()
    expect(onStatusChange).not.toHaveBeenCalled()

    await user.click(within(bar).getByRole('button', { name: 'Cancelar selección' }))

    expect(screen.queryByRole('group', { name: 'Acciones masivas' })).not.toBeInTheDocument()
  })

  it('marca todas las filas desde el checkbox del header y aplica una acción masiva', async () => {
    const user = userEvent.setup()
    const { onStatusChange } = renderTable()

    await user.click(desktop().getByRole('checkbox', { name: 'Seleccionar todos' }))

    const bar = screen.getByRole('group', { name: 'Acciones masivas' })
    expect(within(bar).getByText('3 seleccionados')).toBeInTheDocument()
    expect(desktop().getByRole('checkbox', { name: 'Seleccionar todos' })).toBeChecked()

    await user.click(within(bar).getByRole('button', { name: 'Marcar como aprobado' }))

    expect(onStatusChange).toHaveBeenCalledTimes(3)
    expect(onStatusChange).toHaveBeenCalledWith('ap1', 'aprobado')
    expect(onStatusChange).toHaveBeenCalledWith('ap2', 'aprobado')
    expect(onStatusChange).toHaveBeenCalledWith('ap3', 'aprobado')
    expect(screen.queryByRole('group', { name: 'Acciones masivas' })).not.toBeInTheDocument()

    const toast = screen.getByRole('status')
    expect(toast).toHaveTextContent('3 estados cambiados a Aprobado')

    await user.click(within(toast).getByRole('button', { name: 'Deshacer' }))
    expect(onStatusChange).toHaveBeenLastCalledWith('ap3', 'pendiente')
  })

  it('ordena por las columnas ordenables con aria-sort', async () => {
    const user = userEvent.setup()
    renderTable()

    const postulado = screen.getByRole('columnheader', { name: /Postulado/ })
    expect(postulado).toHaveAttribute('aria-sort', 'descending')
    expect(screen.getByRole('columnheader', { name: /Seguidores/ })).toHaveAttribute('aria-sort', 'none')
    expect(screen.getByRole('columnheader', { name: /Viewers/ })).toHaveAttribute('aria-sort', 'none')
    expect(firstDesktopRow()).toContain('Camila Torres')

    await user.click(
      within(screen.getByRole('columnheader', { name: /Seguidores/ })).getByRole('button', {
        name: 'Ordenar por Seguidores',
      }),
    )

    expect(screen.getByRole('columnheader', { name: /Seguidores/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    )
    expect(screen.getByRole('columnheader', { name: /Postulado/ })).toHaveAttribute('aria-sort', 'none')
    expect(firstDesktopRow()).toContain('Antonia Rojas')

    await user.click(
      within(screen.getByRole('columnheader', { name: /Seguidores/ })).getByRole('button', {
        name: 'Ordenar por Seguidores',
      }),
    )

    expect(screen.getByRole('columnheader', { name: /Seguidores/ })).toHaveAttribute(
      'aria-sort',
      'ascending',
    )
    expect(firstDesktopRow()).toContain('Javier Peña')

    await user.click(
      within(screen.getByRole('columnheader', { name: /Postulado/ })).getByRole('button', {
        name: 'Ordenar por Postulado',
      }),
    )

    expect(screen.getByRole('columnheader', { name: /Postulado/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    )
    expect(firstDesktopRow()).toContain('Camila Torres')
  })

  it('persiste el filtro de estado y el orden entre sesiones', async () => {
    const user = userEvent.setup()
    const { unmount } = renderTable()

    await user.click(screen.getByRole('button', { name: 'Aprobado' }))
    await user.click(
      within(screen.getByRole('columnheader', { name: /Seguidores/ })).getByRole('button', {
        name: 'Ordenar por Seguidores',
      }),
    )

    const raw = localStorage.getItem(PANEL_PREFS_KEY)
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw ?? '{}')).toMatchObject({
      statusFilter: 'aprobado',
      sortKey: 'followers',
      sortDir: 'desc',
    })

    unmount()
    renderTable()

    expect(screen.getByRole('button', { name: 'Aprobado' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('columnheader', { name: /Seguidores/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    )
    expect(screen.getByText('1 de 3 postulantes')).toBeInTheDocument()
  })

  it('muestra un estado vacío con CTA cuando no hay postulantes', () => {
    renderTable([])

    expect(screen.getByText('Aún no hay postulantes')).toBeInTheDocument()
    const cta = screen.getByRole('link', { name: /Ir a la landing/ })
    expect(cta).toHaveAttribute('href', '#/')
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText(searchPlaceholder)).not.toBeInTheDocument()
    expect(screen.getByText('0 de 0 postulantes')).toBeInTheDocument()

    expect(
      screen.getByRole('group', { name: 'Exportar y respaldar datos' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Restaurar datos demo' })).toBeInTheDocument()
  })

  it('abre la ficha del postulante desde la tabla y desde las tarjetas', async () => {
    const user = userEvent.setup()
    const { onSelect } = renderTable()

    await user.click(desktop().getAllByRole('button', { name: /Camila Torres/ })[0])
    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 'ap1' }))

    await user.click(mobile().getAllByRole('button', { name: /Camila Torres/ })[0])
    expect(onSelect).toHaveBeenCalledTimes(2)
  })

  it('refleja la restauración de datos demo en la tabla (replaceAll compartido)', async () => {
    const user = userEvent.setup()

    saveApplicants([applicants[0] as Applicant])
    resetApplicantsStore()

    render(<StoreTable onSelect={vi.fn()} onStatusChange={vi.fn()} />)

    expect(screen.getByText('1 de 1 postulantes')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Restaurar datos demo' }))

    await waitFor(
      () =>
        expect(
          screen.getByText(`${seedApplicants.length} de ${seedApplicants.length} postulantes`),
        ).toBeInTheDocument(),
      { timeout: 2000 },
    )
    expectVisible('Camila Torres')
    expect(loadApplicants()).toHaveLength(seedApplicants.length)
  })
})
