import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

export class RouteErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="surface-panel p-8">
        <AlertTriangle className="mb-4 h-6 w-6 text-risk-moderate" aria-hidden="true" />
        <h1 className="text-xl font-semibold">This view could not load</h1>
        <p className="my-3 text-sm text-shell-muted">Reload the view to retry. Your saved browser data is retained.</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>Reload view</button>
        <a className="btn-secondary ml-2" href="/">Go to overview</a>
      </div>
    )
  }
}
