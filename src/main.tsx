import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Asegurar que React monte el nodo raíz de forma segura sin colgarse por errores globales
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
