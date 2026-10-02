import { LogoMark } from '../Logo'

const perks = [
  'Cupos limitados por categoría: solo incorporamos creadores que podemos acompañar de verdad',
  'Te contacta un pilar de la agencia en menos de 48 h (máximo 3 días)',
  'Clases y asesorías 100% gratuitas desde el primer día',
  'Sin matrícula, sin mensualidad y sin permanencia mínima',
]

export default function ScarcityCta() {
  return (
    <section id="cupos" className="relative scroll-mt-24 py-24">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-brand-400/25 bg-gradient-to-br from-ink-800 via-ink-700/60 to-ink-800 px-6 py-14 shadow-card sm:px-12">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-glow/25 blur-[110px]" />
          <LogoMark
            tone="dark"
            className="pointer-events-none absolute right-6 top-6 h-24 w-24 opacity-[0.07] sm:h-32 sm:w-32"
            alt=""
          />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="eyebrow">
                <LogoMark tone="dark" className="h-4 w-4" alt="" />
                Convocatoria abierta
              </span>
              <h2 className="section-title mt-6">
                Este mes quedan <span className="text-brand-300">pocos cupos</span> por categoría
              </h2>
              <p className="mt-5 text-white/60">
                No aceptamos cientos de perfiles para después ignorarlos: cerramos la convocatoria
                cuando el equipo de pilares ya no puede dar clase y seguimiento a todos.
              </p>

              <ul className="mt-7 space-y-4">
                {perks.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-500/20 text-brand-300">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-ink-950/60 p-7 backdrop-blur-xl sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-200">
                  Tu siguiente paso
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                  <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-emerald-400" />
                  Postulación activa
                </span>
              </div>

              <ol className="mt-6 space-y-4">
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow font-display text-[11px] font-bold text-white">
                    1
                  </span>
                  Envías tu perfil en 2 minutos, sin costo.
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow font-display text-[11px] font-bold text-white">
                    2
                  </span>
                  En menos de 48 h (máximo 3 días) te contacta un pilar de la agencia.
                </li>
                <li className="flex items-start gap-3 text-sm text-white/70">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow font-display text-[11px] font-bold text-white">
                    3
                  </span>
                  Entras a las clases gratuitas y a tu plan de crecimiento.
                </li>
              </ol>

              <div className="mt-8 space-y-3">
                <a href="#postular" className="btn-primary w-full">
                  Quiero mi cupo
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <p className="text-center text-xs text-white/60">
                  Respuesta habitual en menos de 48 h · máximo 3 días
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
