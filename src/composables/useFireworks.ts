import { ref } from 'vue'

export function useFireworks() {
  const showFireworks = ref(false)
  
  const triggerFireworks = (duration = 5000) => {
    showFireworks.value = true
    
    setTimeout(() => {
      showFireworks.value = false
    }, duration)
  }
  
  return {
    showFireworks,
    triggerFireworks
  }
} 