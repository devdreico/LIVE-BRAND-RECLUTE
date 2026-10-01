import { beforeEach, describe, expect, it } from 'vitest'
import type { Applicant } from '../types'
import { seedApplicants } from '../data/seedApplicants'
import {
  SCHEMA_VERSION,
  STORAGE_KEY,
  exportApplicants,
  importApplicants,
  loadApplicants,
  saveApplicants,
  seedIfEmpty,
} from './applicantStorage'

function makeApplicant(overrides: Partial<Applicant> = {}): Applicant {
  return {
    id: 'ap_test_1',
    name: 'Test User',
    handle: '@testuser',
    platform: 'TikTok',
    followers: 1200,
    avgViewers: 300,
    hoursPerWeek: 10,
    category: 'Gaming',
    email: 'test@example.com',
    status: 'pendiente',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

describe('applicantStorage', () => {
  beforeEach(() => localStorage.clear())

  describe('loadApplicants', () => {
    it('devuelve null cuando no hay clave almacenada', () => {
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
      expect(loadApplicants()).toBeNull()
    })

    it('devuelve un array vacío si se guardó la lista vacía v1 (no resucita la semilla)', () => {
      localStorage.setItem(STORAGE_KEY, '[]')

      const loaded = loadApplicants()

      expect(loaded).toEqual([])
      expect(loaded).not.toBeNull()
      expect(loaded).not.toEqual(seedApplicants)
    })

    it('parsea el formato v1 (array plano)', () => {
      const items = [makeApplicant({ id: 'v1_a', name: 'Ana V1' }), makeApplicant({ id: 'v1_b', name: 'Bruno V1' })]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

      const loaded = loadApplicants()

      expect(loaded).toHaveLength(2)
      expect(loaded?.map((item) => item.id)).toEqual(['v1_a', 'v1_b'])
      expect(loaded?.[0].name).toBe('Ana V1')
    })

    it('parsea el formato v2 ({ version: 2, applicants })', () => {
      const items = [makeApplicant({ id: 'v2_a', name: 'Carla V2', status: 'aprobado' })]
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: SCHEMA_VERSION, applicants: items }),
      )

      const loaded = loadApplicants()

      expect(loaded).toHaveLength(1)
      expect(loaded?.[0]).toEqual(items[0])
    })
  })

  describe('saveApplicants', () => {
    it('escribe el payload v2 con version: 2', () => {
      const items = [makeApplicant({ id: 'save_1' })]

      expect(saveApplicants(items)).toBe(true)

      const raw = localStorage.getItem(STORAGE_KEY)
      expect(raw).not.toBeNull()
      const parsed = JSON.parse(raw ?? '{}') as { version?: number; applicants?: Applicant[] }
      expect(parsed.version).toBe(2)
      expect(parsed.applicants).toHaveLength(1)
      expect(parsed.applicants?.[0].id).toBe('save_1')
    })

    it('hace round-trip con loadApplicants', () => {
      const items = [makeApplicant({ id: 'rt_1' }), makeApplicant({ id: 'rt_2', status: 'rechazado' })]
      saveApplicants(items)

      expect(loadApplicants()).toEqual(items)
    })
  })

  describe('exportApplicants / importApplicants', () => {
    it('hace round-trip completo', () => {
      const items = [
        makeApplicant({ id: 'exp_1', name: 'Export Uno' }),
        makeApplicant({ id: 'exp_2', name: 'Export Dos', status: 'contactado' }),
      ]

      const raw = exportApplicants(items)

      expect(JSON.parse(raw) as { version: number }).toMatchObject({ version: SCHEMA_VERSION })
      expect(importApplicants(raw)).toEqual(items)
    })

    it('lanza error con JSON inválido', () => {
      expect(() => importApplicants('{ esto no es json')).toThrow()
    })

    it('lanza error con un objeto sin applicants', () => {
      expect(() => importApplicants(JSON.stringify({ version: SCHEMA_VERSION }))).toThrow(
        'Formato de backup no válido',
      )
    })
  })

  describe('seedIfEmpty', () => {
    it('devuelve la semilla cuando loadApplicants() es null', () => {
      expect(loadApplicants()).toBeNull()
      expect(seedIfEmpty()).toBe(seedApplicants)
      expect(seedIfEmpty()).toHaveLength(seedApplicants.length)
    })

    it('devuelve [] cuando hay una lista vacía guardada', () => {
      saveApplicants([])

      expect(loadApplicants()).toEqual([])
      expect(seedIfEmpty()).toEqual([])
    })
  })
})
