import React, { Component } from 'react';
import DashboardShell from './components/layout/DashboardShell';
import DashboardPage from './pages/DashboardPage';
import StyleguidePage from './pages/StyleguidePage';
import BackgroundStack from './theme/BackgroundStack';
import { TelemetryProvider } from './context/TelemetryContext';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled error in Supervisor Dashboard:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--surface-bg)] text-[var(--text-primary)] p-6 font-sans">
          <div className="max-w-md w-full glass-l2 border border-[var(--edge-rest)] rounded-[20px] p-6 text-center shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 bg-red-500/10 text-danger border border-[var(--edge-rest)] rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-medium">
              !
            </div>
            <h2 className="text-lg font-medium mb-2 text-[var(--text-primary)]">Telemetry Link Interrupted</h2>
            <p className="text-xs text-[var(--text-secondary)] mb-6 font-normal">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="w-full h-11 rounded-[12px] btn-primary font-medium text-xs cursor-pointer"
            >
              Reconnect & Reload Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const isStyleguide = typeof window !== 'undefined' && window.location.pathname === '/__styleguide';

  if (isStyleguide) {
    return (
      <ErrorBoundary>
        <BackgroundStack variant="supervisor">
          <StyleguidePage />
        </BackgroundStack>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <TelemetryProvider>
        <DashboardShell>
          <DashboardPage />
        </DashboardShell>
      </TelemetryProvider>
    </ErrorBoundary>
  );
}

export default App;
