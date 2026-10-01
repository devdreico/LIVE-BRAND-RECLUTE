import { LogoMark } from '../Logo'

const steps = [
  {
    title: 'Postula en 2 minutos',
    description:
      'Completa el formulario con tu @, tu categoría y tus métricas actuales. Sin CV y sin carta de presentación.',
  },
  {
    title: 'Llamada de diagnóstico en menos de 48 h',
    description:
      'Revisamos tu perfil a mano y conversamos sobre tus metas, tu horario y tu comunidad en una llamada corta.',
  },
  {
    title: 'Onboarding y plan de crecimiento',
    description:
      'Definimos formatos, horarios y metas medibles, y arrancas con clases gratuitas y asesoría directa de profesionales de TikTok para subir tus diamantes desde la semana 1.',
  },
  {
    title: 'Primer live con equipo y estructura',
    description:
      'Te presentamos a tu equipo, armamos tu guerra y te acompañamos en la transmisión con producción lista.',
  },
]

const pad = (index: number): string => String(index + 1).padStart(2, '0')

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="relative scroll-mt-24 py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <LogoMark tone="dark" className="h-4 w-4" alt="" />
            Proceso
          </span>
          <h2 className="section-title mt-6">
            Cómo <span className="text-brand-300">funciona</span>
          </h2>
          <p className="mt-5 text-white/60">
            Cuatro pasos desde que postulas hasta que transmites con estructura. Sin letra chica y
            sin costos para ti.
          </p>
        </div>

        <ol className="relative mt-14 grid list-none gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative animate-fade-up rounded-2xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur-xl transition duration-300 hover:border-brand-400/40"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[46px] hidden h-px w-6 bg-gradient-to-r from-brand-400/60 to-glow/60 lg:block"
                />
              )}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-6 left-[68px] top-[46px] hidden h-px bg-gradient-to-r from-brand-400/60 to-glow/60 lg:block"
                />
              )}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[46px] top-full h-6 w-px bg-gradient-to-b from-brand-400/60 to-glow/40 md:hidden"
                />
              )}

              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow font-display text-sm font-bold text-white shadow-glow-sm">
                  {index + 1}
                </span>
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  Paso {pad(index)}
                </span>
              </div>

              <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <a href="#postular" className="btn-primary">
            Empezar mi postulación
          </a>
          <p className="text-xs text-white/60">
            Cupos limitados por categoría este mes · Respuesta en menos de 48 h.
          </p>
        </div>
      </div>
    </section>
  )
}
