import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css';
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { setupMobileAuth } from './lib/mobileUtils.js';



setupMobileAuth();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <BrowserRouter>
          <App />
    </BrowserRouter>
    
  </StrictMode>,
)
