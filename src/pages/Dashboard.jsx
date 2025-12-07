import React, { useEffect } from 'react';
import ProgramSection from '../components/ProgramSection';
import { useAppContext } from '../context/AppContext';
import { t } from '../lib/i18n';
import { generateProgram } from '../services/api';

function SkeletonCard() {
  return <div className="neomorph-soft h-16 rounded-2xl animate-pulse bg-soft" />;
}

export default function Dashboard() {
  const { program, profile, language, loading, error, setProgram, setLoading, setError } = useAppContext();

  useEffect(() => {
    async function fetchProgram() {
      if (!program && profile) {
        setLoading(true);
        try {
          const data = await generateProgram({ profile, language });
          setProgram(data);
        } catch (err) {
          console.error(err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchProgram();
  }, [program, profile, language, setProgram, setLoading, setError]);

  const regenerate = async () => {
    if (!profile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await generateProgram({ profile, language });
      setProgram(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="neomorph p-6 rounded-3xl text-olive">
        <p className="mb-3 font-semibold">👋 {t('welcome', language)}</p>
        <p className="text-olive/70">{t('questionnaireIntro', language)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-olive">{t('dashboard', language)}</h2>
          <p className="text-olive/70">{profile.name}</p>
        </div>
        <button
          onClick={regenerate}
          className="px-4 py-2 rounded-full bg-olive text-warm shadow-neo hover:scale-105"
        >
          {t('regenerate', language)}
        </button>
      </div>

      {loading && (
        <div className="grid gap-3">
          {[...Array(4)].map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      )}

      {error && (
        <div className="neomorph-soft p-4 rounded-2xl text-red-700 bg-red-50">
          {t('error', language)}
        </div>
      )}

      {!loading && program && (
        <>
          <ProgramSection title="إدارة الوقت والتركيز">
            {program.sections.timeAndFocus?.timeline.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center neomorph-soft p-4 rounded-2xl">
                <div>
                  <p className="font-semibold text-olive">{item.start} - {item.end}</p>
                  <p className="text-olive/70">{item.goal}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-gold/30 text-olive text-sm">{item.focus}</span>
              </div>
            ))}
          </ProgramSection>

          <ProgramSection title="التغذية والطاقة">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {program.sections.nutritionAndEnergy?.tips.map((tip, idx) => (
                <div key={idx} className="neomorph-soft p-4 rounded-2xl card-hover">
                  <h4 className="font-semibold text-olive">{tip.title}</h4>
                  <p className="text-olive/70 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </ProgramSection>

          <ProgramSection title="التعلم والتطور">
            <div className="grid gap-3">
              {program.sections.learningAndSelfDevelopment?.activities.map((act, idx) => (
                <div key={idx} className="neomorph-soft p-4 rounded-2xl">
                  <p className="font-semibold text-olive">{act.topic}</p>
                  <p className="text-olive/70 text-sm">{act.resourceType} · {act.duration} · {act.difficulty}</p>
                </div>
              ))}
            </div>
          </ProgramSection>

          <ProgramSection title="الاستثمار والحكمة المالية">
            <div className="grid gap-2">
              {program.sections.financeAndWisdom?.steps.map((stepItem, idx) => (
                <label key={idx} className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 accent-olive" />
                  <div className="neomorph-soft p-3 rounded-2xl w-full">
                    <p className="font-semibold text-olive">{stepItem.title}</p>
                    <p className="text-sm text-olive/70">{stepItem.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </ProgramSection>

          <ProgramSection title="الترفيه وإعادة الشحن">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {program.sections.entertainmentAndRecharge?.options.map((opt, idx) => (
                <div key={idx} className="neomorph-soft p-3 rounded-2xl text-center">
                  <p className="font-semibold text-olive">{opt.title}</p>
                  <p className="text-sm text-olive/70">{opt.description}</p>
                </div>
              ))}
            </div>
          </ProgramSection>

          <ProgramSection title="محتوى روحي">
            <div className="grid gap-3">
              {program.sections.spiritualContent?.duas.map((dua, idx) => (
                <div key={idx} className="neomorph-soft p-4 rounded-2xl">
                  <p className="font-semibold text-olive">{dua.arabic}</p>
                  <p className="text-sm text-olive/70">{dua.translation}</p>
                  <span className="text-xs text-olive/60">{dua.theme}</span>
                </div>
              ))}
            </div>
          </ProgramSection>

          {program.sections.kidsContent && (
            <ProgramSection title="ركن الأطفال">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {program.sections.kidsContent.cards.map((card, idx) => (
                  <div key={idx} className="neomorph-soft p-4 rounded-2xl">
                    <p className="font-semibold text-olive">{card.title}</p>
                    <p className="text-sm text-olive/70">{card.idea}</p>
                    <span className="text-xs text-olive/60">{card.tone}</span>
                  </div>
                ))}
              </div>
            </ProgramSection>
          )}
        </>
      )}
    </div>
  );
}
