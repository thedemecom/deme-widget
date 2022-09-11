import React from 'react';
import ReactDOM from 'react-dom/client';
import Claim from './Claim'

const installWidget = (elementId) => {
  ReactDOM.createRoot(document.getElementById(elementId)).render(
    <React.StrictMode>
      <Claim />
    </React.StrictMode>
  );
}

if (window.__deme_claim) {
  installWidget(window.__deme_claim)
  window.__deme_claim = null
}

window.addEventListener('load', () => {
  if (window.__deme_claim) {
    installWidget(window.__deme_claim)
    window.__deme_claim = null
  }
})  
