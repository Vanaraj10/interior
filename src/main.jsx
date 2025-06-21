import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Prevent scroll wheel from changing number input values
document.addEventListener('DOMContentLoaded', () => {
  // Add event listener for wheel events on number inputs
  document.addEventListener('wheel', (e) => {
    if (e.target.type === 'number' && document.activeElement === e.target) {
      e.preventDefault();
    }
  }, { passive: false });

  // Add event listener for focus events to prevent scroll wheel
  document.addEventListener('focus', (e) => {
    if (e.target.type === 'number') {
      e.target.addEventListener('wheel', (wheelEvent) => {
        wheelEvent.preventDefault();
      }, { passive: false });
    }
  }, true);

  // Additional prevention for keydown events (arrow keys can also change values)
  document.addEventListener('keydown', (e) => {
    if (e.target.type === 'number' && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
      if (e.target.hasAttribute('data-prevent-arrows')) {
        e.preventDefault();
      }
    }
  });
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)