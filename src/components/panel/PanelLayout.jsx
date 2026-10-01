import { LogoMark } from '../Logo.jsx'

const navItems = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'postulantes', label: 'Postulantes' },
]

export default function PanelLayout({ activeTab, onTabChange, onExit, children }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-ink-950/80 p-6 backdrop-blur-xl lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-brand-400/30 bg-ink-800/70 shadow-glow-sm">
            <LogoMark tone="dark" className="h-7 w-7" />
          </span>
          <div>
            <div className="font-display text-sm font-bold leading-tight">
              LIVE<span className="text-brand-300">BRAND</span>
            </div>
            <div className="text-[11px] uppercase tracking-widest text-white/40">Panel de reclutamiento</div>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-display text-sm font-medium transition ${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-brand-600/60 to-glow/30 text-white shadow-glow-sm'
                  : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${activeTab === item.id ? 'bg-glow' : 'bg-white/25'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-xl border border-brand-400/25 bg-brand-500/10 p-4">
            <p className="text-xs leading-relaxed text-white/60">
              Los cambios de estado se guardan automáticamente en este dispositivo.
            </p>
          </div>
          <button onClick={onExit} className="btn-ghost w-full !py-2.5 text-xs">
            ← Volver a la landing
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-900/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-brand-400/30 bg-ink-800/70 lg:hidden">
                <LogoMark tone="dark" className="h-5 w-5" />
              </span>
              <div>
                <h1 className="font-display text-base font-bold text-white sm:text-lg">
                  {activeTab === 'resumen' ? 'Resumen de la convocatoria' : 'Gestión de postulantes'}
                </h1>
                <p className="text-xs text-white/45">Temporada 2026 · Reclutamiento TikTok LIVE</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-full border border-white/10 bg-ink-950/60 p-1 lg:hidden">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      activeTab === item.id ? 'bg-brand-500 text-white' : 'text-white/55'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                onClick={onExit}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/60 transition hover:border-brand-400/40 hover:text-white lg:hidden"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  )
}
