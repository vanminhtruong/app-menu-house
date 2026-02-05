import { ref, computed, watch } from 'vue'
import { useToast } from './useToast'
import { useI18n } from 'vue-i18n'

export function useElectricityCalculator() {
  const { toastError } = useToast()
  const { t } = useI18n()

  // Default values
  const defaultElectricityRate = 3500

  // For debouncing validation
  const debounceTimeout = ref<number | null>(null)

  // State
  const electricityOld = ref(localStorage.getItem('electricity_old') || '')
  const electricityNew = ref(localStorage.getItem('electricity_new') || '')
  const storedRate = localStorage.getItem('electricity_rate')
  const electricityRate = ref(storedRate ? Number(storedRate) : defaultElectricityRate)

  // Validation state flags
  const electricityErrorShown = ref(false)

  // Watch for state changes and persist to localStorage
  watch(electricityOld, (newVal) => {
    localStorage.setItem('electricity_old', newVal)
  })

  watch(electricityNew, (newVal) => {
    localStorage.setItem('electricity_new', newVal)
  })

  watch(electricityRate, (newVal) => {
    localStorage.setItem('electricity_rate', String(newVal))
  })

  // Watch for electricity readings validation with debounce
  watch([electricityOld, electricityNew], () => {
    // Clear any existing timeout
    if (debounceTimeout.value) {
      clearTimeout(debounceTimeout.value)
    }

    // Set a new timeout to delay validation
    debounceTimeout.value = setTimeout(() => {
      const oldValue = Number(electricityOld.value) || 0
      const newValue = Number(electricityNew.value) || 0

      // Skip validation if either value is empty or 0
      if (oldValue === 0 || newValue === 0) {
        electricityErrorShown.value = false
        return
      }

      // Skip validation if user is likely still typing (new value has fewer digits)
      if (electricityNew.value.length < electricityOld.value.length && newValue < oldValue) {
        return
      }

      // Reset error flag when values become valid
      if (newValue >= oldValue) {
        electricityErrorShown.value = false
        return
      }

      // Only show error once until values become valid again
      if (newValue < oldValue && !electricityErrorShown.value) {
        validateElectricityReadings()
        electricityErrorShown.value = true
      }
    }, 800) // 800ms delay before validation runs
  }, { immediate: false })

  // Validation functions
  const validateElectricityReadings = () => {
    const oldValue = Number(electricityOld.value) || 0
    const newValue = Number(electricityNew.value) || 0

    // Skip validation if any value is empty
    if (oldValue === 0 || newValue === 0) {
      return true
    }

    if (newValue < oldValue) {
      const errorMessage = t('toast.error.electricityValidation', '⚡ Số điện mới không thể nhỏ hơn số điện cũ!')
      toastError.validation()
      console.error(errorMessage)
      return false
    }
    return true
  }

  // Computed values with validation
  const electricityUsage = computed(() => {
    const oldValue = Number(electricityOld.value) || 0
    const newValue = Number(electricityNew.value) || 0

    // Skip validation if any value is empty
    if (oldValue === 0 || newValue === 0) {
      return 0
    }

    if (newValue < oldValue) {
      return 0 // Return 0 if invalid
    }

    return newValue - oldValue
  })

  const electricityTotal = computed(() => {
    const usage = electricityUsage.value
    return usage * Number(electricityRate.value)
  })

  // Reset method
  const resetElectricity = () => {
    electricityOld.value = ''
    electricityNew.value = ''
    electricityRate.value = defaultElectricityRate
    electricityErrorShown.value = false

    // Clear localStorage
    localStorage.removeItem('electricity_old')
    localStorage.removeItem('electricity_new')
    localStorage.removeItem('electricity_rate')
  }

  // Fill sample data
  const fillElectricitySampleData = () => {
    electricityOld.value = '13626'
    electricityNew.value = '13820'
    electricityRate.value = defaultElectricityRate
    electricityErrorShown.value = false
  }

  // Set value from OCR
  const setElectricityValueFromOCR = (value: string, isOld: boolean) => {
    if (!value) return

    if (isOld) {
      electricityOld.value = value
    } else {
      electricityNew.value = value
    }
  }

  return {
    // State
    electricityOld,
    electricityNew,
    electricityRate,
    defaultElectricityRate,

    // Computed
    electricityUsage,
    electricityTotal,

    // Methods
    validateElectricityReadings,
    resetElectricity,
    fillElectricitySampleData,
    setElectricityValueFromOCR
  }
} 