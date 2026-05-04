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
      const languages = ['vi', 'en', 'ko', 'zh']
      const currentIndex = languages.indexOf(this.currentLanguage)
      const nextIndex = (currentIndex + 1) % languages.length
      this.setLanguage(languages[nextIndex])
    }
  },

  getters: {
    isVietnamese: (state) => state.currentLanguage === 'vi',
    isEnglish: (state) => state.currentLanguage === 'en',
    isKorean: (state) => state.currentLanguage === 'ko',
    isChinese: (state) => state.currentLanguage === 'zh',
    currentLanguageLabel: (state) => {
      const labels: Record<string, string> = {
        vi: 'VI',
        en: 'EN',
        ko: 'KO',
        zh: 'ZH'
      }
      return labels[state.currentLanguage] || 'VI'
    }
  }
})