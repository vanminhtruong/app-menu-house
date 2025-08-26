import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useThemeStore } from './theme'

export const useBackToTopStore = defineStore('backToTop', () => {
  // State
  const isVisible = ref(false)
  const scrollThreshold = ref(300)
  const themeStore = useThemeStore()
  
  // Computed properties for styling based on theme
  const buttonClasses = computed(() => {
    return themeStore.isDarkMode
      ? 'fixed bottom-6 right-6 p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 shadow-lg border border-gray-600 transition-all duration-300 z-50'
      : 'fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg transition-all duration-300 z-50'
  })
  
  // Methods
  function updateVisibility() {
    isVisible.value = window.scrollY > scrollThreshold.value
  }
  
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  
  // Initialize event listener (to be called in main.ts or a component)
  function setupScrollListener() {
    window.addEventListener('scroll', updateVisibility)
    // Initial check
    updateVisibility()
  }
  
  // Clean up (to be called when app is unmounted if needed)
  function removeScrollListener() {
    window.removeEventListener('scroll', updateVisibility)
  }
  
  return {
    isVisible,
    scrollThreshold,
    buttonClasses,
    updateVisibility,
    scrollToTop,
    setupScrollListener,
    removeScrollListener
  }
}) 