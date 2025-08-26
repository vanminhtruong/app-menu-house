import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import vi from '../locales/vi.json'

const i18n = createI18n({
  legacy: false, // You must set `false`, to use Composition API
  locale: localStorage.getItem('language') || 'vi', // set default locale
  fallbackLocale: 'vi', // set fallback locale
  messages: {
    en,
    vi
  }
})

export default i18n 