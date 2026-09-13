import i18next from "i18next"
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import plTranslation from "./locales/pl/translation.json"
import enTranslation from "./locales/en/translation.json"

i18next
    .use(initReactI18next)
    .use(I18nextBrowserLanguageDetector)
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        resources: {
            en: {
                translation: enTranslation
            },
            pl: {
                translation: plTranslation
            }
        }
    })

export default i18next