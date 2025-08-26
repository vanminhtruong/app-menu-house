import { watch, onMounted, nextTick } from 'vue'
import { useThemeStore } from '../stores/theme'

export function useToastTheme() {
  const themeStore = useThemeStore()

  // Update toast container class based on theme
  const updateToastTheme = async () => {
    // Wait for DOM to be ready
    await nextTick()

    // Try multiple times to find the container (it might not exist yet)
    let attempts = 0
    const maxAttempts = 10

    const tryUpdate = () => {
      const toastContainer = document.querySelector('.Vue-Toastification__container')

      if (toastContainer) {
        if (themeStore.isDarkMode) {
          toastContainer.classList.add('dark-theme')
          toastContainer.classList.remove('light-theme')

          // Force apply dark mode styles to existing toasts
          const toasts = toastContainer.querySelectorAll('.Vue-Toastification__toast')
          toasts.forEach(toast => {
            if (toast.classList.contains('Vue-Toastification__toast--warning')) {
              (toast as HTMLElement).style.backgroundColor = '#2d3748';
              (toast as HTMLElement).style.color = '#e2e8f0';
              (toast as HTMLElement).style.borderColor = '#d69e2e';

              const progressBar = toast.querySelector('.Vue-Toastification__progress-bar') as HTMLElement;
              if (progressBar) {
                progressBar.style.backgroundColor = '#d69e2e';
              }
            }
          })
        } else {
          toastContainer.classList.add('light-theme')
          toastContainer.classList.remove('dark-theme')

          // Reset styles for light mode
          const toasts = toastContainer.querySelectorAll('.Vue-Toastification__toast')
          toasts.forEach(toast => {
            (toast as HTMLElement).style.backgroundColor = '';
            (toast as HTMLElement).style.color = '';
            (toast as HTMLElement).style.borderColor = '';

            const progressBar = toast.querySelector('.Vue-Toastification__progress-bar') as HTMLElement;
            if (progressBar) {
              progressBar.style.backgroundColor = '';
            }
          })
        }
        return true
      }

      attempts++
      if (attempts < maxAttempts) {
        setTimeout(tryUpdate, 100)
      }
      return false
    }

    tryUpdate()
  }

  // Watch for theme changes
  watch(() => themeStore.isDarkMode, () => {
    updateToastTheme()
  }, { immediate: false })

  // Update theme on mount
  onMounted(() => {
    // Delay to ensure toast container is created
    setTimeout(() => {
      updateToastTheme()
    }, 100)
  })

  // Force update theme (useful when toast container is created dynamically)
  const forceUpdateTheme = () => {
    updateToastTheme()
  }

  return {
    updateToastTheme,
    forceUpdateTheme
  }
}
