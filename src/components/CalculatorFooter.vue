<template>
  <div 
    :class="[
      'calculator-footer flex flex-col sm:flex-row items-center justify-between p-4 space-y-4 sm:space-y-0 mt-6 rounded-lg',
      themeStore.isDarkMode 
        ? 'bg-gray-700 border border-gray-600 shadow-[0_4px_6px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]' 
        : 'bg-gray-50 shadow-sm border border-gray-200'
    ]"
  >
    <div class="flex flex-col space-y-2">
      <button 
        @click="$emit('fill-sample-data')" 
        :class="[
          'px-3 py-1.5 text-xs font-medium rounded flex items-center space-x-1 transition-colors duration-200',
          themeStore.isDarkMode 
            ? 'bg-gray-600 text-gray-200 hover:bg-gray-500 border border-gray-500' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        <span>{{ t('calculator.footer.sampleData') }}</span>
      </button>
      <div :class="themeStore.isDarkMode ? 'text-gray-400' : 'text-gray-500'" class="text-xs">{{ t('calculator.footer.updatedOn') }}: {{ currentDate }}</div>
    </div>
    
    <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
      <button
        @click="$emit('open-detail-modal')"
        :class="[
          'px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 w-full',
          canShowDetails 
            ? (themeStore.isDarkMode
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 focus:ring-blue-400 shadow-[0_0_15px_rgba(66,153,225,0.5)] animate-pulse-subtle border border-blue-400'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-400 hover:to-indigo-500 focus:ring-blue-400 shadow-md animate-pulse-subtle')
            : (themeStore.isDarkMode
                ? 'bg-gray-600 text-white hover:bg-gray-500 focus:ring-gray-400 shadow-[0_2px_4px_rgba(0,0,0,0.3)] border border-gray-500'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus:ring-blue-300')
        ]"
      >
        <span class="flex items-center justify-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          {{ t('calculator.footer.viewDetail') }}
        </span>
      </button>
      <button 
        @click="$emit('reset-form')" 
        :class="[
          'px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 w-full',
          themeStore.isDarkMode 
            ? 'bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400 focus:ring-gray-400 shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-gray-500'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
        ]"
      >
        {{ t('calculator.footer.reset') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  currentDate: string
  electricityTotal?: number
  waterTotal?: number
}>()

defineEmits(['fill-sample-data', 'open-detail-modal', 'reset-form'])

const themeStore = useThemeStore()
const { t } = useI18n()

// Computed property to check if details can be shown with special effects
const canShowDetails = computed(() => {
  const hasElectricityData = props.electricityTotal && props.electricityTotal > 0
  const hasWaterData = props.waterTotal && props.waterTotal > 0
  return hasElectricityData || hasWaterData
})
</script>

<style scoped>
/* Button hover animations */
button {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0);
}

/* Subtle pulse animation for the view details button */
@keyframes pulse-subtle {
  0% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.5);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite;
}
</style> 