import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register service worker for offline installation (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`)
      .then((reg) => {
        console.log('Service Worker registered successfully:', reg.scope);
        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available
                const updateBanner = document.createElement('div');
                updateBanner.style.position = 'fixed';
                updateBanner.style.bottom = '20px';
                updateBanner.style.left = '50%';
                updateBanner.style.transform = 'translateX(-50%)';
                updateBanner.style.backgroundColor = '#0f172a';
                updateBanner.style.color = 'white';
                updateBanner.style.padding = '12px 24px';
                updateBanner.style.borderRadius = '9999px';
                updateBanner.style.zIndex = '9999';
                updateBanner.style.display = 'flex';
                updateBanner.style.alignItems = 'center';
                updateBanner.style.gap = '12px';
                updateBanner.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5)';
                updateBanner.style.fontFamily = 'system-ui, sans-serif';
                updateBanner.style.fontSize = '14px';
                updateBanner.style.fontWeight = 'bold';
                
                updateBanner.innerHTML = `
                  <span>A new version is available!</span>
                  <button id="sw-update-btn" style="background: #10b981; color: white; border: none; padding: 6px 16px; border-radius: 999px; cursor: pointer; font-weight: bold;">Update Now</button>
                `;
                
                document.body.appendChild(updateBanner);
                
                document.getElementById('sw-update-btn')?.addEventListener('click', () => {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                });
              }
            });
          }
        });
      })
      .catch((err) => console.error('Service Worker registration failed:', err));
  });
}

