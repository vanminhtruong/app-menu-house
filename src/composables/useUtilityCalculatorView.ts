import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useLanguageStore } from '../stores/language'
import { useI18n } from 'vue-i18n'
import { useToast } from './useToast'

export function useUtilityCalculatorView(
  utilityCalculator: any,
  currentDateComposable: any,
  modalControl: any
) {
  const languageStore = useLanguageStore()
  const i18n = useI18n()
  const toast = useToast()

  // Extract needed values from composables
  const {
    electricityOld,
    electricityNew,
    waterOld,
    waterNew,
    monthlyRent,
    viewDetails
  } = utilityCalculator

  const { setCurrentDate } = currentDateComposable
  const { openDetailModal } = modalControl

  // Initialize locale and watch for language changes
  onMounted(() => {
    // Ensure locale is synchronized with language store on mount
    i18n.locale.value = languageStore.currentLanguage
  })

  watch(
    () => languageStore.currentLanguage,
    (newLang) => {
      i18n.locale.value = newLang
    },
    { immediate: true }
  )

  // Simple validation for modal opening
  const validateBeforeOpenModal = () => {
    const hasElectricityData = electricityOld.value && electricityNew.value
    const hasWaterData = waterOld.value && waterNew.value
    const hasRentData = monthlyRent.value && monthlyRent.value > 0

    // Check if any data exists
    if (!hasElectricityData && !hasWaterData && !hasRentData) {
      toast.toastWarning.noData()
      console.warn('⚠️ Vui lòng nhập ít nhất một loại tiện ích để xem chi tiết!')
      return false
    }

    // Simple validation for electricity
    if (hasElectricityData) {
      const oldElec = Number(electricityOld.value) || 0
      const newElec = Number(electricityNew.value) || 0
      if (newElec < oldElec) {
        toast.toastError.validation()
        console.error('⚡ Số điện mới không thể nhỏ hơn số điện cũ!')
        return false
      }
    }

    // Simple validation for water
    if (hasWaterData) {
      const oldWater = Number(waterOld.value) || 0
      const newWater = Number(waterNew.value) || 0
      if (newWater < oldWater) {
        toast.toastError.validation()
        console.error('💧 Số nước mới không thể nhỏ hơn số nước cũ!')
        return false
      }
    }

    return true
  }

  // Flag to prevent multiple rapid calls
  const isProcessingModalOpen = ref(false)

  // Custom modal opener with validation
  const handleOpenDetailModal = () => {
    // Prevent multiple rapid calls
    if (isProcessingModalOpen.value) {
      return
    }

    isProcessingModalOpen.value = true

    if (validateBeforeOpenModal()) {
      viewDetails() // Trigger fireworks
      openDetailModal()
    }

    // Reset flag after a short delay
    setTimeout(() => {
      isProcessingModalOpen.value = false
    }, 500)
  }

  // Handle image upload and OCR
  const handleImageUpload = async (data: {
    file: File
    type: 'electricity' | 'water'
    isOld: boolean
  }) => {
    const { file, type, isOld } = data

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.toastError.validation()
      console.error('❌ Vui lòng chọn file ảnh!')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.toastError.validation()
      console.error('❌ Kích thước ảnh quá lớn (tối đa 5MB)!')
      return
    }

    await utilityCalculator.processImageAndSetValue(file, type, isOld)
  }

  // Handle form update from imported data
  const handleUpdateForm = (record: any) => {
    // Update electricity data
    utilityCalculator.electricityOld.value = record.electricityOld
    utilityCalculator.electricityNew.value = record.electricityNew
    utilityCalculator.electricityRate.value = record.electricityRate

    // Update water data
    utilityCalculator.waterOld.value = record.waterOld
    utilityCalculator.waterNew.value = record.waterNew
    utilityCalculator.waterRate.value = record.waterRate

    // Update rent data (if available)
    if (record.monthlyRent !== undefined) {
      utilityCalculator.monthlyRent.value = record.monthlyRent || 0
    }

    // Update date
    setCurrentDate(record.date)

    // Trigger recalculation
    nextTick(() => {
      // The computed properties will automatically recalculate
      console.log('Form updated with imported data (including rent):', record)
    })
  }

  // Cleanup on component unmount
  onUnmounted(() => {
    isProcessingModalOpen.value = false
  })

  return {
    validateBeforeOpenModal,
    isProcessingModalOpen,
    handleOpenDetailModal,
    handleImageUpload,
    handleUpdateForm
  }
}
