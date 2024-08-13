import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './Authentication/AuthContext.jsx';
createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <BrowserRouter>
    <App />
    </BrowserRouter>
    </AuthProvider>
 
)
