import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

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
    resources: {
      en: {
        translation: translationEn,
      },
      nl: {
        translation: translationNl,
      },
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });

export default i18n;
