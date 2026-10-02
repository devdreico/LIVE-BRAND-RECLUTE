import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import type { Applicant, NewApplicantData } from '../../types'
import { submitToFormspree } from '../../services/formspree'
import { LogoMark } from '../Logo'

type FormState = {
  name: string
  handle: string
  followers: string
  avgViewers: string
  hoursPerWeek: string
  category: string
  email: string
  phone: string
  availability: string
  source: string
  note: string
}

type FormErrors = Partial<Record<keyof FormState, string>>

type Step = 1 | 2

type SendStatus = 'idle' | 'sending' | 'failed'

const initialForm: FormState = {
  name: '',
  handle: '',
  followers: '',
  avgViewers: '',
  hoursPerWeek: '',
  category: '',
  email: '',
  phone: '',
  availability: '',
  source: '',
  note: '',
}

const categories = ['Gaming', 'Música en vivo', 'Lifestyle', 'Q&A / Charla', 'Deportes', 'Belleza', 'Otro']

const sources = [
  'TikTok (un live o un video)',
  'Instagram / YouTube',
  'Me lo recomendó un amigo',
  'Búsqueda en Google',
  'Otro',
]

const perks = [
  'Clases en vivo con profesionales de TikTok y coaches de crecimiento digital',
  'Asesorías 1:1 de estrategia, ritmo y comunidad para cada transmisión',
  'Plan de diamantes: más regalos, más vistas y más ingresos por live',
  'Sin costo de inscripción, sin matrícula y sin permanencia mínima',
]

const nextSteps = [
  'Envías tu perfil de TikTok en 2 minutos',
  'En menos de 48 h (máx. 3 días) te contacta un pilar de la agencia',
  'Entras a las clases gratuitas y arrancas tu plan de crecimiento',
]

const normalizeHandle = (value: string): string =>
  value.trim().replace(/^@+/, '').toLowerCase()

interface ApplyFormProps {
  onSubmit: (data: NewApplicantData) => Applicant
  takenHandles?: string[]
}

