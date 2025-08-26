<template>
  <div :class="[
    'rounded-lg border',
    themeStore.isDarkMode
      ? 'bg-gray-800 border-gray-600 text-white'
      : 'bg-white border-gray-200'
  ]">
    <!-- Header with toggle button -->
    <div
      @click="isDataManagerExpanded = !isDataManagerExpanded"
      :class="[
        'flex items-center justify-between p-4 cursor-pointer transition-all duration-200',
        themeStore.isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
      ]"
    >
      <h3 :class="[
        'text-lg font-semibold flex items-center',
        themeStore.isDarkMode ? 'text-white' : 'text-gray-800'
      ]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        {{ $t('dataManager.title', 'Quản lý dữ liệu') }}
      </h3>

      <!-- Toggle icon -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :class="[
          'h-5 w-5 transition-transform duration-200',
          isDataManagerExpanded ? 'rotate-180' : '',
          themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Collapsible content -->
    <transition
      name="slide-fade"
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-300 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="isDataManagerExpanded" class="overflow-hidden">
        <div class="p-4 pt-0">
          <!-- Statistics -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      <div :class="[
        'p-3 rounded-lg text-center',
        themeStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
      ]">
        <div :class="[
          'text-2xl font-bold',
          themeStore.isDarkMode ? 'text-blue-400' : 'text-blue-600'
        ]">{{ totalRecords }}</div>
        <div :class="[
          'text-sm',
          themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]">{{ $t('dataManager.totalRecords', 'Tổng bản ghi') }}</div>
      </div>
      
      <div :class="[
        'p-3 rounded-lg text-center',
        themeStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
      ]">
        <div :class="[
          'text-lg font-bold',
          themeStore.isDarkMode ? 'text-green-400' : 'text-green-600'
        ]">{{ formatCurrency(totalElectricitySpent) }}</div>
        <div :class="[
          'text-sm',
          themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]">{{ $t('dataManager.totalElectricity', 'Tổng tiền điện') }}</div>
      </div>
      
      <div :class="[
        'p-3 rounded-lg text-center',
        themeStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
      ]">
        <div :class="[
          'text-lg font-bold',
          themeStore.isDarkMode ? 'text-cyan-400' : 'text-cyan-600'
        ]">{{ formatCurrency(totalWaterSpent) }}</div>
        <div :class="[
          'text-sm',
          themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]">{{ $t('dataManager.totalWater', 'Tổng tiền nước') }}</div>
      </div>
      
      <div :class="[
        'p-3 rounded-lg text-center',
        themeStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
      ]">
        <div :class="[
          'text-lg font-bold',
          themeStore.isDarkMode ? 'text-orange-400' : 'text-orange-600'
        ]">{{ formatCurrency(totalRentSpent) }}</div>
        <div :class="[
          'text-sm',
          themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]">{{ $t('dataManager.totalRent', 'Tổng tiền nhà') }}</div>
      </div>
      
      <div :class="[
        'p-3 rounded-lg text-center',
        themeStore.isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
      ]">
        <div :class="[
          'text-lg font-bold',
          themeStore.isDarkMode ? 'text-purple-400' : 'text-purple-600'
        ]">{{ formatCurrency(totalSpent) }}</div>
        <div :class="[
          'text-sm',
          themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
        ]">{{ $t('dataManager.totalSpent', 'Tổng chi phí') }}</div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-wrap gap-3 mb-4">
      <button
        @click="saveCurrentCalculation"
        :disabled="!canSave || isSaving"
        :class="[
          'flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200',
          canSave && !isSaving
            ? themeStore.isDarkMode
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        ]"
      >
        <svg v-if="!isSaving" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <svg v-else class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isSaving ? $t('dataManager.saving', 'Đang lưu...') : $t('dataManager.saveProgress', 'Lưu tiến độ') }}
      </button>

      <button
        @click="exportData"
        :disabled="totalRecords === 0 || isSaving"
        :class="[
          'flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200',
          totalRecords > 0 && !isSaving
            ? themeStore.isDarkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {{ $t('dataManager.exportData', 'Xuất dữ liệu') }}
      </button>

      <button
        @click="importData"
        :disabled="isLoading"
        :class="[
          'flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200',
          !isLoading
            ? themeStore.isDarkMode
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        ]"
      >
        <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
        <svg v-else class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isLoading ? $t('dataManager.loading', 'Đang tải...') : $t('dataManager.importData', 'Nhập dữ liệu') }}
      </button>

      <button
        v-if="totalRecords > 0"
        @click="clearAllData"
        :disabled="isSaving"
        :class="[
          'flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200',
          !isSaving
            ? themeStore.isDarkMode
              ? 'bg-red-600 hover:bg-red-500 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        {{ $t('dataManager.clearAll', 'Xóa tất cả') }}
      </button>
    </div>

    <!-- Latest record preview -->
    <div v-if="latestRecord" :class="[
      'rounded-lg border-l-4',
      themeStore.isDarkMode
        ? 'bg-gray-700 border-l-blue-400'
        : 'bg-gray-50 border-l-blue-500'
    ]">
      <!-- Header with toggle button -->
      <div
        @click="isLatestRecordExpanded = !isLatestRecordExpanded"
        :class="[
          'flex items-center justify-between p-4 cursor-pointer transition-all duration-200',
          themeStore.isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
        ]"
      >
        <h4 :class="[
          'font-medium flex items-center',
          themeStore.isDarkMode ? 'text-white' : 'text-gray-800'
        ]">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ $t('dataManager.latestRecord', 'Bản ghi mới nhất') }}
        </h4>

        <!-- Toggle icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :class="[
            'h-5 w-5 transition-transform duration-200',
            isLatestRecordExpanded ? 'rotate-180' : '',
            themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          ]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      <!-- Collapsible content -->
      <transition
        name="slide-fade"
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-300 ease-in"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-screen"
        leave-from-class="opacity-100 max-h-screen"
        leave-to-class="opacity-0 max-h-0"
      >
        <div v-show="isLatestRecordExpanded" class="overflow-hidden">
          <div :class="[
            'px-4 pb-4 text-sm space-y-2',
            themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          ]">
            <div class="font-medium">{{ $t('dataManager.date', 'Ngày') }}: {{ latestRecord.date }}</div>

        <!-- Electricity details -->
        <div :class="[
          'p-2 rounded border-l-2',
          themeStore.isDarkMode ? 'bg-gray-800 border-l-green-400' : 'bg-green-50 border-l-green-500'
        ]">
          <div class="font-medium text-green-600 mb-1">{{ $t('calculator.tabs.electricity', 'Điện') }}:</div>
          <div class="text-xs space-y-1">
            <div>{{ $t('dataManager.oldReading', 'Chỉ số cũ') }}: {{ latestRecord.electricityOld }}</div>
            <div>{{ $t('dataManager.newReading', 'Chỉ số mới') }}: {{ latestRecord.electricityNew }}</div>
            <div>{{ $t('dataManager.usage', 'Sử dụng') }}: {{ latestRecord.electricityUsage }} kWh</div>
            <div>{{ $t('dataManager.rate', 'Đơn giá') }}: {{ formatCurrency(latestRecord.electricityRate) }}/kWh</div>
            <div class="font-medium">{{ $t('dataManager.amount', 'Thành tiền') }}: {{ formatCurrency(latestRecord.electricityTotal) }}</div>
          </div>
        </div>

        <!-- Water details -->
        <div :class="[
          'p-2 rounded border-l-2',
          themeStore.isDarkMode ? 'bg-gray-800 border-l-cyan-400' : 'bg-cyan-50 border-l-cyan-500'
        ]">
          <div class="font-medium text-cyan-600 mb-1">{{ $t('calculator.tabs.water', 'Nước') }}:</div>
          <div class="text-xs space-y-1">
            <div>{{ $t('dataManager.oldReading', 'Chỉ số cũ') }}: {{ latestRecord.waterOld }}</div>
            <div>{{ $t('dataManager.newReading', 'Chỉ số mới') }}: {{ latestRecord.waterNew }}</div>
            <div>{{ $t('dataManager.usage', 'Sử dụng') }}: {{ latestRecord.waterUsage }} m³</div>
            <div>{{ $t('dataManager.rate', 'Đơn giá') }}: {{ formatCurrency(latestRecord.waterRate) }}/m³</div>
            <div class="font-medium">{{ $t('dataManager.amount', 'Thành tiền') }}: {{ formatCurrency(latestRecord.waterTotal) }}</div>
          </div>
        </div>

        <!-- Rent details -->
        <div v-if="latestRecord.monthlyRent && latestRecord.monthlyRent > 0" :class="[
          'p-2 rounded border-l-2',
          themeStore.isDarkMode ? 'bg-gray-800 border-l-orange-400' : 'bg-orange-50 border-l-orange-500'
        ]">
          <div class="font-medium text-orange-600 mb-1">{{ $t('calculator.tabs.rent', 'Tiền Nhà') }}:</div>
          <div class="text-xs space-y-1">
            <div>{{ $t('calculator.rent.perMonth', 'Tiền nhà/tháng') }}: {{ formatCurrency(latestRecord.monthlyRent) }}</div>
            <div>{{ $t('calculator.rent.formula', 'Công thức') }}: {{ formatCurrency(latestRecord.monthlyRent) }} × 3</div>
            <div class="font-medium">{{ $t('dataManager.amount', 'Thành tiền') }}: {{ formatCurrency(latestRecord.quarterlyRent || 0) }}</div>
          </div>
        </div>

        <!-- Total -->
        <div :class="[
          'p-2 rounded border-l-2 font-medium',
          themeStore.isDarkMode ? 'bg-gray-800 border-l-purple-400 text-purple-400' : 'bg-purple-50 border-l-purple-500 text-purple-600'
        ]">
          <div class="text-xs mb-1 opacity-75">
            {{ formatCurrency(latestRecord.electricityTotal) }} + {{ formatCurrency(latestRecord.waterTotal) }}{{ latestRecord.quarterlyRent ? ' + ' + formatCurrency(latestRecord.quarterlyRent) : '' }}
          </div>
          <div>{{ $t('dataManager.grandTotal', 'Tổng cộng') }}: {{ formatCurrency(latestRecord.totalBill) }}</div>
        </div>

        <!-- Load this record button -->
        <button
          @click="loadRecord(latestRecord)"
          :class="[
            'w-full mt-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            themeStore.isDarkMode
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {{ $t('dataManager.loadRecord', 'Tải bản ghi này') }}
        </button>
          </div>
        </div>
      </transition>
    </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useLanguageStore } from '../stores/language'
