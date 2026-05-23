import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

// Imports des namespaces FR
import frCommon from './fr/common'
import frLanding from './fr/landing'
import frAuth from './fr/auth'
import frChat from './fr/chat'
import frDossier from './fr/dossier'
import frRappels from './fr/rappels'
import frPricing from './fr/pricing'
import frLegal from './fr/legal'

// Imports des namespaces EN
import enCommon from './en/common'
import enLanding from './en/landing'
import enAuth from './en/auth'
import enChat from './en/chat'
import enDossier from './en/dossier'
import enRappels from './en/rappels'
import enPricing from './en/pricing'
import enLegal from './en/legal'

// Imports des namespaces ES
import esCommon from './es/common'
import esLanding from './es/landing'
import esAuth from './es/auth'
import esChat from './es/chat'
import esDossier from './es/dossier'
import esRappels from './es/rappels'
import esPricing from './es/pricing'
import esLegal from './es/legal'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: frCommon,
        landing: frLanding,
        auth: frAuth,
        chat: frChat,
        dossier: frDossier,
        rappels: frRappels,
        pricing: frPricing,
        legal: frLegal,
      },
      en: {
        common: enCommon,
        landing: enLanding,
        auth: enAuth,
        chat: enChat,
        dossier: enDossier,
        rappels: enRappels,
        pricing: enPricing,
        legal: enLegal,
      },
      es: {
        common: esCommon,
        landing: esLanding,
        auth: esAuth,
        chat: esChat,
        dossier: esDossier,
        rappels: esRappels,
        pricing: esPricing,
        legal: esLegal,
      },
    },
    lng: undefined, // détection automatique
    fallbackLng: 'fr',
    defaultNS: 'common',
    supportedLngs: ['fr', 'en', 'es'],
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'mydoctoria_lang',
    },
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
