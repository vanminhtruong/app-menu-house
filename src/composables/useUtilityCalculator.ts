import { ref, computed } from 'vue'
import { useElectricityCalculator } from './useElectricityCalculator'
import { useWaterCalculator } from './useWaterCalculator'
import { useRentCalculator } from './useRentCalculator'
import { useFormatterUtils } from './useFormatterUtils'
import { useTabControl } from './useTabControl'
import { useImageOCR } from './useImageOCR'
import { useFireworks } from './useFireworks'
import { useToast } from './useToast'
import { useI18n } from 'vue-i18n'

export function useUtilityCalculator() {
  const { formatCurrency } = useFormatterUtils()
  const { t } = useI18n()

  // Get electricity, water and rent calculators
  const electricity = useElectricityCalculator()
  const water = useWaterCalculator()
  const rent = useRentCalculator()

  // Get OCR functionality
  const { isProcessing, progress, processImage } = useImageOCR()

  // Get tab control
  const { activeTab, changeTab } = useTabControl('both')

  // Get fireworks
  const { showFireworks, triggerFireworks } = useFireworks()

  // Get toast notifications
  const { toastSuccess, toastError, toastWarning, toastInfo, showSuccess, showError } = useToast()

  // Computed total bill (bao gồm điện, nước và tiền nhà)
  const totalBill = computed(() => {
    return electricity.electricityTotal.value + water.waterTotal.value + rent.quarterlyRent.value
  })

  // Methods
  const resetForm = () => {
    electricity.resetElectricity()
    water.resetWater()
    rent.resetRent()
    toastSuccess.reset()
    console.log('Đã reset form thành công!')
  }

  const fillSampleData = () => {
    electricity.fillElectricitySampleData()
    water.fillWaterSampleData()
    rent.fillRentSampleData()
    showSuccess(t('toast.success.fillSampleData', 'Đã điền dữ liệu mẫu thành công!'))
    console.log('Đã điền dữ liệu mẫu!')
  }

  // Process image and set value
  const processImageAndSetValue = async (file: File, type: 'electricity' | 'water', isOld: boolean) => {
    if (!file) return

    try {
      toastInfo.processing()
      const result = await processImage(file)

      if (result) {
        if (type === 'electricity') {
          electricity.setElectricityValueFromOCR(result, isOld)
        } else {
          water.setWaterValueFromOCR(result, isOld)
        }
        toastSuccess.upload()
      } else {
        toastError.upload()
        promptManualEntry(type, isOld)
      }
    } catch (error) {
      console.error('Error processing image:', error)
      console.error('Lỗi khi xử lý ảnh!')
      toastError.upload()

      // Hiển thị hộp thoại nhập thủ công khi OCR thất bại
      promptManualEntry(type, isOld)
    }
  }
  
  // Hiển thị hộp thoại nhập thủ công khi OCR thất bại
  const promptManualEntry = (type: 'electricity' | 'water', isOld: boolean) => {
    // Hiển thị thông báo gợi ý
    const manualEntryMessage = t('calculator.imageUpload.manualEntry', 'Vui lòng nhập số liệu thủ công')
    toastWarning.validation()
    console.info(' ' + manualEntryMessage)

    // Focus vào input tương ứng
    setTimeout(() => {
      if (type === 'electricity') {
        const inputId = isOld ? 'electricity-old' : 'electricity-new'
        const inputElement = document.getElementById(inputId) as HTMLInputElement
        if (inputElement) {
          inputElement.focus()
        }
      } else {
        const inputId = isOld ? 'water-old' : 'water-new'
        const inputElement = document.getElementById(inputId) as HTMLInputElement
        if (inputElement) {
          inputElement.focus()
        }
      }
    }, 500)
  }

  // Trigger fireworks when viewing details
  const viewDetails = () => {
    // Hiện pháo hoa khi xem chi tiết
    triggerFireworks(3000)
    return true
  }

  return {
    // State from electricity calculator
    electricityOld: electricity.electricityOld,
    electricityNew: electricity.electricityNew,
    electricityRate: electricity.electricityRate,
    defaultElectricityRate: electricity.defaultElectricityRate,
    
    // Computed from electricity calculator
    electricityUsage: electricity.electricityUsage,
    electricityTotal: electricity.electricityTotal,
    
    // Methods from electricity calculator
    validateElectricityReadings: electricity.validateElectricityReadings,
    
    // State from water calculator
    waterOld: water.waterOld,
    waterNew: water.waterNew,
    waterRate: water.waterRate,
    defaultWaterRate: water.defaultWaterRate,
    
    // Computed from water calculator
    waterUsage: water.waterUsage,
    waterTotal: water.waterTotal,
    
    // Methods from water calculator
    validateWaterReadings: water.validateWaterReadings,
    
    // State from rent calculator
    monthlyRent: rent.monthlyRent,
    
    // Computed from rent calculator
    quarterlyRent: rent.quarterlyRent,
    
    // Methods from rent calculator
    validateRent: rent.validateRent,
    
    // Tab control
    activeTab,
    changeTab,
    
    // Image OCR
    isProcessing,
    progress,
    processImageAndSetValue,
    
    // Fireworks
    showFireworks,
    
    // Utility methods
    totalBill,
    resetForm,
    fillSampleData,
    formatCurrency,
    viewDetails
  }
} 