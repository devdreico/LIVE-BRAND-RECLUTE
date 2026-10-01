import { describe, expect, it } from 'vitest'
import { avatarColor, formatCompact, formatDate, initials, isStatus } from './ui'

const AVATAR_CATALOG = [
  'from-brand-500 to-glow',
  'from-fuchsia-500 to-brand-500',
  'from-violet-500 to-indigo-500',
  'from-purple-500 to-pink-500',
  'from-indigo-500 to-brand-400',
  'from-pink-500 to-rose-500',
]

describe('formatCompact', () => {
  it('formatea números grandes en notación compacta en español', () => {
    const big = formatCompact(1500000)

    expect(big).not.toBe('1500000')
    expect(big).toMatch(/1[,.]5\s?M/i)
  })

  it('usa el sufijo "mil" para miles', () => {
    expect(formatCompact(1250)).toMatch(/mil/i)
    expect(formatCompact(1250)).not.toBe('1250')
  })

  it('mantiene los números pequeños', () => {
    expect(formatCompact(0)).toBe('0')
    expect(formatCompact()).toBe('0')
    expect(formatCompact(42)).toBe('42')
  })
})

describe('formatDate', () => {
  it('devuelve un guion largo para fecha vacía', () => {
    expect(formatDate('')).toBe('—')
    expect(formatDate()).toBe('—')
  })

  it('devuelve un guion largo para fecha inválida', () => {
    expect(formatDate('esto-no-es-una-fecha')).toBe('—')
  })

  it('formatea fechas ISO válidas', () => {
    const formatted = formatDate('2024-05-09T12:00:00.000Z')

    expect(formatted).not.toBe('—')
    expect(formatted).toMatch(/2024/)
    expect(formatted).toMatch(/may/i)
  })
})

describe('avatarColor', () => {
  it('es determinista para la misma semilla', () => {
    expect(avatarColor('Camila Torres')).toBe(avatarColor('Camila Torres'))
    expect(avatarColor('@tucuenta')).toBe(avatarColor('@tucuenta'))
    expect(avatarColor()).toBe(avatarColor(''))
  })

  it('siempre devuelve una clase del catálogo', () => {
    const seeds = ['', 'a', 'Camila Torres', 'Javier Peña', '@sebalagos', 'Zzz', '1234567890']

    for (const seed of seeds) {
      expect(AVATAR_CATALOG).toContain(avatarColor(seed))
    }
  })
})

describe('initials', () => {
  it('toma la primera letra de los dos primeros nombres', () => {
    expect(initials('Camila Torres')).toBe('CT')
    expect(initials('Ana María de la Cruz')).toBe('AM')
    expect(initials('sebastián')).toBe('S')
  })

  it('devuelve cadena vacía sin nombre', () => {
    expect(initials()).toBe('')
    expect(initials('')).toBe('')
  })
})

describe('isStatus', () => {
  it('acepta estados válidos', () => {
    expect(isStatus('aprobado')).toBe(true)
    expect(isStatus('pendiente')).toBe(true)
    expect(isStatus('contactado')).toBe(true)
    expect(isStatus('rechazado')).toBe(true)
  })

  it('rechaza valores que no son estados', () => {
    expect(isStatus('foo')).toBe(false)
    expect(isStatus('')).toBe(false)
    expect(isStatus('Aprobado')).toBe(false)
  })
})
