import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import type { Applicant, NewApplicantData } from '../types'
import { STORAGE_KEY, saveApplicants } from '../services/applicantStorage'
import { resetApplicantsStore, useApplicants } from './useApplicants'

function makeApplicant(overrides: Partial<Applicant> = {}): Applicant {
  return {
    id: `ap_${Math.random().toString(36).slice(2, 8)}`,
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

function makeNewData(overrides: Partial<NewApplicantData> = {}): NewApplicantData {
  return {
    name: 'Nuevo Postulante',
    handle: '@nuevo',
    followers: 5000,
    avgViewers: 420,
    hoursPerWeek: 12,
    email: 'nuevo@example.com',
    ...overrides,
  }
}

function storedApplicants(): { version?: number; applicants?: Applicant[] } {
  const raw = localStorage.getItem(STORAGE_KEY) ?? '{}'
  return JSON.parse(raw) as { version?: number; applicants?: Applicant[] }
}

describe('useApplicants', () => {
  beforeEach(() => {
    localStorage.clear()
    resetApplicantsStore()
  })

  describe('stats', () => {
    const list = [
      makeApplicant({ id: 's1', status: 'aprobado', followers: 100, avgViewers: 10, hoursPerWeek: 1 }),
      makeApplicant({ id: 's2', status: 'aprobado', followers: 200, avgViewers: 20, hoursPerWeek: 2 }),
      makeApplicant({ id: 's3', status: 'rechazado', followers: 300, avgViewers: 30, hoursPerWeek: 3 }),
      makeApplicant({ id: 's4', status: 'pendiente', followers: 400, avgViewers: 40, hoursPerWeek: 4 }),
    ]

    it('avgViewers es el promedio (no la suma)', () => {
      saveApplicants(list)

      const { result } = renderHook(() => useApplicants())
      const viewersSum = list.reduce((sum, item) => sum + item.avgViewers, 0)

      expect(result.current.stats.avgViewers).toBe(25)
      expect(result.current.stats.avgViewers).not.toBe(viewersSum)
    })

    it('followersSum y hoursSum son sumas', () => {
      saveApplicants(list)

      const { result } = renderHook(() => useApplicants())

      expect(result.current.stats.followersSum).toBe(1000)
      expect(result.current.stats.hoursSum).toBe(10)
      expect(result.current.stats.total).toBe(4)
      expect(result.current.stats.byStatus).toEqual({
        pendiente: 1,
        contactado: 0,
        aprobado: 2,
        rechazado: 1,
      })
    })

    it('conversion es aprobados / resueltos redondeado', () => {
      saveApplicants(list)

      const { result } = renderHook(() => useApplicants())

      expect(result.current.stats.conversion).toBe(67)
      expect(result.current.stats.conversion).toBe(Math.round((2 / 3) * 100))
    })

    it('con lista vacía todos los stats en cero', () => {
      saveApplicants([])

      const { result } = renderHook(() => useApplicants())

      expect(result.current.stats.total).toBe(0)
      expect(result.current.stats.avgViewers).toBe(0)
      expect(result.current.stats.followersSum).toBe(0)
      expect(result.current.stats.hoursSum).toBe(0)
      expect(result.current.stats.conversion).toBe(0)
    })
  })

  describe('addApplicant', () => {
    it('agrega con status pendiente, id único y createdAt', () => {
      const { result } = renderHook(() => useApplicants())

      let created: Applicant | undefined
      act(() => {
        created = result.current.addApplicant(makeNewData())
      })

      const first = created as Applicant
      expect(first.status).toBe('pendiente')
      expect(first.id).toBeTruthy()
      expect(first.createdAt).toBeTruthy()
      expect(new Date(first.createdAt).getTime()).not.toBeNaN()
      expect(result.current.applicants[0].id).toBe(first.id)
      expect(result.current.applicants).toHaveLength(9)

      let second: Applicant | undefined
      act(() => {
        second = result.current.addApplicant(makeNewData())
      })

      expect((second as Applicant).id).not.toBe(first.id)
      expect(result.current.applicants).toHaveLength(10)
    })

    it('persiste el nuevo postulante en localStorage', () => {
      const { result } = renderHook(() => useApplicants())

      let created: Applicant | undefined
      act(() => {
        created = result.current.addApplicant(makeNewData({ name: 'Persistido Test' }))
      })

      const stored = storedApplicants()
      expect(stored.version).toBe(2)
      const found = stored.applicants?.find((item) => item.id === (created as Applicant).id)
      expect(found).toBeDefined()
      expect(found?.name).toBe('Persistido Test')
      expect(found?.status).toBe('pendiente')
    })
  })

  describe('updateStatus', () => {
    it('cambia el estado del postulante indicado', () => {
      const { result } = renderHook(() => useApplicants())
      const target = result.current.applicants.find((item) => item.status === 'pendiente')
      expect(target).toBeDefined()
      const targetId = target?.id ?? ''
      const aprobadosBefore = result.current.stats.byStatus.aprobado

      act(() => {
        result.current.updateStatus(targetId, 'aprobado')
      })

      const updated = result.current.applicants.find((item) => item.id === targetId)
      expect(updated?.status).toBe('aprobado')
      expect(updated?.updatedAt).toBeDefined()
      expect(result.current.stats.byStatus.aprobado).toBe(aprobadosBefore + 1)
      expect(result.current.stats.byStatus.pendiente).toBe(1)
    })

    it('agrega la entrada al historial con el estado nuevo y la fecha', () => {
      const { result } = renderHook(() => useApplicants())
      const target = result.current.applicants.find((item) => item.status === 'pendiente')
      const targetId = target?.id ?? ''

      act(() => {
        result.current.updateStatus(targetId, 'contactado')
      })

      const updated = result.current.applicants.find((item) => item.id === targetId)
      expect(updated?.history).toHaveLength(1)
      expect(updated?.history?.[0]?.status).toBe('contactado')
      expect(new Date(updated?.history?.[0]?.at ?? '').getTime()).not.toBeNaN()

      act(() => {
        result.current.updateStatus(targetId, 'aprobado')
      })

      const twice = result.current.applicants.find((item) => item.id === targetId)
      expect(twice?.history?.map((entry) => entry.status)).toEqual(['contactado', 'aprobado'])
    })

    it('no agrega historial cuando el estado no cambia', () => {
      const { result } = renderHook(() => useApplicants())
      const target = result.current.applicants[0]

      act(() => {
        result.current.updateStatus(target.id, target.status)
      })

      const unchanged = result.current.applicants.find((item) => item.id === target.id)
      expect(unchanged?.history).toBeUndefined()
      expect(unchanged).toEqual(target)
    })
  })

  describe('replaceAll', () => {
    it('reemplaza la lista completa y la persiste', () => {
      const { result } = renderHook(() => useApplicants())
      const next = [
        makeApplicant({ id: 'bulk_1', name: 'Backup Uno' }),
        makeApplicant({ id: 'bulk_2', name: 'Backup Dos', status: 'aprobado' }),
      ]

      act(() => {
        result.current.replaceAll(next)
      })

      expect(result.current.applicants).toHaveLength(2)
      expect(result.current.applicants.map((item) => item.id)).toEqual(['bulk_1', 'bulk_2'])
      expect(storedApplicants().applicants).toHaveLength(2)
      expect(result.current.stats.total).toBe(2)
    })

    it('comparte el cambio entre instancias del mismo hook', () => {
      const first = renderHook(() => useApplicants())
      const second = renderHook(() => useApplicants())
      const next = [makeApplicant({ id: 'shared_1', name: 'Compartido' })]

      act(() => {
        first.result.current.replaceAll(next)
      })

      expect(second.result.current.applicants.map((item) => item.id)).toEqual(['shared_1'])
      expect(second.result.current.stats.total).toBe(1)
    })
  })

  describe('removeApplicant', () => {
    it('elimina el postulante indicado', () => {
      const { result } = renderHook(() => useApplicants())
      const target = result.current.applicants[0]
      const totalBefore = result.current.stats.total

      act(() => {
        result.current.removeApplicant(target.id)
      })

      expect(result.current.applicants.find((item) => item.id === target.id)).toBeUndefined()
      expect(result.current.stats.total).toBe(totalBefore - 1)
      expect(result.current.applicants).toHaveLength(totalBefore - 1)
    })
  })
})
