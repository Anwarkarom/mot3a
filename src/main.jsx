import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';

// Ensure deep links keep working when using HashRouter by translating path-based
// requests (e.g., /dashboard) into hash-based routes when a hash is missing.
// This helps on static hosts that serve index.html for all paths but don't
// rewrite hashes automatically.
const { pathname, search, hash } = window.location;
if (!hash && pathname && pathname !== '/') {
  const normalizedHash = `#${pathname}${search}`;
  window.location.replace(normalizedHash);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </HashRouter>
  </React.StrictMode>,
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
