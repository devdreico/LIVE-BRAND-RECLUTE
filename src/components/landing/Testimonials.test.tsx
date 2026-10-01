import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Testimonials from './Testimonials'

describe('Testimonials', () => {
  it('renderiza 3 tarjetas con cita, autor y métrica', () => {
    const { container } = render(<Testimonials />)

    expect(
      screen.getByRole('heading', { level: 2, name: /creadores que ya crecieron/i }),
    ).toBeInTheDocument()

    expect(container.querySelectorAll('figure')).toHaveLength(3)
    expect(container.querySelectorAll('blockquote')).toHaveLength(3)
    expect(container.querySelectorAll('figcaption')).toHaveLength(3)

    expect(screen.getByText('@sofiarivas')).toBeInTheDocument()
    expect(screen.getByText('@mateocruz')).toBeInTheDocument()
    expect(screen.getByText('@vale.mora')).toBeInTheDocument()

    expect(screen.getByText('+180% de regalos en 60 días')).toBeInTheDocument()
    expect(screen.getByText('3.4x vistas medias en 90 días')).toBeInTheDocument()
    expect(screen.getByText('+12.000 seguidores en 60 días')).toBeInTheDocument()
  })

  it('usa citas creíbles y coherentes con los streamers del catálogo', () => {
    render(<Testimonials />)

    expect(screen.getByText(/Transmitía sola y sin rumbo/i)).toBeInTheDocument()
    expect(screen.getByText(/karaoke de los viernes/i)).toBeInTheDocument()
    expect(screen.getByText(/cuenta chica y muy pocas horas/i)).toBeInTheDocument()
  })
})
