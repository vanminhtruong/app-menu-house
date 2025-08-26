import { defineStore } from 'pinia'

// Safe localStorage access
const getStoredLanguage = () => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('language') : null
  } catch {
    return null
  }
}

const setStoredLanguage = (lang: string) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  } catch {
    // Ignore localStorage errors
  }
}

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLanguage: getStoredLanguage() || 'vi'
  }),
  
  actions: {
    setLanguage(lang: string) {
      this.currentLanguage = lang
      setStoredLanguage(lang)
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