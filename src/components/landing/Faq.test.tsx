import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { faqItems } from '../../data/faq'
import Faq from './Faq'

const questions = faqItems.map((item) => item.question)

function panelOf(button: HTMLElement): HTMLElement | null {
  const id = button.getAttribute('aria-controls')
  return id ? document.getElementById(id) : null
}

describe('Faq', () => {
  it('renderiza al menos 6 preguntas reales', () => {
    render(<Faq />)

    expect(screen.getByRole('heading', { level: 2, name: /preguntas frecuentes/i })).toBeInTheDocument()
    expect(questions.length).toBeGreaterThanOrEqual(6)
    for (const question of questions) {
      expect(screen.getByRole('button', { name: question })).toBeInTheDocument()
    }
  })

  it('usa botones con aria-expanded y aria-controls válidos', () => {
    render(<Faq />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(questions.length)

    for (const button of buttons) {
      expect(button).toHaveAttribute('aria-expanded')
      const controls = button.getAttribute('aria-controls')
      expect(controls).toBeTruthy()
      const panel = controls ? document.getElementById(controls) : null
      expect(panel).toBeInTheDocument()
    }

    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true')
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'false')
    expect(panelOf(buttons[1] as HTMLElement)).toHaveAttribute('hidden')
    expect(panelOf(buttons[1] as HTMLElement)).not.toBeVisible()
    expect(panelOf(buttons[0] as HTMLElement)).toBeVisible()
  })

  it('abre y cierra respuestas al hacer click', async () => {
    const user = userEvent.setup()
    render(<Faq />)

    const first = screen.getByRole('button', { name: questions[0] as string })
    const second = screen.getByRole('button', { name: questions[1] as string })

    expect(panelOf(first)).not.toHaveAttribute('hidden')
    expect(
      screen.queryByText(/Trabajamos por comisión sobre los ingresos/i),
    ).toBeInTheDocument()

    await user.click(second)

    expect(second).toHaveAttribute('aria-expanded', 'true')
    expect(first).toHaveAttribute('aria-expanded', 'false')
    expect(panelOf(second)).not.toHaveAttribute('hidden')
    expect(panelOf(first)).toHaveAttribute('hidden')
    expect(screen.getByText(/Mínimo 1.000 seguidores o 100 viewers promedio/i)).toBeInTheDocument()

    await user.click(second)

    expect(second).toHaveAttribute('aria-expanded', 'false')
    expect(panelOf(second)).toHaveAttribute('hidden')
  })

  it('responde las dudas clave de conversión', () => {
    render(<Faq />)

    expect(screen.getByRole('button', { name: /costo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pagos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /exclusividad|otra agencia/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /categorías/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cuenta pequeña/i })).toBeInTheDocument()
  })
})
