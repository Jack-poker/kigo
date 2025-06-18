
import React from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-emerald-600" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[140px] border-emerald-300 bg-white/80 backdrop-blur-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border-emerald-200">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              <div className="flex items-center space-x-2">
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