import { useDataPersistence } from '../composables/useDataPersistence'
import { useFormatterUtils } from '../composables/useFormatterUtils'
import { useToast } from '../composables/useToast'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
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
  monthlyRent: number
  quarterlyRent: number
  totalBill: number
  currentDate: string
}>()

const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const { formatCurrency } = useFormatterUtils()
const { showSuccess, showError, showWarning } = useToast()
const { t, locale } = useI18n()

// Initialize locale and watch for language changes
onMounted(() => {
  locale.value = languageStore.currentLanguage
})

watch(() => languageStore.currentLanguage, (newLang) => {
  locale.value = newLang
}, { immediate: true })

// State for collapsible sections
const isDataManagerExpanded = ref(false)
const isLatestRecordExpanded = ref(false)

const emit = defineEmits(['update-form'])

const {
  records,
  isLoading,
  isSaving,
  addRecord,
  clearAllRecords,
  exportData: exportDataFile,
  importData: importDataFile,
  setUpdateFormCallback,
  totalRecords,
  latestRecord,
  totalElectricitySpent,
  totalWaterSpent,
  totalSpent
} = useDataPersistence()

// Calculate total rent spent from all records
const totalRentSpent = computed(() => {
  return records.value.reduce((total, record) => {
    return total + (record.quarterlyRent || 0)
  }, 0)
})

