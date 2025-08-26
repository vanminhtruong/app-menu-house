<template>
  <div 
    v-if="isProcessing" 
    class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 transition-opacity duration-300"
  >
    <div :class="[
      'p-6 rounded-xl max-w-sm w-full text-center',
      themeStore.isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-xl'
    ]">
      <div class="mb-4">
        <svg class="animate-spin h-10 w-10 mx-auto" :class="themeStore.isDarkMode ? 'text-blue-400' : 'text-indigo-600'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h3 :class="themeStore.isDarkMode ? 'text-white text-lg font-medium' : 'text-gray-800 text-lg font-medium'">
        {{ $t('calculator.imageUpload.processing') }}
      </h3>
      <div class="mt-4">
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
          <div class="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" :style="{ width: `${progress}%` }"></div>
        </div>
        <p :class="themeStore.isDarkMode ? 'text-gray-400 text-sm mt-2' : 'text-gray-600 text-sm mt-2'">{{ progress }}%</p>
      </div>
      <p class="text-xs mt-4" :class="themeStore.isDarkMode ? 'text-gray-400' : 'text-gray-500'">
        {{ $t('calculator.imageUpload.pleaseWait') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'
import { useI18n } from 'vue-i18n'

defineProps<{
  isProcessing: boolean
  progress: number
}>()

const themeStore = useThemeStore()
const { t } = useI18n()
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 