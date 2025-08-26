import { ref, computed } from 'vue'
import { useToast } from './useToast'
import { useI18n } from 'vue-i18n'

export interface CalculationRecord {
  id: string
  date: string
  timestamp: number
  electricityOld: number | string
  electricityNew: number | string
  electricityRate: number
  electricityUsage: number
  electricityTotal: number
  waterOld: number | string
  waterNew: number | string
  waterRate: number
  waterUsage: number
  waterTotal: number
  monthlyRent?: number
  quarterlyRent?: number
  totalBill: number
}

export function useDataPersistence() {
  const { showSuccess, showError } = useToast()
  const { t } = useI18n()

  const records = ref<CalculationRecord[]>([])
  const isLoading = ref(false)
  const isSaving = ref(false)

  // Callback function to update form data when importing
  let updateFormCallback: ((record: CalculationRecord) => void) | null = null
  
  // File paths
  const DATA_FILE_NAME = 'utility_calculations.json'
  const BACKUP_FILE_NAME = 'utility_calculations_backup.json'
  
  // Set callback function to update form when importing data
  const setUpdateFormCallback = (callback: (record: CalculationRecord) => void) => {
    updateFormCallback = callback
  }

  // Auto-load data from localStorage on initialization
  const initializeData = () => {
    try {
      const savedData = localStorage.getItem('utility_calculations')
      if (savedData) {
        const data = JSON.parse(savedData)
        if (Array.isArray(data)) {
          records.value = data
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
    }
  }

  // Load data from file
  const loadDataFromFile = async (): Promise<CalculationRecord[]> => {
    try {
      isLoading.value = true

      // Try to read from file using File System Access API (if supported)
      if ('showOpenFilePicker' in window) {
        const [fileHandle] = await (window as any).showOpenFilePicker({
          types: [{
            description: 'JSON files',
            accept: { 'application/json': ['.json'] }
          }],
          suggestedName: DATA_FILE_NAME
        })

        const file = await fileHandle.getFile()
        const content = await file.text()
        const data = JSON.parse(content)

        if (Array.isArray(data)) {
          records.value = data
          // Also save to localStorage as backup
          localStorage.setItem('utility_calculations', JSON.stringify(data))

          // Update form with latest record if available and callback is set
          if (data.length > 0 && updateFormCallback) {
            updateFormCallback(data[0]) // Use the first (latest) record
          }

          showSuccess(t('toast.success.dataLoaded', 'Dữ liệu đã được tải thành công!'))
          return data
        }
      }

      // Fallback: Load from localStorage if file picker not available
      const savedData = localStorage.getItem('utility_calculations')
      if (savedData) {
        const data = JSON.parse(savedData)
        records.value = data

        // Update form with latest record if available and callback is set
        if (data.length > 0 && updateFormCallback) {
          updateFormCallback(data[0]) // Use the first (latest) record
        }

        showSuccess(t('toast.success.dataLoaded', 'Dữ liệu đã được tải từ bộ nhớ!'))
        return data
      }

      return []
    } catch (error) {
      console.error('Error loading data:', error)
      showError(t('toast.error.dataLoadFailed', 'Không thể tải dữ liệu!'))

      // Try to load from localStorage as fallback
      try {
        const savedData = localStorage.getItem('utility_calculations')
        if (savedData) {
          const data = JSON.parse(savedData)
          records.value = data
          showSuccess(t('toast.success.dataLoaded', 'Dữ liệu đã được tải từ bộ nhớ dự phòng!'))
          return data
        }
      } catch (fallbackError) {
        console.error('Fallback loading also failed:', fallbackError)
      }

      return []
    } finally {
      isLoading.value = false
    }
  }
  
  // Save data to localStorage (always)
  const saveToLocalStorage = (data: CalculationRecord[]) => {
    try {
      const jsonData = JSON.stringify(data, null, 2)
      localStorage.setItem('utility_calculations', jsonData)
      // Also create a backup with timestamp
      localStorage.setItem('utility_calculations_backup', jsonData)
      localStorage.setItem('utility_calculations_last_saved', new Date().toISOString())
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  // Save data to file
  const saveDataToFile = async (data: CalculationRecord[], showToast: boolean = true): Promise<boolean> => {
    try {
      isSaving.value = true

      const jsonData = JSON.stringify(data, null, 2)

      // Always save to localStorage first
      saveToLocalStorage(data)

      // Try to save using File System Access API (if supported)
      if ('showSaveFilePicker' in window) {
        const fileHandle = await (window as any).showSaveFilePicker({
          types: [{
            description: 'JSON files',
            accept: { 'application/json': ['.json'] }
          }],
          suggestedName: DATA_FILE_NAME
        })

        const writable = await fileHandle.createWritable()
        await writable.write(jsonData)
        await writable.close()

        if (showToast) {
          showSuccess(t('toast.success.dataSaved', 'Dữ liệu đã được lưu vào file và bộ nhớ!'))
        }
        return true
      }

      // Fallback: Download as file
      const blob = new Blob([jsonData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = DATA_FILE_NAME
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      if (showToast) {
        showSuccess(t('toast.success.dataSaved', 'Dữ liệu đã được tải xuống và lưu vào bộ nhớ!'))
      }
      return true
    } catch (error) {
      console.error('Error saving data:', error)
      // Don't show error toast if showToast is false
      if (showToast) {
        showError(t('toast.error.dataSaveFailed', 'Không thể lưu file, nhưng đã lưu vào bộ nhớ!'))
      }
      return false
    } finally {
      isSaving.value = false
    }
  }
  
  // Add new calculation record
  const addRecord = async (record: Omit<CalculationRecord, 'id' | 'timestamp'>): Promise<boolean> => {
    const newRecord: CalculationRecord = {
      ...record,
      id: `calc_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now()
    }

    records.value.unshift(newRecord) // Add to beginning

    // Always save to localStorage immediately (silently)
    saveToLocalStorage(records.value)

    // Try to save to file (silently, no toast from this call)
    const fileSuccess = await saveDataToFile(records.value, false)

    // Show single success message
    if (fileSuccess) {
      showSuccess(t('dataManager.saveSuccess', 'Đã lưu tiến độ thành công vào file và bộ nhớ!'))
    } else {
      showSuccess(t('dataManager.saveSuccess', 'Đã lưu tiến độ thành công vào bộ nhớ!'))
    }

    return true // Always return true since localStorage save always works
  }
  
  // Delete record
  const deleteRecord = async (id: string): Promise<boolean> => {
    const index = records.value.findIndex(r => r.id === id)
    if (index !== -1) {
      records.value.splice(index, 1)
      // Save to localStorage immediately
      saveToLocalStorage(records.value)
      // Also try to save to file (with toast)
      return await saveDataToFile(records.value, true)
    }
    return false
  }

  // Clear all records
  const clearAllRecords = async (): Promise<boolean> => {
    records.value = []
    // Clear localStorage too
    localStorage.removeItem('utility_calculations')
    localStorage.removeItem('utility_calculations_backup')
    localStorage.removeItem('utility_calculations_last_saved')
    // Also try to save empty file (with toast)
    return await saveDataToFile([], true)
  }
  
  // Export data
  const exportData = async (): Promise<void> => {
    await saveDataToFile(records.value)
  }
  
  // Import data
  const importData = async (): Promise<void> => {
    await loadDataFromFile()
  }
  
  // Computed properties
  const totalRecords = computed(() => records.value.length)
  const latestRecord = computed(() => records.value[0] || null)
  
  // Statistics
  const totalElectricitySpent = computed(() => 
    records.value.reduce((sum, record) => sum + Number(record.electricityTotal), 0)
  )
  
  const totalWaterSpent = computed(() => 
    records.value.reduce((sum, record) => sum + Number(record.waterTotal), 0)
  )
  
  const totalSpent = computed(() =>
    records.value.reduce((sum, record) => sum + Number(record.totalBill), 0)
  )

  // Auto-initialize data from localStorage when composable is used
  initializeData()

  return {
    // State
    records,
    isLoading,
    isSaving,

    // Methods
    initializeData,
    setUpdateFormCallback,
    loadDataFromFile,
    saveDataToFile,
    saveToLocalStorage,
    addRecord,
    deleteRecord,
    clearAllRecords,
    exportData,
    importData,

    // Computed
    totalRecords,
    latestRecord,
    totalElectricitySpent,
    totalWaterSpent,
    totalSpent
  }
}
