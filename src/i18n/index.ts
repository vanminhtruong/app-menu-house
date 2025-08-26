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

const i18n = createI18n({
  legacy: false, // You must set `false`, to use Composition API
  locale: getStoredLanguage() || 'vi', // set default locale
  fallbackLocale: 'vi', // set fallback locale
  globalInjection: true, // Enable global $t
  messages: {
    en,
    vi
  }
})

export default i18n