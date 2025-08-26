import { ref, watch, onMounted, onUnmounted } from 'vue'

export function useModalControl() {
  const showDetailModal = ref(false)

  // Watch for modal state changes to control body scroll
  watch(showDetailModal, (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })

  // Cleanup on component mount/unmount
  onMounted(() => {
    document.body.style.overflow = ''
  })

  onUnmounted(() => {
    document.body.style.overflow = ''
  })

  const openDetailModal = (validateFn?: () => boolean) => {
    // If validation function is provided, run it first
    if (validateFn && !validateFn()) {
      return
    }
    
    showDetailModal.value = true
    console.info('📊 Đang hiển thị chi tiết tính toán...')
  }

  const closeDetailModal = () => {
    showDetailModal.value = false
  }

  return {
    showDetailModal,
    openDetailModal,
    closeDetailModal
  }
} 