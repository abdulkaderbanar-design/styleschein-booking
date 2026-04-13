import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Polyfill for window.storage (used in the app for local fallback)
if (!window.storage) {
  window.storage = {
    get: async (key) => { const v = localStorage.getItem(key); return v ? { value: v } : null; },
    set: async (key, value) => { localStorage.setItem(key, value); return { key, value }; },
    delete: async (key) => { localStorage.removeItem(key); return { key, deleted: true }; },
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
