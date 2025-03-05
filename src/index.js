// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import './index.css'; // or your main CSS

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
    });
  });
}

