import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Top-level error boundary — catches any React render crash
// and shows a readable error instead of a blank/dark screen
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error: Error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#050810', color: '#f1f5f9', fontFamily: 'system-ui',
          padding: 32, gap: 16
        }}>
          <div style={{ fontSize: 48 }}>🔐</div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>ScopeLock AI — Startup Error</h1>
          <pre style={{
            background: '#111827', border: '1px solid rgba(239,68,68,0.3)',
            color: '#ef4444', borderRadius: 8, padding: '12px 20px',
            fontSize: 12, maxWidth: 680, overflowX: 'auto', whiteSpace: 'pre-wrap'
          }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack?.split('\n').slice(0, 6).join('\n')}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#6366f1', color: '#fff', border: 'none',
              borderRadius: 8, padding: '10px 24px', fontSize: 14,
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
