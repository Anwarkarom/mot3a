import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout({ children }) {
  const location = useLocation();
  const hideNav = location.pathname === '/' || location.pathname === '/landing';

  return (
    <div className="min-h-screen bg-warm text-olive px-4 sm:px-8 py-6">
      <div className="max-w-6xl mx-auto">
        {!hideNav && <Navbar />}
        {children}
      </div>
    </div>
  );
}
