import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from '../Router/Router'; 
import App from './App.jsx'
import Nav from './components/Nav_bar';
import Page from './components/Page';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter></AppRouter>
  </StrictMode>,
)
