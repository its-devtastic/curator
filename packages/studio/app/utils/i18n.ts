import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

import translationEn from "../locales/en/translation.json";
import translationNl from "../locales/nl/translation.json";

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    ns: ["translation", "custom"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

// Add default translation files.
i18n
  .addResources("en", "translation", translationEn)
  .addResources("nl", "translation", translationNl);

export default i18n;
