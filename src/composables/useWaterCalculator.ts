import { ref, computed, watch } from 'vue'
import { useToast } from './useToast'
import { useI18n } from 'vue-i18n'

export function useWaterCalculator() {
  const { toastError } = useToast()
  const { t } = useI18n()

  // Default values
  const defaultWaterRate = 30000

  // For debouncing validation
  const debounceTimeout = ref<number | null>(null)

  // Helper: get current period as YYYY-MM
  const getCurrentPeriod = (): string => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  }

  // Check for month transition: new reading becomes old reading
  const currentPeriod = getCurrentPeriod()
  const lastActivePeriod = localStorage.getItem('utility_last_period')
  let storedOld = localStorage.getItem('water_old') || ''
  let storedNew = localStorage.getItem('water_new') || ''

  if (lastActivePeriod && lastActivePeriod < currentPeriod && storedNew) {
    // Month changed: shift new -> old, clear new
    storedOld = storedNew
    storedNew = ''
    localStorage.setItem('water_old', storedOld)
    localStorage.setItem('water_new', storedNew)
  }

  // Always update last active period to current
  localStorage.setItem('utility_last_period', currentPeriod)

  // State
  const waterOld = ref(storedOld)
  const waterNew = ref(storedNew)
  const storedRate = localStorage.getItem('water_rate')
  const waterRate = ref(storedRate ? Number(storedRate) : defaultWaterRate)

  // Validation state flags
  const waterErrorShown = ref(false)

  // Watch for state changes and persist to localStorage
  watch(waterOld, (newVal) => {
    localStorage.setItem('water_old', newVal)
  })

  watch(waterNew, (newVal) => {
    localStorage.setItem('water_new', newVal)
  })

  watch(waterRate, (newVal) => {
    localStorage.setItem('water_rate', String(newVal))
  })

  // Watch for water readings validation with debounce
  watch([waterOld, waterNew], () => {
    // Clear any existing timeout
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value)
    }

    // Set a new timeout to delay validation
    debounceTimeout.value = setTimeout(() => {
      const oldValue = Number(waterOld.value) || 0
      const newValue = Number(waterNew.value) || 0

      // Skip validation if either value is empty or 0
      if (oldValue === 0 || newValue === 0) {
        waterErrorShown.value = false
        return
      }

      // Skip validation if user is likely still typing (new value has fewer digits)
      if (waterNew.value.length < waterOld.value.length && newValue < oldValue) {
        return
      }

      // Reset error flag when values become valid
      if (newValue >= oldValue) {
        waterErrorShown.value = false
        return
      }

      // Only show error once until values become valid again
      if (newValue < oldValue && !waterErrorShown.value) {
        validateWaterReadings()
        waterErrorShown.value = true
      }
    }, 800) // 800ms delay before validation runs
  }, { immediate: false })

  // Validation functions
  const validateWaterReadings = () => {
    const oldValue = Number(waterOld.value) || 0
    const newValue = Number(waterNew.value) || 0

    // Skip validation if any value is empty
    if (oldValue === 0 || newValue === 0) {
      return true
    }

    if (newValue < oldValue) {
      const errorMessage = t('toast.error.waterValidation', '💧 Số nước mới không thể nhỏ hơn số nước cũ!')
      toastError.validation()
      console.error(errorMessage)
      return false
    }
    return true
  }

  // Computed values with validation
  const waterUsage = computed(() => {
    const oldValue = Number(waterOld.value) || 0
    const newValue = Number(waterNew.value) || 0

    // Skip validation if any value is empty
    if (oldValue === 0 || newValue === 0) {
      return 0
    }

    if (newValue < oldValue) {
      return 0 // Return 0 if invalid
    }

    return newValue - oldValue
  })

  const waterTotal = computed(() => {
    const usage = waterUsage.value
    return usage * Number(waterRate.value)
  })

  // Reset method
  const resetWater = () => {
    waterOld.value = ''
    waterNew.value = ''
    waterRate.value = defaultWaterRate
    waterErrorShown.value = false

    // Clear localStorage
    localStorage.removeItem('water_old')
    localStorage.removeItem('water_new')
    localStorage.removeItem('water_rate')
  }

  // Fill sample data
  const fillWaterSampleData = () => {
    waterOld.value = '276'
    waterNew.value = '284'
    waterRate.value = defaultWaterRate
    waterErrorShown.value = false
  }

  // Set value from OCR
  const setWaterValueFromOCR = (value: string, isOld: boolean) => {
    if (!value) return

    if (isOld) {
      waterOld.value = value
    } else {
      waterNew.value = value
    }
  }

  return {
    // State
    waterOld,
    waterNew,
    waterRate,
    defaultWaterRate,

    // Computed
    waterUsage,
    waterTotal,

    // Methods
    validateWaterReadings,
    resetWater,
    fillWaterSampleData,
    setWaterValueFromOCR
  }
}
