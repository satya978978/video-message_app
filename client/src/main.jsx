
import process from 'process'
window.global = window
window.process = process




import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(

    <App />

)
