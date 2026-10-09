import React from 'react';
import { Globe } from 'lucide-react';
import { useLocale } from '../localization/LocaleProvider';

export default function LocaleToggle({ variant = 'default' }) {
  const { locale, toggleLocale, tr } = useLocale();

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleLocale}
        title={locale === 'ar' ? tr('switchToEnglish') : tr('switchToArabic')}
        className="group p-2.5 rounded-xl bg-white border border-gray-200 hover:border-[#0B3B2D] text-[#0B3B2D] hover:bg-[#0B3B2D] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
      >
        <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleLocale}
      title={locale === 'ar' ? tr('switchToEnglish') : tr('switchToArabic')}
      className="group flex items-center gap-2 text-xs font-semibold text-[#0B3B2D] bg-white border border-gray-200 hover:border-[#0B3B2D] hover:bg-[#0B3B2D] hover:text-white px-3.5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
    >
      <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
      <span>{tr('langShort')}</span>
    </button>
  );
}