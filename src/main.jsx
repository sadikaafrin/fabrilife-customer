import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
    <WishlistProvider>
      <App />
    </WishlistProvider>
    </CartProvider>
  </StrictMode>,
)
