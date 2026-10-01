import { useEffect, useState } from 'react'

const links = [
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#streamers', label: 'Streamers' },
  { href: '#metricas', label: 'Métricas' },
  { href: '#postular', label: 'Postular' },
]

export default function Navbar({ onOpenPanel }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="container-page flex h-20 items-center justify-between">
        <a href="#" className="group flex items-center gap-3">
          <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-glow shadow-glow-sm">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-400 to-glow opacity-0 blur-md transition group-hover:opacity-100" />
            <svg viewBox="0 0 24 24" className="relative h-5 w-5 text-white" fill="currentColor">
              <path d="M13.5 3v10.2a3.3 3.3 0 1 1-2.4-3.18V6.6c-.6.1-1.2.3-1.7.6A5.6 5.6 0 0 0 6.5 11a5.5 5.5 0 0 0 11 0V6.4A6.5 6.5 0 0 1 13.5 3Z" />
            </svg>
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            LIVE<span className="text-brand-300">BRAND</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-sm font-medium text-white/70 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPanel}
            className="hidden font-display text-sm font-medium text-white/50 transition hover:text-brand-200 sm:block"
          >
            Panel interno
          </button>
          <a href="#postular" className="btn-primary !px-5 !py-2.5">
            Quiero unirme
          </a>
        </div>
      </nav>
    </header>
  )
}
