import { ref, computed } from 'vue'

export function useRentCalculator() {
  // State
  const monthlyRent = ref<number>(0)
  
  // Computed values
  const quarterlyRent = computed(() => {
    return monthlyRent.value * 3
  })
  
  // Methods
  const resetRent = () => {
    monthlyRent.value = 0
    console.log('🏠 Đã reset tiền nhà!')
  }
  
  const fillRentSampleData = () => {
    monthlyRent.value = 2500000 // Tiền nhà mẫu: 2.5 triệu/tháng
    console.log('🏠 Đã điền dữ liệu mẫu tiền nhà: 2,500,000 VND/tháng (3 tháng = 7,500,000 VND)')
  }
  
  const validateRent = () => {
    if (!monthlyRent.value || monthlyRent.value <= 0) {
      console.warn('⚠️ Vui lòng nhập tiền nhà hợp lệ!')
      return false
    }
    return true
  }
  
  return {
    // State
    monthlyRent,
    
    // Computed
    quarterlyRent,
    
    // Methods
    resetRent,
    fillRentSampleData,
    validateRent
  }
}
