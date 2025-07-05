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
    <div className="flex items-center space-x-2" data-oid="6d1posy">
      <Globe className="w-4 h-4 text-emerald-600" data-oid="idrsko1" />
      <Select value={language} onValueChange={setLanguage} data-oid="4:ddxdr">
        <SelectTrigger
          className="w-[140px] border-emerald-300 bg-white/80 backdrop-blur-sm"
          data-oid="j_cqyxm"
        >
          <SelectValue data-oid="1fnsmav" />
        </SelectTrigger>
        <SelectContent
          className="bg-white border-emerald-200"
          data-oid="jfadh4s"
        >
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} data-oid="ztigna9">
              <div className="flex items-center space-x-2" data-oid="g:td5zs">
                <span data-oid="r5_osdw">{lang.flag}</span>
                <span data-oid="dk9e2-v">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
