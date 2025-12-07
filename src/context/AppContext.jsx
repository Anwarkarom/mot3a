import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext();

const STORAGE_KEYS = {
  language: 'mot3a_language',
  profile: 'mot3a_profile',
  program: 'mot3a_program',
};

const hasStorage = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const readFromStorage = (key, fallback) => {
  if (!hasStorage()) return fallback;
  const stored = localStorage.getItem(key);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.warn(`Failed to parse stored value for ${key}`, error);
    return fallback;
  }
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => readFromStorage(STORAGE_KEYS.language, 'ar'));
  const [profile, setProfile] = useState(() => readFromStorage(STORAGE_KEYS.profile, null));
  const [program, setProgram] = useState(() => readFromStorage(STORAGE_KEYS.program, null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (hasStorage()) {
      localStorage.setItem(STORAGE_KEYS.language, language);
    }
  }, [language]);

  useEffect(() => {
    if (profile && hasStorage()) {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    if (program && hasStorage()) {
      localStorage.setItem(STORAGE_KEYS.program, JSON.stringify(program));
    }
  }, [program]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      profile,
      setProfile,
      program,
      setProgram,
      loading,
      setLoading,
      error,
      setError,
    }),
    [language, profile, program, loading, error]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
