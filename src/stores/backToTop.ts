import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useThemeStore } from './theme'

export const useBackToTopStore = defineStore('backToTop', () => {
  // State
  const isVisible = ref(false)
  const scrollThreshold = ref(300)
  // Vùng cuộn thật của app (khung giữa của calculator).
  // Nếu chưa đăng ký phần tử nào thì fallback về window như trước.
  const scrollElement = ref<HTMLElement | null>(null)
  const themeStore = useThemeStore()

  // Computed properties for styling based on theme
  const buttonClasses = computed(() => {
    return themeStore.isDarkMode
      ? 'fixed bottom-6 right-6 p-3 rounded-full bg-gray-700 text-white hover:bg-gray-600 shadow-lg border border-gray-600 transition-all duration-300 z-50'
      : 'fixed bottom-6 right-6 p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg transition-all duration-300 z-50'
  })

  // Methods
  function getScrollTop() {
    return scrollElement.value ? scrollElement.value.scrollTop : window.scrollY
  }

  function updateVisibility() {
    isVisible.value = getScrollTop() > scrollThreshold.value
  }

  function scrollToTop() {
    if (scrollElement.value) {
      scrollElement.value.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
      return
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Đăng ký phần tử cuộn thay cho window (view sở hữu vùng cuộn gọi hàm này)
  function registerScrollElement(element: HTMLElement | null) {
    if (scrollElement.value) {
      scrollElement.value.removeEventListener('scroll', updateVisibility)
    }

    scrollElement.value = element

    if (element) {
      element.addEventListener('scroll', updateVisibility, { passive: true })
    }

    updateVisibility()
  }

  // Initialize event listener (to be called in main.ts or a component)
  function setupScrollListener() {
    window.addEventListener('scroll', updateVisibility, { passive: true })
    // Initial check
    updateVisibility()
  }

  // Clean up (to be called when app is unmounted if needed)
  function removeScrollListener() {
    window.removeEventListener('scroll', updateVisibility)

    if (scrollElement.value) {
      scrollElement.value.removeEventListener('scroll', updateVisibility)
      scrollElement.value = null
    }
  }

  return {
    isVisible,
    scrollThreshold,
    scrollElement,
    buttonClasses,
    updateVisibility,
    scrollToTop,
    registerScrollElement,
    setupScrollListener,
    removeScrollListener
  }
})
