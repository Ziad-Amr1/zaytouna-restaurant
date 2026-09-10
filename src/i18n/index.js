import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";

const STORAGE_KEY = "language";

const resources = {
  en: {
    translation: en,
  },
};

const supportedLanguages = Object.freeze(Object.keys(resources));

function readInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && supportedLanguages.includes(stored) ? stored : "en";
  } catch {
    return "en";
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: readInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: supportedLanguages,
  load: "currentOnly",
  interpolation: {
    escapeValue: false,
  },
});

function setLanguage(lng) {
  if (!supportedLanguages.includes(lng)) {
    return Promise.resolve(i18n);
  }
  return i18n.changeLanguage(lng).then(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lng);
    } catch {
      // storage unavailable
    }
  });
}

export { supportedLanguages, setLanguage };
export default i18n;