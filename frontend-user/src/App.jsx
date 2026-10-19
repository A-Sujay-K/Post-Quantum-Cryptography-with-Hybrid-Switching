import React, { Component } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import StyleguidePage from './pages/StyleguidePage';
import { ChatProvider } from './context/ChatContext';
import BackgroundStack from './theme/BackgroundStack';
import { ShieldAlert } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled error caught in App:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--surface-bg)] text-[var(--text-primary)] p-6 font-sans">
          <div className="max-w-md w-full glass-l2 border border-[var(--edge-rest)] rounded-[20px] p-6 text-center shadow-xl backdrop-blur-md">
            <div className="w-12 h-12 bg-red-500/10 text-danger border border-[var(--edge-rest)] rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-medium">
              !
            </div>
            <h2 className="text-lg font-medium mb-2 text-[var(--text-primary)]">Something went wrong</h2>
            <p className="text-xs text-[var(--text-secondary)] mb-6 font-normal">
              {this.state.error?.message || 'An unexpected client error occurred.'}
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="w-full h-11 rounded-[12px] btn-primary font-medium text-xs cursor-pointer"
              >
                Reload Application
              </button>
              <button
                type="button"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="w-full h-9 rounded-[12px] bg-transparent hover:bg-[var(--surface-inner)] border border-[var(--edge-rest)] text-[var(--text-secondary)] font-normal text-xs transition-colors"
              >
                Clear Session &amp; Sign In
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 font-sans">
      <div className="glass-l1 w-full max-w-[420px] p-8 rounded-[24px] text-center border border-[var(--edge-rest)] shadow-xl backdrop-blur-md">
        <div className="w-12 h-12 rounded-full bg-[var(--surface-inner)] border border-[var(--edge-rest)] flex items-center justify-center mx-auto mb-4 text-[var(--text-secondary)]">
          <ShieldAlert size={22} />
        </div>
        <h1 className="text-2xl font-normal text-[var(--text-primary)] mb-2 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs text-[var(--text-secondary)] mb-6 font-normal">
          The requested cryptographic route does not exist or has expired.
        </p>
        <Link
          to="/"
          className="w-full h-11 rounded-[12px] btn-primary flex items-center justify-center text-xs font-medium cursor-pointer"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="glass-l2 px-8 py-6 rounded-[20px] flex flex-col items-center gap-3.5 border border-[var(--edge-rest)] shadow-lg backdrop-blur-md">
          <div className="w-6 h-6 border-2 border-[var(--edge-rest)] border-t-[var(--text-primary)] rounded-full animate-spin" />
          <p className="text-[13px] text-[var(--text-secondary)] font-normal tracking-normal">
            Loading secure session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/__styleguide" element={<StyleguidePage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/chat" replace />} />
      <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/chat" replace />} />
      <Route path="/chat" element={user ? <ChatProvider><ChatPage /></ChatProvider> : <Navigate to="/login" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BackgroundStack variant="user">
        <AppContent />
      </BackgroundStack>
    </ErrorBoundary>
  );
}

export default App;
