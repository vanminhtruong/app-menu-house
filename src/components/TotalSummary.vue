<template>
  <div :class="[
    'result-box rounded-lg p-4 border mt-8',
    themeStore.isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]' : 'bg-indigo-50 border-indigo-100 shadow-sm'
  ]">
    <h3 :class="[
      'text-lg font-semibold mb-3',
      themeStore.isDarkMode ? 'text-white' : 'text-indigo-800'
    ]">{{ $t('calculator.summary.title') }}</h3>
    
    <!-- Chi tiết từng khoản -->
    <div class="space-y-2 mb-4">
      <!-- Tiền điện -->
      <div v-if="electricityTotal > 0" class="flex justify-between items-center text-sm">
        <span :class="themeStore.isDarkMode ? 'text-gray-300' : 'text-indigo-600'">
          ⚡ {{ $t('calculator.tabs.electricity') }}:
        </span>
        <span :class="[
          'font-medium',
          themeStore.isDarkMode ? 'text-white' : 'text-indigo-700'
        ]">{{ formatCurrency(electricityTotal) }}</span>
      </div>
      
      <!-- Tiền nước -->
      <div v-if="waterTotal > 0" class="flex justify-between items-center text-sm">
        <span :class="themeStore.isDarkMode ? 'text-gray-300' : 'text-indigo-600'">
          💧 {{ $t('calculator.tabs.water') }}:
        </span>
        <span :class="[
          'font-medium',
          themeStore.isDarkMode ? 'text-white' : 'text-indigo-700'
        ]">{{ formatCurrency(waterTotal) }}</span>
      </div>
      
      <!-- Tiền nhà -->
      <div v-if="quarterlyRent > 0" class="flex justify-between items-center text-sm">
        <span :class="themeStore.isDarkMode ? 'text-gray-300' : 'text-indigo-600'">
          🏠 {{ $t('calculator.tabs.rent', 'Tiền Nhà') }} (3 tháng):
        </span>
        <span :class="[
          'font-medium',
          themeStore.isDarkMode ? 'text-white' : 'text-indigo-700'
        ]">{{ formatCurrency(quarterlyRent) }}</span>
      </div>
      
      <!-- Đường kẻ ngăn cách -->
      <div v-if="(electricityTotal > 0) || (waterTotal > 0) || (quarterlyRent > 0)" :class="[
        'border-t pt-2 mt-2',
        themeStore.isDarkMode ? 'border-gray-500' : 'border-indigo-200'
      ]"></div>
    </div>
    
    <!-- Tổng cộng -->
    <div :class="[
      'text-2xl font-bold',
      themeStore.isDarkMode ? 'text-white' : 'text-indigo-700'
    ]">{{ formatCurrency(totalBill) }}</div>
    <p :class="[
      'text-xs mt-1',
      themeStore.isDarkMode ? 'text-gray-400' : 'text-indigo-600'
    ]">{{ $t('calculator.summary.note') }}</p>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useLanguageStore } from '../stores/language'
import { useI18n } from 'vue-i18n'

defineProps<{
  totalBill: number
  electricityTotal: number
  waterTotal: number
  quarterlyRent: number
  formatCurrency: (value: number) => string
}>()

const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const { locale } = useI18n()

// Initialize locale and watch for language changes
onMounted(() => {
  locale.value = languageStore.currentLanguage
})

watch(() => languageStore.currentLanguage, (newLang) => {
  locale.value = newLang
}, { immediate: true })
</script>

<style scoped>
.result-box {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  animation: fadeIn 0.6s ease-out forwards;
}

.result-box:hover {
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style> 