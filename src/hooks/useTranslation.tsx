
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { translations, TranslationKeys } from "@/lib/i18n/translations";
import get from "lodash/get";

export function useTranslation() {
  const { language } = useContext(LanguageContext);
  
  function t(key: string): string {
    return get(translations[language], key, key);
  }
  
  return { t, language };
}
