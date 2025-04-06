import React from 'react';
import ReactDOM from 'react-dom/client';  // Note the new import for React 18
import App from './App';

if (typeof window !== 'undefined') {
  const root = ReactDOM.hydrateRoot(
    document.getElementById('root')!,  // Assuming 'root' is your container id
    <App />
  );
}