// Check if current calculation can be saved
const canSave = computed(() => {
  return props.totalBill > 0 && 
         (Number(props.electricityUsage) > 0 || Number(props.waterUsage) > 0 || Number(props.quarterlyRent) > 0)
})

// Save current calculation
const saveCurrentCalculation = async () => {
  if (!canSave.value) {
    showWarning(t('dataManager.noDataToSave', 'Không có dữ liệu để lưu!'))
    return
  }

  const success = await addRecord({
    date: props.currentDate,
    electricityOld: props.electricityOld,
    electricityNew: props.electricityNew,
    electricityRate: props.electricityRate,
    electricityUsage: props.electricityUsage,
    electricityTotal: props.electricityTotal,
    waterOld: props.waterOld,
    waterNew: props.waterNew,
    waterRate: props.waterRate,
    waterUsage: props.waterUsage,
    waterTotal: props.waterTotal,
    monthlyRent: props.monthlyRent,
    quarterlyRent: props.quarterlyRent,
    totalBill: props.totalBill
  })

  if (success) {
    showSuccess(t('dataManager.saveSuccess', 'Đã lưu tiến độ thành công!'))
  }
}

// Export data
const exportData = async () => {
  await exportDataFile()
}

// Import data
const importData = async () => {
  await importDataFile()
}

// Load a specific record into the form
const loadRecord = (record: any) => {
  emit('update-form', record)
  showSuccess(t('dataManager.recordLoaded', 'Đã tải bản ghi vào form!'))
}

// Clear all data with confirmation
const clearAllData = async () => {
  if (confirm(t('dataManager.confirmClear', 'Bạn có chắc chắn muốn xóa tất cả dữ liệu?'))) {
    const success = await clearAllRecords()
    if (success) {
      showSuccess(t('dataManager.clearSuccess', 'Đã xóa tất cả dữ liệu!'))
    }
  }
}

// Set up callback when component mounts
onMounted(() => {
  setUpdateFormCallback((record) => {
    emit('update-form', record)
  })
})
</script>

<style scoped>
/* Animation for buttons */
button {
  transition: all 0.2s ease-in-out;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button:active:not(:disabled) {
  transform: translateY(0);
}

/* Slide fade transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-fade-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-fade-enter-to {
  opacity: 1;
  max-height: 1000px;
  transform: translateY(0);
}

.slide-fade-leave-from {
  opacity: 1;
  max-height: 1000px;
  transform: translateY(0);
}

.slide-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}
</style>
