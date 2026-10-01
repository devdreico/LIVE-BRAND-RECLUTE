export default function Footer({ onOpenPanel }) {
  return (
    <footer className="relative border-t border-white/10 bg-ink-950/70 py-14">
      <div className="container-page flex flex-col items-center justify-between gap-8 sm:flex-row">
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-glow text-sm font-bold text-white">
              LB
            </span>
            <span className="font-display text-lg font-bold">
              LIVE<span className="text-brand-300">BRAND</span>
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-white/45">
            Agencia de crecimiento digital para creadores de lives en TikTok.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:items-end">
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/55">
            <a href="#beneficios" className="transition hover:text-brand-200">Beneficios</a>
            <a href="#streamers" className="transition hover:text-brand-200">Streamers</a>
            <a href="#postular" className="transition hover:text-brand-200">Postular</a>
            <button onClick={onOpenPanel} className="transition hover:text-brand-200">Panel interno</button>
          </nav>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} Live Brand. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
