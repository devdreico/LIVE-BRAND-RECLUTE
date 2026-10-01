const BASE = import.meta.env.BASE_URL

const ASSETS = {
  dark: `${BASE}live-brand-logo-white.png`,
  light: `${BASE}live-brand-logo.png`,
}

export function LogoMark({ tone = 'dark', className = '', alt = 'Live Brand' }) {
  return (
    <img
      src={ASSETS[tone] || ASSETS.dark}
      alt={alt}
      draggable="false"
      className={`select-none object-contain ${className}`}
    />
  )
}

export default function Logo({
  tone = 'dark',
  withWordmark = true,
  tile = true,
  markClassName = '',
  className = '',
}) {
  const mark = <LogoMark tone={tone} className={markClassName || 'h-7 w-7'} />

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {tile ? (
        <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-white/10 bg-ink-800/70">
          {mark}
        </span>
      ) : (
        mark
      )}
      {withWordmark && (
        <span className="font-display text-lg font-bold leading-tight tracking-tight text-white">
          LIVE<span className="text-brand-300">BRAND</span>
        </span>
      )}
    </span>
  )
}
