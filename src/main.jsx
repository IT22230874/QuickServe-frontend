import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <LocationProvider>
    <CartProvider>
    <App />
    </CartProvider>
    </LocationProvider>
  </StrictMode>,
)
