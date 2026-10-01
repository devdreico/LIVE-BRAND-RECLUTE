const BASE = import.meta.env.BASE_URL

export type LogoTone = 'dark' | 'light'

const ASSETS: Record<LogoTone, string> = {
  dark: `${BASE}live-brand-logo-white.png`,
  light: `${BASE}live-brand-logo.png`,
}

interface LogoMarkProps {
  tone?: LogoTone
  className?: string
  alt?: string
}

export function LogoMark({ tone = 'dark', className = '', alt = 'Live Brand' }: LogoMarkProps) {
  return (
    <img
      src={ASSETS[tone] ?? ASSETS.dark}
      alt={alt}
      width={500}
      height={500}
      draggable="false"
      className={`select-none object-contain ${className}`}
    />
  )
}

interface LogoProps extends LogoMarkProps {
  withWordmark?: boolean
  tile?: boolean
  markClassName?: string
  className?: string
}

export default function Logo({
  tone = 'dark',
  withWordmark = true,
  tile = true,
  markClassName = '',
  className = '',
}: LogoProps) {
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
