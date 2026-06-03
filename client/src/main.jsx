import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ProductProvider from "./context/ProductContext.jsx";
import { Toaster } from "react-hot-toast";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProductProvider>
    <App />
   <Toaster position="top-right" />
    </ProductProvider>
  </StrictMode>,
)
