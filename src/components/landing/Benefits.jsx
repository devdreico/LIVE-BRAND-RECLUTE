const benefits = [
  {
    title: 'Gestión de equipos y wars',
    description:
      'Armamos tu equipo de lives, organizamos wars y eventos con otras cuentas para multiplicar tu alcance.',
    icon: (
      <path d="M17 20h5v-2a3 3 0 0 0-5.36-1.86M17 20H7m10 0v-2c0-.67-.1-1.32-.28-1.92M7 20H2v-2a3 3 0 0 1 5.36-1.86M7 20v-2c0-.67.1-1.32.28-1.92m0 0a5 5 0 0 1 9.44 0M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
    ),
  },
  {
    title: 'Estrategia de crecimiento',
    description:
      'Plan semanal con horarios óptimos, formatos de contenido y metas claras para subir views y seguidores.',
    icon: <path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />,
  },
  {
    title: 'Monetización y pagos',
    description:
      'Acompañamos la configuración de regalos y diamonds, con reparto transparente y pagos semanales.',
    icon: (
      <path d="M2.25 18.75a60.07 60.07 0 0 1-15.902 1.39c.53.602 1.086 1.197 1.648 1.774m-1.648-1.774 2.4-3.6a60.07 60.07 0 0 1 12.006 0l2.4 3.6m-16.406 5.388a60.08 60.08 0 0 0 11.812 0m11.812 0a60.11 60.11 0 0 1-11.812 0m11.812 0c1.55 0 2.96-1.15 3.164-2.683.12-.906.17-1.82.17-2.748 0-.93-.05-1.84-.17-2.748-.203-1.533-1.614-2.683-3.164-2.683M6.75 6.75a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
    ),
  },
  {
    title: 'Coaching de live',
    description:
      'Sesiones con coaches para mejorar tu ritmo, retención del público y estilo de interacción en cámara.',
    icon: (
      <path d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    ),
  },
  {
    title: 'Producción y diseño',
    description:
      'Overlays, thumbnails, intros y cortes verticales de tus mejores momentos listos para publicar.',
    icon: (
      <path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
    ),
  },
  {
    title: 'Campañas con marcas',
    description:
      'Conectamos tu perfil con marcas del rubro gaming, belleza y lifestyle para deals y retos pagados.',
    icon: (
      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    ),
  },
]

export default function Benefits() {
  return (
    <section id="beneficios" className="relative scroll-mt-24 py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Por qué unirte</span>
          <h2 className="section-title mt-6">
            Una agencia detrás de tu <span className="text-brand-300">live</span>
          </h2>
          <p className="mt-5 text-white/60">
            No somos solo comunidad: somos estructura. Todo lo que necesitas para profesionalizar
            tus transmisiones en un solo lugar.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <article
              key={benefit.title}
              className="group relative animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60 p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-card"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-500/20 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <div className="relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-glow text-white shadow-glow-sm">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {benefit.icon}
                </svg>
              </div>
              <h3 className="relative mt-5 font-display text-lg font-semibold text-white">{benefit.title}</h3>
              <p className="relative mt-3 text-sm leading-relaxed text-white/55">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
