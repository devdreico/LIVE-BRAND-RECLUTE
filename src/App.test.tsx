import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
})

describe('App', () => {
  it('renderiza la landing cuando el hash está vacío', () => {
    expect(window.location.hash).toBe('')

    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /lives en TikTok/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /panel interno/i })).toBeInTheDocument()
  })

  it('renderiza el panel con hash #/panel', async () => {
    window.location.hash = '#/panel'

    render(<App />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Resumen de la convocatoria' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /lives en TikTok/ })).not.toBeInTheDocument()
  })

  it('renderiza el 404 con un hash desconocido', () => {
    window.location.hash = '#/noexiste'

    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Página no encontrada' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /lives en TikTok/ })).not.toBeInTheDocument()
  })

  it('incluye plan, top de referentes, requisitos y FAQ en la landing', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 2, name: /cómo funciona/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /requisitos mínimos/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /preguntas frecuentes/i })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /top de colombia/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: /pocos cupos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/no son clientes de la agencia/i),
    ).toBeInTheDocument()

    expect(screen.getAllByRole('listitem').length).toBeGreaterThanOrEqual(4)
    expect(screen.getByRole('button', { name: /qué categorías aceptan/i })).toBeInTheDocument()
    expect(screen.getByText('92% de aprobación en postulaciones')).toBeInTheDocument()
    expect(screen.getByLabelText('@ de TikTok')).toBeInTheDocument()
    expect(
      screen.getAllByText(/te contactamos en menos de 48 h \(máximo 3 días\)/i).length,
    ).toBeGreaterThan(0)
    expect(screen.getByText('Carlos Feria')).toBeInTheDocument()
    expect(screen.getByText(/@carlosferiag/)).toBeInTheDocument()
  })

  it('no muestra secciones con datos de ejemplo eliminadas', () => {
    render(<App />)

    expect(screen.queryByRole('heading', { name: /ya crecieron/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /los números de nuestra comunidad/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /streamers/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /métricas/i })).not.toBeInTheDocument()
  })

  it('cambia de ruta al disparar hashchange', async () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /lives en TikTok/ }),
    ).toBeInTheDocument()

    await act(async () => {
      window.location.hash = '#/panel'
      window.dispatchEvent(new Event('hashchange'))
    })

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Resumen de la convocatoria' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /lives en TikTok/ })).not.toBeInTheDocument()
  })
})
