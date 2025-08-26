import { ref } from 'vue'

export function useCurrentDate() {
  const currentDate = ref(new Date().toLocaleDateString('vi-VN'))

  const setCurrentDate = (date: string) => {
    currentDate.value = date
  }

  const resetToToday = () => {
    currentDate.value = new Date().toLocaleDateString('vi-VN')
  }

  return {
    currentDate,
    setCurrentDate,
    resetToToday
  }
}