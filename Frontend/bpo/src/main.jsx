// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// src/main.js or src/index.js
import './utils/buffer'; // Ensure you import it before anything else

import 'bootstrap/dist/css/bootstrap.min.css';
// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));  // Use createRoot
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
