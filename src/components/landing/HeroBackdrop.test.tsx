import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HeroBackdrop from './HeroBackdrop'

describe('HeroBackdrop', () => {
  it('renderiza un canvas decorativo oculto para lectores de pantalla', () => {
    const { container } = render(
      <div className="relative h-40">
        <HeroBackdrop />
      </div>,
    )

    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
    expect(canvas).toHaveClass('pointer-events-none')
  })

  it('no lanza errores si el navegador no soporta getContext (jsdom)', () => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = () => null

    expect(() =>
      render(
        <div className="relative h-40">
          <HeroBackdrop />
        </div>,
      ),
    ).not.toThrow()

    HTMLCanvasElement.prototype.getContext = original
  })
})
