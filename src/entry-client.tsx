import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './client/App';

if (typeof window !== 'undefined') {
  const root = ReactDOM.hydrateRoot(
    document.getElementById('root')!,  
    <App />
  );
}
