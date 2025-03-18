
import { en } from "./en";
import { es } from "./es";

export const translations = {
  en,
  es,
};

export type LanguageCode = keyof typeof translations;
export type TranslationKeys = typeof en;
