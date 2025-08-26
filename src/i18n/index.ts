import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import vi from '../locales/vi.json'

// Safe localStorage access
const getStoredLanguage = () => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('language') : null
  } catch {
    return null
  }
}

const defaultLocale = 'vi'
const storedLanguage = getStoredLanguage()

console.log('i18n init - Stored language:', storedLanguage)
console.log('i18n init - Using locale:', storedLanguage || defaultLocale)
console.log('i18n init - Available messages:', Object.keys({ en, vi }))

const i18n = createI18n({
  legacy: false, // You must set `false`, to use Composition API
  locale: storedLanguage || defaultLocale, // set default locale
  fallbackLocale: defaultLocale, // set fallback locale
  globalInjection: true, // Enable global $t
  messages: {
    en,
    vi
  },
  silentTranslationWarn: false, // Show missing translation warnings
  missingWarn: false,
  silentFallbackWarn: false
})

export default i18n