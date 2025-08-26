import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // Đọc giá trị từ localStorage hoặc sử dụng dark mode mặc định
  const storedTheme = localStorage.getItem('isDarkMode')
  const isDarkMode = ref(storedTheme !== null ? storedTheme === 'true' : true)
  
  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    // Lưu vào localStorage khi chuyển đổi theme
    localStorage.setItem('isDarkMode', isDarkMode.value.toString())
    updateThemeClass()
  }
  
  function updateThemeClass() {
    // Update document class for dark mode
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark-mode')
      document.documentElement.classList.add('dark') // Thêm class dark cho tailwind
    } else {
      document.documentElement.classList.remove('dark-mode')
      document.documentElement.classList.remove('dark') // Xóa class dark cho tailwind
    }
  }

  // Initialize theme on store creation
  updateThemeClass()

  return { isDarkMode, toggleTheme, updateThemeClass }
}) 