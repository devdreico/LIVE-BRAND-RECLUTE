import { topCreators } from '../../data/topCreators'
import { initials } from '../../utils/ui'
import { LogoMark } from '../Logo'

export default function TopCreators() {
  return (
    <section id="referentes" className="relative scroll-mt-24 py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <LogoMark tone="dark" className="h-4 w-4" alt="" />
            Estándar del mercado
          </span>
          <h2 className="section-title mt-6">
            Los <span className="text-brand-300">top de Colombia</span> marcan el nivel
          </h2>
          <p className="mt-5 text-white/60">
            Estos son los creadores colombianos más vistos de TikTok en 2026. No son clientes de la
            agencia: son el referente de profesionalismo al que medimos tu crecimiento en las
            clases.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topCreators.map((creator, index) => (
            <li
              key={creator.handle}
              className="animate-fade-up flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-800/60 p-4 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-brand-400/40"
              style={{ animationDelay: `${(index % 6) * 60}ms` }}
            >
              <span
                className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-glow font-display text-sm font-bold text-white shadow-glow-sm"
                aria-hidden="true"
              >
                {initials(creator.name)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-semibold text-white">
                  {creator.name}
                </span>
                <span className="block truncate text-xs text-brand-300">@{creator.handle}</span>
              </span>

              <span className="flex-none text-right">
                <span className="block font-display text-base font-bold text-white">
                  {creator.followers}
                </span>
                <span className="block text-[10px] uppercase tracking-wide text-white/60">
                  {creator.category}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-xs text-white/60">
          Cifras públicas de seguidores consultadas en 2026 · Te enseñamos el método para escalar
          hacia ese nivel con constancia y estructura.
        </p>
      </div>
    </section>
  )
}
