import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
// Self-hosted Geist fonts
import '@fontsource-variable/geist'
import '@fontsource/geist-mono'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
