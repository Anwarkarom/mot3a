import React from 'react';
import { useAppContext } from '../context/AppContext';
import { t } from '../lib/i18n';

const langs = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
];

export default function LanguageSelector() {
  const { language, setLanguage } = useAppContext();

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-olive/70">{t('language', language)}:</span>
      <div className="flex gap-1 bg-soft/70 px-2 py-1 rounded-full neomorph-soft">
        {langs.map((lng) => (
          <button
            key={lng.code}
            className={`px-3 py-1 rounded-full transition text-xs sm:text-sm ${
              language === lng.code
                ? 'bg-olive text-warm shadow-neo'
                : 'bg-transparent text-olive hover:bg-olive/10'
            }`}
            onClick={() => setLanguage(lng.code)}
          >
            {lng.label}
          </button>
        ))}
      </div>
    </div>
  );
}
