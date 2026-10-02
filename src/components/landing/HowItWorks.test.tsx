import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HowItWorks from './HowItWorks'

describe('HowItWorks', () => {
  it('renderiza los 4 pasos del plan de reclutamiento en una lista ordenada', () => {
    render(<HowItWorks />)

    expect(screen.getByRole('heading', { level: 2, name: /cómo funciona/i })).toBeInTheDocument()
    expect(screen.getByText(/plan de reclutamiento/i)).toBeInTheDocument()

    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(4)

    expect(
      screen.getByRole('heading', { level: 3, name: /postula gratis, sin cv/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /te contacta un pilar de la agencia/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /llamada de diagnóstico y primeras clases/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: /primer live con equipo y plan medible/i }),
    ).toBeInTheDocument()
  })

  it('muestra tiempos explícitos de contacto (48 h / máximo 3 días)', () => {
    render(<HowItWorks />)

    expect(screen.getByText(/días 1 a 3 · contacto de un pilar/i)).toBeInTheDocument()
    expect(
      screen.getByText(/te escribe en menos de 48 h \(máximo 3 días\)/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/semana 1 · diagnóstico \+ clases/i)).toBeInTheDocument()
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
