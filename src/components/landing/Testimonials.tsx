import { avatarColor, initials } from '../../utils/ui'
import { LogoMark } from '../Logo'

interface Testimonial {
  quote: string
  name: string
  handle: string
  meta: string
  metric: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'Transmitía sola y sin rumbo. Con el plan semanal y el equipo de guerra dejé de improvisar horarios: hoy mis lives tienen público nuevo todas las semanas.',
    name: 'Sofía Rivas',
    handle: '@sofiarivas',
    meta: 'Lifestyle · 189 mil seguidores',
    metric: '+180% de regalos en 60 días',
  },
  {
    quote:
      'Los karaoke de los viernes se volvieron un evento fijo. La agencia organiza las wars y las campañas, y yo me preocupo únicamente por tocar bien.',
    name: 'Mateo Cruz',
    handle: '@mateocruz',
    meta: 'Música en vivo · 268 mil seguidores',
    metric: '3.4x vistas medias en 90 días',
  },
  {
    quote:
      'Empecé con una cuenta chica y muy pocas horas. En tres meses dejé de regalar mi tiempo: ahora mis transmisiones pagan mi semana y tengo horario fijo.',
    name: 'Valentina Mora',
    handle: '@vale.mora',
    meta: 'Q&A / Charla · 97 mil seguidores',
    metric: '+12.000 seguidores en 60 días',
  },
]

export default function Testimonials() {
  return (
    <section id="testimonios" className="relative scroll-mt-24 py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <LogoMark tone="dark" className="h-4 w-4" alt="" />
            Testimonios
          </span>
          <h2 className="section-title mt-6">
            Creadores que <span className="text-brand-300">ya crecieron</span> con nosotros
          </h2>
          <p className="mt-5 text-white/60">
            Resultados de cuentas que hoy forman parte del squad. Cada número viene de sus
            transmisiones, no de campañas pagadas.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <figure
              key={item.handle}
              className="animate-fade-up flex h-full flex-col rounded-2xl border border-white/10 bg-ink-800/60 p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-card"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 flex-none text-brand-400/70"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M7.5 5.25C5.43 5.25 3.75 6.93 3.75 9c0 1.98 1.5 3.6 3.42 3.78-.24 1.5-1.1 2.76-2.4 3.6l1.2 1.95c2.7-1.35 4.53-4.05 4.53-7.35 0-3.03-2.48-5.5-5.5-5.5V5.25Zm10.5 0C15.93 5.25 14.25 6.93 14.25 9c0 1.98 1.5 3.6 3.42 3.78-.24 1.5-1.1 2.76-2.4 3.6l1.2 1.95c2.7-1.35 4.53-4.05 4.53-7.35 0-3.03-2.48-5.5-5.5-5.5V5.25Z" />
              </svg>

              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-white/70">
                {item.quote}
              </blockquote>

              <div className="mt-6 rounded-xl border border-brand-400/25 bg-brand-500/10 px-4 py-3">
                <div className="font-display text-sm font-bold text-brand-200">{item.metric}</div>
              </div>

              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className={`grid h-11 w-11 flex-none place-items-center rounded-full bg-gradient-to-br ${avatarColor(
                    item.name,
                  )} font-display text-xs font-bold text-white shadow-glow-sm`}
                >
                  {initials(item.name)}
                </span>
                <span>
                  <span className="block font-display text-sm font-semibold text-white">
                    {item.name}
                  </span>
                  <span className="block text-xs text-brand-300">{item.handle}</span>
                  <span className="mt-0.5 block text-[11px] uppercase tracking-wide text-white/60">
                    {item.meta}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
