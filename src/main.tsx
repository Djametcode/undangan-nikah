import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// StrictMode disabled: Locomotive Scroll (Lenis) incompatible with double-mount
createRoot(document.getElementById('root')!).render(
  <App />,
)