import React from 'react';
import { NavLink } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import { useAppContext } from '../context/AppContext';
import { t } from '../lib/i18n';

export default function Navbar() {
  const { language } = useAppContext();
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full transition text-sm sm:text-base ${
      isActive ? 'bg-olive text-warm shadow-neo' : 'hover:bg-olive/10 text-olive'
    }`;

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="neomorph-soft px-4 py-2 rounded-2xl text-lg font-semibold text-olive card-hover">
          متعة | Mot3a
        </div>
        <nav className="flex gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            {t('dashboard', language)}
          </NavLink>
          <NavLink to="/kids" className={linkClass}>
            {t('kids', language)}
          </NavLink>
          <NavLink to="/settings" className={linkClass}>
            {t('settings', language)}
          </NavLink>
        </nav>
      </div>
      <LanguageSelector />
    </header>
  );
}
