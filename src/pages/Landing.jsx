import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { t } from '../lib/i18n';

export default function Landing() {
  const navigate = useNavigate();
  const { language } = useAppContext();

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-3xl text-center neomorph p-10 rounded-3xl space-y-6">
        <p className="text-sm uppercase tracking-wide text-olive/70">Mot3a · متعة</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-olive">{t('welcome', language)}</h1>
        <p className="text-olive/80 text-lg">{t('tagline', language)}</p>
        <button
          onClick={() => navigate('/onboarding')}
          className="px-6 py-3 bg-olive text-warm rounded-full shadow-neo transition hover:scale-105"
        >
          {t('start', language)}
        </button>
      </div>
    </main>
  );
}