export default function ApplyForm({ onSubmit, takenHandles = [] }: ApplyFormProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [step, setStep] = useState<Step>(1)
  const [submitted, setSubmitted] = useState<Applicant | null>(null)
  const [status, setStatus] = useState<SendStatus>('idle')
  const [sendError, setSendError] = useState<string | null>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    stepHeadingRef.current?.focus()
  }, [step])

  const update =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
      const { value } = event.target
      setForm((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

  const takenSet = takenHandles.map(normalizeHandle)

  const validateStep = (target: Step): FormErrors => {
    const next: FormErrors = {}

    if (target === 1) {
      if (!/^@?[a-zA-Z0-9._]{2,}$/.test(form.handle.trim())) next.handle = 'Ejemplo: @tucuenta'
      else if (takenSet.includes(normalizeHandle(form.handle)))
        next.handle = 'Ese @ ya está en revisión'
      if (!form.followers || Number(form.followers) < 0) next.followers = 'Indica tus seguidores'
      if (!form.avgViewers || Number(form.avgViewers) < 0) next.avgViewers = 'Indica viewers promedio'
      if (form.hoursPerWeek && Number(form.hoursPerWeek) < 0)
        next.hoursPerWeek = 'Indica horas válidas'
      if (!form.category) next.category = 'Selecciona una categoría'
    } else {
      if (form.name.trim().length < 3) next.name = 'Ingresa tu nombre completo'
      if (!form.email.includes('@')) next.email = 'Email inválido'
    }

    return next
  }

  const goToStep2 = (): void => {
    const nextErrors = validateStep(1)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setErrors({})
    setStep(2)
  }

  const goToStep1 = (): void => {
    setErrors({})
    setStep(1)
  }

  const buildPayload = (data: NewApplicantData): Record<string, string> => ({
    _subject: `Nueva inscripción Live Brand · ${data.handle}`,
    _gotcha: '',
    fuente: 'Landing · Inscripción gratuita',
    url: typeof window === 'undefined' ? '' : window.location.href,
    nombre: data.name,
    tiktok: data.handle,
    email: data.email,
    telefono: data.phone?.trim() || 'No indicado',
    categoria: data.category ?? 'Sin categoría',
    seguidores: String(data.followers),
    viewers_promedio: String(data.avgViewers),
    horas_semana: data.hoursPerWeek ? String(data.hoursPerWeek) : 'No indicadas',
    disponibilidad: data.availability?.trim() || 'No indicada',
    como_enteraste: data.source?.trim() || 'No indicado',
    mensaje: data.note?.trim() || 'Sin mensaje',
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (step === 1) {
      goToStep2()
      return
    }

    if (status === 'sending') return

    const step1Errors = validateStep(1)
    if (Object.keys(step1Errors).length) {
      setErrors(step1Errors)
      setStep(1)
      return
    }

    const step2Errors = validateStep(2)
    if (Object.keys(step2Errors).length) {
      setErrors(step2Errors)
      return
    }

    const normalized: NewApplicantData = {
      ...form,
      name: form.name.trim(),
      handle: form.handle.trim().startsWith('@') ? form.handle.trim() : `@${form.handle.trim()}`,
      followers: Number(form.followers),
      avgViewers: Number(form.avgViewers),
      hoursPerWeek: Number(form.hoursPerWeek || 0),
    }

    void (async () => {
      setStatus('sending')
      setSendError(null)

      const result = await submitToFormspree(buildPayload(normalized))

      if (!result.ok) {
        setStatus('failed')
        setSendError(result.error)
        return
      }

      const applicant = onSubmit(normalized)
      setSubmitted(applicant)
      setForm(initialForm)
      setErrors({})
      setStep(1)
      setStatus('idle')
      setSendError(null)
    })()
  }

  const fieldAria = (field: keyof FormErrors) =>
    errors[field]
      ? ({ 'aria-invalid': true, 'aria-describedby': `${field}-error` } as const)
      : {}

  const errorFor = (field: keyof FormErrors): ReactNode =>
    errors[field] ? (
      <p id={`${field}-error`} role="alert" className="mt-1.5 text-xs text-rose-300">
        {errors[field]}
      </p>
    ) : null

  if (submitted) {
    return (
      <section id="postular" className="relative scroll-mt-24 py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/20 blur-[130px]" />
        <div className="container-page relative">
          <div className="card mx-auto max-w-2xl animate-fade-up p-8 text-center sm:p-12" role="status" aria-live="polite">
            <div className="relative mx-auto h-16 w-16">
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-brand-400/40 bg-ink-900 shadow-glow">
                <LogoMark tone="dark" className="h-10 w-10 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]" />
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white ring-4 ring-ink-800">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5">
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            <span className="mt-6 inline-flex rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-200">
              Inscripción gratuita
            </span>

            <h3 className="mt-4 font-display text-3xl font-bold text-white">¡Inscripción enviada!</h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
              Listo, <span className="text-brand-300">{submitted.name}</span>. Tu perfil de{' '}
              <span className="text-brand-300">{submitted.handle}</span> quedó en revisión con estado{' '}
              <span className="text-amber-300">Pendiente</span>. Te escribimos a{' '}
              <span className="text-brand-300">{submitted.email}</span> en menos de 48 h (máximo
              3 días) un pilar de la agencia, con tu diagnóstico gratis.
            </p>

            <ol className="mx-auto mt-8 grid max-w-md gap-3 text-left">
              {nextSteps.map((item, index) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow font-display text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#referentes" className="btn-primary">
                Ver los top de Colombia
              </a>
              <button onClick={() => setSubmitted(null)} className="btn-ghost">
                Inscribir otro perfil
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="postular" className="relative scroll-mt-24 py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/20 blur-[130px]" />

      <div className="container-page relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <span className="eyebrow animate-fade-up">
              <LogoMark tone="dark" className="h-4 w-4" alt="" />
              Inscripción 100% gratuita
            </span>
            <h2 className="section-title mt-6 animate-fade-up">
              Aprende con profesionales de <span className="text-brand-300">TikTok</span> y sube
              tus <span className="text-brand-300">diamantes</span>
            </h2>
            <p className="mt-5 animate-fade-up text-white/60">
              Live Brand es la agencia oficial de TikTok LIVE en LATAM. Tomamos a creadores que ya
              hacen lives y los formamos con clases y asesorías directas de profesionales de la
              plataforma y de crecimiento digital: mejoras tu live, ganas más diamantes y construyes
              un negocio real en la app.
            </p>

            <ul className="mt-8 space-y-4">
              {perks.map((item) => (
                <li
                  key={item}
                  className="flex animate-fade-up items-start gap-3 text-sm text-white/70"
                >
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-500/20 text-brand-300">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-9 rounded-2xl border border-brand-400/25 bg-brand-500/10 p-5">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-200">
                Qué pasa después de enviar tu inscripción
              </p>
              <ol className="mt-4 space-y-3">
                {nextSteps.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow font-display text-[11px] font-bold text-white shadow-glow-sm">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-ink-800/60 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-brand-400/30 bg-ink-900/70">
                  <LogoMark tone="dark" className="h-5 w-5" />
                </span>
                <p className="text-sm text-white/70">
                  <span className="font-semibold text-brand-200">¿Ya eres parte?</span> Entra al{' '}
                  <a href="#/panel" className="font-semibold text-glow underline underline-offset-4">
                    panel interno
                  </a>{' '}
                  para gestionar postulantes.
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-white/60">
              Antes de postular, revisa los{' '}
              <a href="#requisitos" className="font-semibold text-brand-200 underline underline-offset-4">
                requisitos mínimos
              </a>{' '}
              de la convocatoria.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card animate-fade-up p-7 sm:p-9" noValidate>
            <div className="mb-7">
              <div className="flex items-center justify-between gap-4 font-display text-[11px] font-semibold uppercase tracking-[0.18em]">
                <span className={step === 1 ? 'text-brand-200' : 'text-white/60'}>
                  1 · Tu perfil
                </span>
                <span className={step === 2 ? 'text-brand-200' : 'text-white/60'}>
                  2 · Contacto
                </span>
              </div>
              <div
                className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-label="Progreso de la postulación"
                aria-valuemin={1}
                aria-valuemax={2}
                aria-valuenow={step}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-glow transition-[width] duration-500"
                  style={{ width: step === 1 ? '50%' : '100%' }}
                />
              </div>
              <h3
                ref={stepHeadingRef}
                tabIndex={-1}
                className="mt-5 font-display text-lg font-semibold text-white"
              >
                {step === 1 ? 'Paso 1: Tu perfil' : 'Paso 2: Contacto'}
              </h3>
              <p className="mt-1 text-xs text-white/60">
                {step === 1
                  ? '2 minutos, sin CV y sin costo. Cuéntanos cómo está tu cuenta de TikTok hoy.'
                  : '¿Cómo te contactamos para tu clase de diagnóstico gratuita?'}
              </p>
            </div>

            <input
              type="text"
              name="_gotcha"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              value=""
              onChange={() => undefined}
            />

            {step === 1 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="handle">@ de TikTok</label>
                  <input id="handle" {...fieldAria('handle')} className="input" placeholder="@tucuenta" value={form.handle} onChange={update('handle')} />
                  {errorFor('handle')}
                </div>

                <div>
                  <label className="label" htmlFor="category">Categoría principal</label>
                  <select id="category" {...fieldAria('category')} className="input" value={form.category} onChange={update('category')}>
                    <option value="">Selecciona una</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {errorFor('category')}
                </div>

                <div>
                  <label className="label" htmlFor="followers">Seguidores</label>
                  <input id="followers" {...fieldAria('followers')} type="number" min="0" className="input" placeholder="Ej: 45000" value={form.followers} onChange={update('followers')} />
                  {errorFor('followers')}
                </div>

                <div>
                  <label className="label" htmlFor="avgViewers">Viewers promedio en live</label>
                  <input id="avgViewers" {...fieldAria('avgViewers')} type="number" min="0" className="input" placeholder="Ej: 850" value={form.avgViewers} onChange={update('avgViewers')} />
                  {errorFor('avgViewers')}
                </div>

                <div>
                  <label className="label" htmlFor="hoursPerWeek">Horas en vivo por semana</label>
                  <input id="hoursPerWeek" {...fieldAria('hoursPerWeek')} type="number" min="0" className="input" placeholder="Ej: 15" value={form.hoursPerWeek} onChange={update('hoursPerWeek')} />
                  {errorFor('hoursPerWeek')}
                </div>

                <p className="text-xs text-white/60 sm:col-span-2">
                  Mínimo 1.000 seguidores o 100 viewers promedio, y 5 horas semanales en vivo.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="name">Nombre completo</label>
                  <input id="name" autoComplete="name" {...fieldAria('name')} className="input" placeholder="Tu nombre y apellido" value={form.name} onChange={update('name')} />
                  {errorFor('name')}
                </div>

                <div>
                  <label className="label" htmlFor="email">Email de contacto</label>
                  <input id="email" type="email" autoComplete="email" {...fieldAria('email')} className="input" placeholder="tu@email.com" value={form.email} onChange={update('email')} />
                  {errorFor('email')}
                </div>

                <div>
                  <label className="label" htmlFor="phone">Teléfono / WhatsApp</label>
                  <input id="phone" type="tel" autoComplete="tel" {...fieldAria('phone')} className="input" placeholder="+56 9 0000 0000" value={form.phone} onChange={update('phone')} />
                </div>

                <div className="sm:col-span-2">
                  <label className="label" htmlFor="availability">Horarios disponibles</label>
                  <input id="availability" {...fieldAria('availability')} className="input" placeholder="Ej: Lunes a viernes, 18:00 – 23:00" value={form.availability} onChange={update('availability')} />
                </div>

                <div className="sm:col-span-2">
                  <label className="label" htmlFor="source">¿Cómo te enteraste de Live Brand?</label>
                  <select id="source" className="input" value={form.source} onChange={update('source')}>
                    <option value="">Selecciona una opción</option>
                    {sources.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="label" htmlFor="note">Cuéntanos de tu proyecto</label>
                  <textarea
                    id="note"
                    rows={4}
                    className="input resize-none"
                    placeholder="¿Qué lograste en tus últimas transmisiones? ¿Qué buscas en una agencia?"
                    value={form.note}
                    onChange={update('note')}
                  />
                </div>
              </div>
            )}

            <p className="mt-6 text-xs font-medium text-brand-200">
              Inscripción gratuita y sin compromiso · Cupos limitados por categoría · Te contactamos
              en menos de 48 h (máximo 3 días).
            </p>

            {sendError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-200"
              >
                <span className="font-semibold">No pudimos enviar tu inscripción.</span>{' '}
                {sendError} Tus datos siguen aquí: vuelve a intentarlo en un momento.
              </div>
            )}

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-xs text-white/60">
                <p>Solo usamos tus datos para contactarte sobre la convocatoria.</p>
                <p>Los enviamos a nuestro equipo de admisión y se guardan en este dispositivo.</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={goToStep1}
                    disabled={status === 'sending'}
                    className="btn-ghost w-full sm:w-auto"
                  >
                    Atrás
                  </button>
                )}
                {step === 1 ? (
                  <button type="button" onClick={goToStep2} className="btn-primary w-full sm:w-auto">
                    Continuar
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    aria-busy={status === 'sending'}
                    className="btn-primary w-full sm:w-auto"
                  >
                    {status === 'sending' ? (
                      <>
                        <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                        </svg>
                        Enviando…
                      </>
                    ) : (
                      <>
                        {status === 'failed' ? 'Reintentar inscripción' : 'Enviar mi inscripción gratis'}
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
