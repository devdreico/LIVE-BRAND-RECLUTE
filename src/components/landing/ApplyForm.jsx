import { useState } from 'react'

const initialForm = {
  name: '',
  handle: '',
  followers: '',
  avgViewers: '',
  hoursPerWeek: '',
  category: '',
  email: '',
  phone: '',
  availability: '',
  note: '',
}

const categories = ['Gaming', 'Música en vivo', 'Lifestyle', 'Q&A / Charla', 'Deportes', 'Belleza', 'Otro']

export default function ApplyForm({ onSubmit }) {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)

  const update = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 3) next.name = 'Ingresa tu nombre completo'
    if (!/^@?[a-zA-Z0-9._]{2,}$/.test(form.handle.trim())) next.handle = 'Ejemplo: @tucuenta'
    if (!form.email.includes('@')) next.email = 'Email inválido'
    if (!form.followers || Number(form.followers) < 0) next.followers = 'Indica tus seguidores'
    if (!form.avgViewers || Number(form.avgViewers) < 0) next.avgViewers = 'Indica viewers promedio'
    if (!form.category) next.category = 'Selecciona una categoría'
    return next
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const applicant = onSubmit({
      ...form,
      name: form.name.trim(),
      handle: form.handle.trim().startsWith('@') ? form.handle.trim() : `@${form.handle.trim()}`,
      followers: Number(form.followers),
      avgViewers: Number(form.avgViewers),
      hoursPerWeek: Number(form.hoursPerWeek || 0),
    })

    setSubmitted(applicant)
    setForm(initialForm)
  }

  if (submitted) {
    return (
      <div className="card animate-fade-up p-10 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow shadow-glow">
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-6 font-display text-2xl font-bold text-white">¡Postulación enviada!</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
          Gracias, <span className="text-brand-300">{submitted.name}</span>. Tu perfil de{' '}
          <span className="text-brand-300">{submitted.handle}</span> quedó en revisión con estado{' '}
          <span className="text-amber-300">Pendiente</span>. Te contactamos por {submitted.email} en
          menos de 48 horas.
        </p>
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#streamers" className="btn-primary">
            Conoce a los creadores
          </a>
          <button onClick={() => setSubmitted(null)} className="btn-ghost">
            Postular otro perfil
          </button>
        </div>
      </div>
    )
  }

  return (
    <section id="postular" className="relative scroll-mt-24 py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/20 blur-[130px]" />

      <div className="container-page relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <span className="eyebrow">Postulación</span>
            <h2 className="section-title mt-6">
              Únete al <span className="text-brand-300">squad</span> de Live Brand
            </h2>
            <p className="mt-5 text-white/60">
              Completa el formulario con tus datos de TikTok. Revisamos cada perfil a mano y
              respondemos en menos de 48 horas.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                'Revisión humana de tu perfil y tus stats',
                'Feedback de crecimiento sin costo en la primera llamada',
                'Sin permanencia mínima: entra, prueba y decide',
                '100% de tus ingresos iniciales son tuyos',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
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
              <p className="text-sm text-white/70">
                <span className="font-semibold text-brand-200">¿Ya eres parte?</span> Entra al{' '}
                <a href="#/panel" className="font-semibold text-glow underline underline-offset-4">
                  panel interno
                </a>{' '}
                para gestionar postulantes.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card animate-fade-up p-7 sm:p-9" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label" htmlFor="name">Nombre completo</label>
                <input id="name" className="input" placeholder="Tu nombre y apellido" value={form.name} onChange={update('name')} />
                {errors.name && <p className="mt-1.5 text-xs text-rose-400">{errors.name}</p>}
              </div>

              <div>
                <label className="label" htmlFor="handle">@ de TikTok</label>
                <input id="handle" className="input" placeholder="@tucuenta" value={form.handle} onChange={update('handle')} />
                {errors.handle && <p className="mt-1.5 text-xs text-rose-400">{errors.handle}</p>}
              </div>

              <div>
                <label className="label" htmlFor="email">Email de contacto</label>
                <input id="email" type="email" className="input" placeholder="tu@email.com" value={form.email} onChange={update('email')} />
                {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
              </div>

              <div>
                <label className="label" htmlFor="phone">Teléfono / WhatsApp</label>
                <input id="phone" className="input" placeholder="+56 9 0000 0000" value={form.phone} onChange={update('phone')} />
              </div>

              <div>
                <label className="label" htmlFor="category">Categoría principal</label>
                <select id="category" className="input" value={form.category} onChange={update('category')}>
                  <option value="">Selecciona una</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1.5 text-xs text-rose-400">{errors.category}</p>}
              </div>

              <div>
                <label className="label" htmlFor="followers">Seguidores</label>
                <input id="followers" type="number" min="0" className="input" placeholder="Ej: 45000" value={form.followers} onChange={update('followers')} />
                {errors.followers && <p className="mt-1.5 text-xs text-rose-400">{errors.followers}</p>}
              </div>

              <div>
                <label className="label" htmlFor="avgViewers">Viewers promedio en live</label>
                <input id="avgViewers" type="number" min="0" className="input" placeholder="Ej: 850" value={form.avgViewers} onChange={update('avgViewers')} />
                {errors.avgViewers && <p className="mt-1.5 text-xs text-rose-400">{errors.avgViewers}</p>}
              </div>

              <div>
                <label className="label" htmlFor="hoursPerWeek">Horas en vivo por semana</label>
                <input id="hoursPerWeek" type="number" min="0" className="input" placeholder="Ej: 15" value={form.hoursPerWeek} onChange={update('hoursPerWeek')} />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="availability">Horarios disponibles</label>
                <input id="availability" className="input" placeholder="Ej: Lunes a viernes, 18:00 – 23:00" value={form.availability} onChange={update('availability')} />
              </div>

              <div className="sm:col-span-2">
                <label className="label" htmlFor="note">Cuéntanos de tu proyecto</label>
                <textarea
                  id="note"
                  rows="4"
                  className="input resize-none"
                  placeholder="¿Qué lograste en tus últimas transmisiones? ¿Qué buscas en una agencia?"
                  value={form.note}
                  onChange={update('note')}
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <p className="text-xs text-white/40">Tus datos se guardan solo en este dispositivo.</p>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                Enviar postulación
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
