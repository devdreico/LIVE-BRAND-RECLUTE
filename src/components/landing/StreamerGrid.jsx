import { formatCompact } from '../../utils/ui.js'

function initials(name = '') {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function StreamerGrid({ streamers }) {
  return (
    <section id="streamers" className="relative scroll-mt-24 py-24">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="eyebrow">Talento de la agencia</span>
            <h2 className="section-title mt-6">
              Creadores que ya <span className="text-brand-300">viven de sus lives</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-white/50">
            Cada uno empezó con una transmisión y una idea. Hoy gestionamos sus equipos, sus
            campañas y sus ingresos.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {streamers.map((streamer, index) => (
            <article
              key={streamer.id}
              className="group animate-fade-up overflow-hidden rounded-2xl border border-white/10 bg-ink-800/70 transition duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-card"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className={`relative h-24 bg-gradient-to-br ${streamer.gradient} opacity-90`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
                <span className="absolute right-4 top-4 rounded-full bg-ink-950/60 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                  {streamer.category}
                </span>
              </div>

              <div className="px-6 pb-6">
                <div className="-mt-8 flex items-end gap-4">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl border-4 border-ink-800 bg-ink-950 font-display text-lg font-bold text-brand-200 shadow-glow-sm">
                    {initials(streamer.name)}
                  </div>
                  <div className="pb-1">
                    <h3 className="font-display font-semibold text-white">{streamer.name}</h3>
                    <p className="text-xs text-brand-300">{streamer.handle}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-white/55">{streamer.bio}</p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-ink-950/50 px-3 py-2.5">
                    <div className="font-display text-lg font-bold text-white">
                      {formatCompact(streamer.followers)}
                    </div>
                    <div className="text-[11px] uppercase tracking-wide text-white/40">Seguidores</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-ink-950/50 px-3 py-2.5">
                    <div className="font-display text-lg font-bold text-white">{streamer.hoursLive}h</div>
                    <div className="text-[11px] uppercase tracking-wide text-white/40">Horas en vivo</div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
