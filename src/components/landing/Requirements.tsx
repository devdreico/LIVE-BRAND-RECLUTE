import { LogoMark } from '../Logo'

const requirements = [
  {
    title: '1.000 seguidores o 100 viewers promedio',
    description: 'Con una de las dos métricas de tus lives alcanzas para postular.',
  },
  {
    title: '5 horas o más en vivo por semana',
    description: 'La constancia pesa más que un pico aislado de audiencia.',
  },
  {
    title: 'TikTok LIVE habilitado en tu país',
    description: 'La función de transmisión en vivo debe estar disponible en tu cuenta.',
  },
  {
    title: '18 años o consentimiento de tutor',
    description: 'Trabajamos con personas mayores de edad o con su representante legal.',
  },
]

export default function Requirements() {
  return (
    <section id="requisitos" className="relative scroll-mt-24 py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <LogoMark tone="dark" className="h-4 w-4" alt="" />
            Antes de postular
          </span>
          <h2 className="section-title mt-6">
            Requisitos <span className="text-brand-300">mínimos</span>
          </h2>
          <p className="mt-5 text-white/60">
            Estos son los cuatro requisitos que revisamos en cada postulación. Si cumples los cuatro,
            tu perfil avanza directo a la llamada de diagnóstico.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {requirements.map((item, index) => (
            <li
              key={item.title}
              className="animate-fade-up flex items-start gap-4 rounded-2xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur-xl transition duration-300 hover:border-brand-400/40"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-brand-400/25 bg-brand-500/10 p-6 sm:flex-row">
          <p className="text-sm text-white/70">
            <span className="font-semibold text-brand-200">¿Estás cerca del mínimo?</span> Si eres
            constante y tienes ganas de estructurar tus lives, postúlate igual: lo conversamos en la
            llamada.
          </p>
          <a href="#postular" className="btn-primary flex-none">
            Revisar mi perfil
          </a>
        </div>
      </div>
    </section>
  )
}
