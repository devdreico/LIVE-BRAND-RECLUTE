import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HowItWorks from './HowItWorks'

describe('HowItWorks', () => {
  it('renderiza los 4 pasos en una lista ordenada semántica', () => {
    render(<HowItWorks />)

    expect(screen.getByRole('heading', { level: 2, name: /cómo funciona/i })).toBeInTheDocument()

    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(4)

    expect(
      screen.getByRole('heading', { level: 3, name: /postula en 2 minutos/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /llamada de diagnóstico en menos de 48 h/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /onboarding y plan de crecimiento/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /primer live con equipo y estructura/i }),
    ).toBeInTheDocument()
  })

  it('muestra la escasez honesta junto al CTA de la sección', () => {
    render(<HowItWorks />)

    expect(screen.getByRole('link', { name: /empezar mi postulación/i })).toHaveAttribute(
      'href',
      '#postular',
    )
    expect(screen.getByText(/cupos limitados por categoría este mes/i)).toBeInTheDocument()
  })
})
