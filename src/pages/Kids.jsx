import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProgramSection from '../components/ProgramSection';
import { t } from '../lib/i18n';

export default function Kids() {
  const { language, program } = useAppContext();
  const kidsContent = program?.sections?.kidsContent?.cards || [];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-olive">{t('kids', language)}</h2>
      <p className="text-olive/70">{t('kidsIntro', language)}</p>

      {kidsContent.length === 0 && (
        <div className="neomorph-soft p-4 rounded-2xl">✨ أجب عن سؤال الأطفال في الاستبيان لنجهز لهم محتوى ممتع.</div>
      )}

      {kidsContent.length > 0 && (
        <ProgramSection title="بطاقات للأطفال">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {kidsContent.map((card, idx) => (
              <div key={idx} className="neomorph-soft p-4 rounded-2xl">
                <p className="font-semibold text-olive">{card.title}</p>
                <p className="text-sm text-olive/70">{card.idea}</p>
                <span className="text-xs text-olive/60">{card.tone}</span>
              </div>
            ))}
          </div>
        </ProgramSection>
      )}
    </div>
  );
}
