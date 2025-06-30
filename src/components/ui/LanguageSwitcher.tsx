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
    <div className="flex items-center space-x-2" data-oid="b3cq3mb">
      <Globe className="w-4 h-4 text-emerald-600" data-oid="sbh0692" />
      <Select value={language} onValueChange={setLanguage} data-oid="82t4lbp">
        <SelectTrigger
          className="w-[140px] border-emerald-300 bg-white/80 backdrop-blur-sm"
          data-oid="0new463"
        >
          <SelectValue data-oid="fjito4b" />
        </SelectTrigger>
        <SelectContent
          className="bg-white border-emerald-200"
          data-oid="ru6ogfi"
        >
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} data-oid=".1:zdmm">
              <div className="flex items-center space-x-2" data-oid="9uc_.oz">
                <span data-oid="ua642gu">{lang.flag}</span>
                <span data-oid="p.7nrnb">{lang.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
