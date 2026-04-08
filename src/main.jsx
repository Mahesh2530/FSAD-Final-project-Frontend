import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import envConfig from './config/envConfig'

// Start the MSW worker only if mocking is enabled
async function initMocks() {
  if (import.meta.env.DEV && envConfig.CURRENT.MOCK_ENABLED) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
  return Promise.resolve()
}

initMocks().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
