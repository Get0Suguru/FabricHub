import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.jsx'

// All API calls in this app use relative paths like axios.post("/api/auth/login", ...).
// Locally, Vite's dev proxy (vite.config.js) redirects those to localhost:8080.
// In production there is no such proxy, so we set a global base URL here instead.
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
axios.defaults.withCredentials = true; // needed since auth uses cookies

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)