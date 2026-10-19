import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
// Self-hosted Geist fonts
import '@fontsource-variable/geist'
import '@fontsource/geist-mono'
import '@fontsource/geist-mono/400.css'
import '@fontsource/geist-mono/500.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
