// vite-process-polyfill.js
import process from 'process'
if (typeof window.process === 'undefined') {
  window.process = process
}
