import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../brand/tokens.css'
import './styles.css'
import { App } from './ui/App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
