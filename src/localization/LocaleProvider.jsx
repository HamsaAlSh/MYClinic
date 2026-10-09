import React, { createContext, useContext, useEffect, useState } from 'react';
import { dictionary } from './dictionary';

const LocaleContext = createContext();

export function LocaleProvider({ children }) {
  // اقرأ اللغة من localStorage أو العربية افتراضياً
  const [locale, setLocale] = useState(() => {
    return localStorage.getItem('app_locale') || 'ar';
  });

  // تغيير اتجاه الصفحة + حفظ التفضيل
  useEffect(() => {
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    localStorage.setItem('app_locale', locale);
  }, [locale]);

  const toggleLocale = () => {
    setLocale(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  // دالة ترجمة
  const tr = (key) => {
    return dictionary[locale]?.[key] || key;
  };

  return (
    <LocaleContext.Provider 
      value={{ 
        locale, 
        setLocale, 
        toggleLocale, 
        tr, 
        isRTL: locale === 'ar' 
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}