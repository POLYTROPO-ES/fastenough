import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').then((registration) => {
      let refreshing = false

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) {
          return
        }
        refreshing = true
        window.location.reload()
      })

      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }

      registration.addEventListener('updatefound', () => {
        const worker = registration.installing
        if (!worker) {
          return
        }

        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            worker.postMessage({ type: 'SKIP_WAITING' })
          }
        })
      })

      window.setInterval(() => {
        void registration.update()
      }, 60_000)
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
