import Logo, { LogoMark } from './Logo'

interface NotFoundProps {
  onHome: () => void
}

export default function NotFound({ onHome }: NotFoundProps) {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-20">
      <div className="card w-full max-w-md p-10 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-brand-400/30 bg-ink-900 shadow-glow">
          <LogoMark tone="dark" className="h-10 w-10" />
        </span>
        <p className="mt-6 font-display text-6xl font-extrabold text-brand-300">404</p>
        <h1 className="mt-3 font-display text-xl font-bold text-white">Página no encontrada</h1>
        <p className="mt-3 text-sm text-white/55">
          La dirección que intentas abrir no existe. Vuelve a la convocatoria para seguir viendo a
          nuestros creadores.
        </p>
        <div className="mt-7 flex flex-col items-center gap-3">
          <button onClick={onHome} className="btn-primary">
            Ir al inicio
          </button>
          <a href="#postular" className="text-sm font-medium text-brand-300 hover:text-glow">
            O postula directamente
          </a>
        </div>
        <div className="mt-8 flex justify-center opacity-60">
          <Logo tone="dark" withWordmark={false} />
        </div>
      </div>
    </div>
  )
}
