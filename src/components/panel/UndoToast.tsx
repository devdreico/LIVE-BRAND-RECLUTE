interface UndoToastProps {
  message: string
  onUndo: () => void
  onDismiss: () => void
}

export default function UndoToast({ message, onUndo, onDismiss }: UndoToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 items-center gap-3 rounded-full border border-brand-400/40 bg-ink-800/95 px-4 py-3 shadow-glow-lg backdrop-blur-xl"
    >
      <span className="text-sm text-white">{message}</span>
      <span aria-hidden="true" className="text-white/40">
        ·
      </span>
      <button
        type="button"
        onClick={onUndo}
        className="rounded-full px-3 py-1 font-display text-sm font-semibold text-brand-200 transition hover:bg-brand-500/20 hover:text-white"
      >
        Deshacer
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Cerrar aviso"
        className="grid h-7 w-7 flex-none place-items-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
