import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'

const installWidget = (elementId, receiverAddress, tokenList) => {
  ReactDOM.createRoot(document.getElementById(elementId)).render(
    <React.StrictMode>
      <App
        receiverAddress={'0x0D02E26F50DFdc188DbB2cc0753Cb1c54b580a96'}
        tokenList={[
          {
            name: 'BUSD',
            address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
            decimal: 18
          },
          {
            name: 'USDT',
            address: '0x55d398326f99059ff775485246999027b3197955',
            decimal: 18
          }
        ]}
      />
    </React.StrictMode>
  );
}

if (window.__demes) {
  for (const [elementId, address, tokenList] of window.__demes) {
    installWidget(elementId, address, tokenList)
  }
  window.__demes = []
}

window.addEventListener('load', () => {
  if (window.__demes) {
    for (const [elementId, address, tokenList] of window.__demes) {
      installWidget(elementId, address, tokenList)
    }
    window.__demes = []
  }
})  
