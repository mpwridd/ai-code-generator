'use client';

import { SupportedLanguage, SUPPORTED_LANGUAGES } from '@/types';

interface LanguageSelectorProps {
  value: SupportedLanguage;
  onChange: (lang: SupportedLanguage) => void;
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#cccccc] mb-2">
        Language
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SupportedLanguage)}
        className="w-full px-3 py-3 bg-[#3c3c3c] border border-[#3e3e42] rounded-lg text-[#cccccc] focus:outline-none focus:ring-2 focus:ring-[#007acc] focus:border-transparent appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23cccccc' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
        }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.icon} {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
