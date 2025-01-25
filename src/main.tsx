import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App.tsx'
import MainLayout from './layout/MainLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainLayout>
        <App />
    </MainLayout>
  </StrictMode>,
)
