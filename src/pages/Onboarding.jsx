import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questions } from '../lib/questions';
import { t } from '../lib/i18n';
import { useAppContext } from '../context/AppContext';
import { generateProgram } from '../services/api';
import LanguageSelector from '../components/LanguageSelector';

export default function Onboarding() {
  const { language, setProfile, setProgram, setLoading, setError } = useAppContext();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ name: '', ageGroup: '25-40' });
  const navigate = useNavigate();

  const currentQuestion = useMemo(() => questions[step], [step]);
  const progress = `${t('progress', language)} ${step + 1} / ${questions.length}`;

  const updateAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    const profile = {
      name: answers.name || 'صديق متعة',
      language,
      ageGroup: answers.ageGroup,
      mood: answers.mood,
      energy: answers.energy,
      changeResponse: answers.change,
      thinkingStyle: answers.thinking,
      socialRecharge: answers.social,
      financialStress: answers.finance,
      incomeLevel: answers.income,
      priority: answers.priority,
      sleepQuality: answers.sleep,
      wantsKidsContent: answers.kids === 'نعم',
    };

    setProfile(profile);
    setLoading(true);
    setError(null);

    try {
      const program = await generateProgram({ profile, language });
      setProgram(program);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < questions.length - 1) setStep((prev) => prev + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="neomorph p-6 sm:p-8 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-olive/60">{progress}</p>
            <h2 className="text-2xl font-bold text-olive">{t('onboardingTitle', language)}</h2>
            <p className="text-olive/70">{t('questionnaireIntro', language)}</p>
          </div>
          <LanguageSelector />
        </div>

        {step === 0 && (
          <div className="grid gap-4">
            <label className="text-sm text-olive/80">اسمك أو لقبك المفضل</label>
            <input
              className="neomorph-soft px-4 py-3 rounded-2xl focus:outline-none"
              value={answers.name}
              onChange={(e) => updateAnswer('name', e.target.value)}
              placeholder="اكتب الاسم هنا"
            />
            <label className="text-sm text-olive/80">الفئة العمرية</label>
            <select
              className="neomorph-soft px-4 py-3 rounded-2xl focus:outline-none"
              value={answers.ageGroup}
              onChange={(e) => updateAnswer('ageGroup', e.target.value)}
            >
              <option value="under18">أقل من 18</option>
              <option value="18-25">18 - 25</option>
              <option value="25-40">25 - 40</option>
              <option value="40+">أكثر من 40</option>
            </select>
          </div>
        )}

        {step > 0 && currentQuestion && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-olive">{currentQuestion.label}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => updateAnswer(currentQuestion.id, opt)}
                  className={`neomorph-soft px-4 py-3 rounded-2xl text-left transition card-hover ${
                    answers[currentQuestion.id] === opt
                      ? 'bg-olive text-warm'
                      : 'text-olive hover:bg-olive/10'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-4 py-2 rounded-full bg-soft text-olive shadow-neo-sm disabled:opacity-50"
          >
            {t('back', language)}
          </button>
          <button
            onClick={handleNext}
            className="px-5 py-2 rounded-full bg-olive text-warm shadow-neo hover:scale-105 transition"
          >
            {step === questions.length - 1 ? t('finish', language) : t('next', language)}
          </button>
        </div>
      </div>
    </div>
  );
}
