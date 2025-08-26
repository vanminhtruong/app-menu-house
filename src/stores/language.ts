import { defineStore } from 'pinia'
import { setLocale, getLocale, toggleLocale } from '../i18n'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: getLocale()
  }),
  
  actions: {
    setLanguage(lang: 'en' | 'vi') {
      this.currentLanguage = lang
      setLocale(lang)
    },
    
    toggleLanguage() {
      const newLang = toggleLocale()
      this.currentLanguage = newLang
      return newLang
    }
  },
  
  getters: {
    isVietnamese: (state) => state.currentLanguage === 'vi',
    isEnglish: (state) => state.currentLanguage === 'en'
  }
})