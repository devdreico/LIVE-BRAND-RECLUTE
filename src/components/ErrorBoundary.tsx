import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { LogoMark } from './Logo'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error de aplicación:', error, info.componentStack)
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children

    return (
      <div className="grid min-h-screen place-items-center px-6">
        <div className="card w-full max-w-md p-10 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-rose-400/30 bg-ink-900">
            <LogoMark tone="dark" className="h-10 w-10 opacity-70" />
          </span>
          <h1 className="mt-6 font-display text-xl font-bold text-white">Algo salió mal</h1>
          <p className="mt-3 text-sm text-white/55">
            No pudimos cargar esta sección. Recarga la página para volver a intentarlo.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-7 w-full"
            type="button"
          >
            Recargar página
          </button>
        </div>
      </div>
    )
  }
}
