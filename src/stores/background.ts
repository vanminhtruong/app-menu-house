import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBackgroundStore = defineStore('background', () => {
  // State
  const isEnabled = ref(localStorage.getItem('backgroundEnabled') !== 'false')

  // Actions
  const toggleBackground = () => {
    console.log('Store: toggleBackground called, current:', isEnabled.value)
    isEnabled.value = !isEnabled.value
    localStorage.setItem('backgroundEnabled', isEnabled.value.toString())
    console.log('Store: toggleBackground completed, new:', isEnabled.value)
  }

  const setBackground = (enabled: boolean) => {
    isEnabled.value = enabled
    localStorage.setItem('backgroundEnabled', enabled.toString())
  }

  // Return state and actions
  return {
    isEnabled,
    toggleBackground,
    setBackground
  }
})
