import React from "react";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  return (
    <div className="flex items-center space-x-2" data-oid="l.4t32-">
      <Globe className="w-4 h-4 text-emerald-600" data-oid="n7:aylc" />
      <Select value={language} onValueChange={setLanguage} data-oid="_p2_q3-">
        <SelectTrigger
          className="w-[140px] border-emerald-300 bg-white/80 backdrop-blur-sm"
          data-oid="a8j2-hd"
        >
          <SelectValue data-oid="9ts719w" />
        </SelectTrigger>
        <SelectContent
          className="bg-white border-emerald-200"
          data-oid="m:y2s:m"
        >
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} data-oid="zneo7gr">
              <div className="flex items-center space-x-2" data-oid="aqg1z3u">
                <span data-oid="y1pe0om">{lang.flag}</span>
                <span data-oid=".wifd37">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
