import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { CityProvider } from './context/CityContext.jsx'
import './index.css'
import './mobile.css'
import './motion.css'
import './city.css'
import { startMonitoring } from './services/monitor'
import { loadCatalog } from './services/catalogLoader'

startMonitoring()

loadCatalog().finally(() => ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ToastProvider>
          <CityProvider>
            <App />
          </CityProvider>
        </ToastProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
))
