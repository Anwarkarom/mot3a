import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import LanguageSelector from '../components/LanguageSelector';
import { t } from '../lib/i18n';

export default function Settings() {
  const { language, profile, setProfile } = useAppContext();
  const [form, setForm] = useState(profile || { name: '', ageGroup: '', thinkingStyle: '' });
  const [message, setMessage] = useState('');

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const save = () => {
    setProfile({ ...profile, ...form, language });
    setMessage(t('profileSaved', language));
  };

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-olive">{t('settings', language)}</h2>
        <LanguageSelector />
      </div>

      <div className="neomorph p-6 rounded-3xl space-y-4">
        <div className="grid gap-3">
          <label className="text-sm text-olive/80">الاسم</label>
          <input
            className="neomorph-soft px-4 py-3 rounded-2xl focus:outline-none"
            value={form.name || ''}
            onChange={(e) => update('name', e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <label className="text-sm text-olive/80">الفئة العمرية</label>
          <input
            className="neomorph-soft px-4 py-3 rounded-2xl focus:outline-none"
            value={form.ageGroup || ''}
            onChange={(e) => update('ageGroup', e.target.value)}
          />
        </div>
        <div className="grid gap-3">
          <label className="text-sm text-olive/80">أسلوب التفكير</label>
          <input
            className="neomorph-soft px-4 py-3 rounded-2xl focus:outline-none"
            value={form.thinkingStyle || ''}
            onChange={(e) => update('thinkingStyle', e.target.value)}
          />
        </div>
        <button
          onClick={save}
          className="px-5 py-2 bg-olive text-warm rounded-full shadow-neo hover:scale-105"
        >
          {t('submitProfile', language)}
        </button>
        {message && <p className="text-green-700 text-sm">{message}</p>}
      </div>
    </div>
  );
}
