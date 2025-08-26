import { createI18n } from 'vue-i18n'
import type { I18n } from 'vue-i18n'
import en from '../locales/en.json'
import vi from '../locales/vi.json'

// Safe locale getter with fallback
function getInitialLocale(): 'en' | 'vi' {
  try {
    const savedLocale = localStorage.getItem('language')
    return (savedLocale === 'en' || savedLocale === 'vi') ? savedLocale as 'en' | 'vi' : 'vi'
  } catch (error) {
    console.warn('localStorage not available, using default locale:', error)
    return 'vi'
  }
}

const i18n: I18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  messages: {
    en,
    vi
  }
})

export default i18n

// Utility function to change locale
export function setLocale(locale: 'en' | 'vi') {
  // In vue-i18n v9 with legacy: false, locale is a ref
  if (typeof i18n.global.locale === 'object' && 'value' in i18n.global.locale) {
    i18n.global.locale.value = locale
  }
  try {
    localStorage.setItem('language', locale)
  } catch (error) {
    console.warn('Could not save locale to localStorage:', error)
  }
  document.querySelector('html')?.setAttribute('lang', locale)
}

// Utility function to get current locale
export function getLocale(): 'en' | 'vi' {
  // Check if locale is a ref or plain value
  const locale = typeof i18n.global.locale === 'object' && 'value' in i18n.global.locale
    ? i18n.global.locale.value
    : i18n.global.locale
  return locale as 'en' | 'vi'
}

// Utility function to check if current locale is English
export function isEnglish(): boolean {
  const locale = typeof i18n.global.locale === 'object' && 'value' in i18n.global.locale
    ? i18n.global.locale.value
    : i18n.global.locale
  return locale === 'en'
}

// Utility function to toggle locale
export function toggleLocale(): 'en' | 'vi' {
  const currentLocale = getLocale()
  const newLocale = currentLocale === 'en' ? 'vi' : 'en'
  setLocale(newLocale)
  return newLocale
}