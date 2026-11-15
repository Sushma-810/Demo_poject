// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Rendering the main App component into the root element in index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
