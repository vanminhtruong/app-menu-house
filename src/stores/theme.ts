import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const storedTheme = localStorage.getItem('themeMode')
  const oldStored = localStorage.getItem('isDarkMode')
  
  let defaultTheme: 'light' | 'dark' | 'pure-dark' = 'dark'
  if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'pure-dark') {
    defaultTheme = storedTheme
  } else if (oldStored !== null) {
    defaultTheme = oldStored === 'true' ? 'dark' : 'light'
  }
  
  const themeMode = ref<'light' | 'dark' | 'pure-dark'>(defaultTheme)
  const isDarkMode = computed(() => themeMode.value !== 'light')
  const isPureDark = computed(() => themeMode.value === 'pure-dark')
  
  function toggleTheme() {
    if (themeMode.value === 'light') {
      themeMode.value = 'dark'
    } else if (themeMode.value === 'dark') {
      themeMode.value = 'pure-dark'
    } else {
      themeMode.value = 'light'
    }
    
    localStorage.setItem('themeMode', themeMode.value)
    localStorage.setItem('isDarkMode', isDarkMode.value.toString())
    updateThemeClass()
  }
  
  function updateThemeClass() {
    document.documentElement.classList.remove('dark-mode', 'dark', 'pure-dark-mode')
    if (themeMode.value === 'dark') {
      document.documentElement.classList.add('dark-mode', 'dark')
    } else if (themeMode.value === 'pure-dark') {
      document.documentElement.classList.add('dark-mode', 'dark', 'pure-dark-mode')
    }
  }

  // Initialize
  updateThemeClass()

  return { isDarkMode, themeMode, isPureDark, toggleTheme, updateThemeClass }
}) 