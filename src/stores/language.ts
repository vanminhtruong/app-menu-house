import { defineStore } from 'pinia'

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: localStorage.getItem('language') || 'vi'
  }),
  
  actions: {
    setLanguage(lang: string) {
      this.currentLanguage = lang
      localStorage.setItem('language', lang)
    },
    
    toggleLanguage() {
      const newLang = this.currentLanguage === 'vi' ? 'en' : 'vi'
      this.setLanguage(newLang)
    }
  },
  
  getters: {
    isVietnamese: (state) => state.currentLanguage === 'vi',
    isEnglish: (state) => state.currentLanguage === 'en'
  }
}) 