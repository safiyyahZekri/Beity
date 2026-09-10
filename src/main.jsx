import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { BeityProvider } from './store/BeityContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <BeityProvider>
        <App />
      </BeityProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
