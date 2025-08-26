<template>
  <div :class="[
    'rent-calculator rounded-lg p-6 border transition-all duration-300',
    themeStore.isDarkMode 
      ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]' 
      : 'bg-white border-gray-200 shadow-sm',
    isInBothTab ? 'mt-8 mb-6' : ''
  ]">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h2 :class="[
        'text-xl font-bold flex items-center gap-2',
        themeStore.isDarkMode ? 'text-white' : 'text-gray-800'
      ]">
        <span class="text-2xl">🏠</span>
        {{ $t('calculator.rent.title', 'Tính Tiền Nhà') }}
      </h2>
    </div>

    <!-- Monthly Rent Input -->
    <div class="mb-8">
      <label 
        for="monthly-rent" 
        :class="[
          'block text-sm font-medium mb-2',
          themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-700'
        ]"
      >
        {{ $t('calculator.rent.monthlyRent', 'Tiền nhà 1 tháng') }} (VND)
      </label>
      <input
        id="monthly-rent"
        type="number"
        inputmode="numeric"
        step="1"
        min="0"
        :value="monthlyRent"
        :placeholder="$t('calculator.rent.placeholder', 'Nhập tiền nhà 1 tháng...')"
        :class="[
          'w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 text-lg font-medium',
          themeStore.isDarkMode 
            ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-500' 
            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20'
        ]"
        @keydown="preventInvalidKeyInteger"
        @paste="onPasteInteger"
        @wheel.prevent
        @input="handleRentInput"
      />
    </div>

    <!-- Calculation Details -->
    <div v-if="monthlyRent > 0" :class="[
      'calculation-details p-5 rounded-lg border-2 border-dashed transition-all duration-300 mt-6',
      themeStore.isDarkMode 
        ? 'bg-gray-800/50 border-gray-500' 
        : 'bg-blue-50 border-blue-200'
    ]">
      <h3 :class="[
        'text-md font-semibold mb-3 flex items-center gap-2',
        themeStore.isDarkMode ? 'text-blue-300' : 'text-blue-700'
      ]">
        <span>🧮</span>
        {{ $t('calculator.rent.calculation', 'Chi tiết tính toán') }}
      </h3>
      
      <div class="space-y-2">
        <!-- Monthly Rent -->
        <div class="flex justify-between items-center">
          <span :class="[
            'text-sm',
            themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          ]">
            {{ $t('calculator.rent.perMonth', 'Tiền nhà/tháng') }}:
          </span>
          <span :class="[
            'font-medium',
            themeStore.isDarkMode ? 'text-white' : 'text-gray-800'
          ]">
            {{ formatCurrency(monthlyRent) }}
          </span>
        </div>
        
        <!-- Formula -->
        <div class="flex justify-between items-center">
          <span :class="[
            'text-sm',
            themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'
          ]">
            {{ $t('calculator.rent.formula', 'Công thức') }}:
          </span>
          <span :class="[
            'font-medium text-sm',
            themeStore.isDarkMode ? 'text-blue-300' : 'text-blue-600'
          ]">
            {{ formatCurrency(monthlyRent) }} × 3
          </span>
        </div>
        
        <!-- Quarterly Total -->
        <div :class="[
          'flex justify-between items-center pt-2 border-t',
          themeStore.isDarkMode ? 'border-gray-600' : 'border-blue-200'
        ]">
          <span :class="[
            'font-semibold',
            themeStore.isDarkMode ? 'text-blue-300' : 'text-blue-700'
          ]">
            {{ $t('calculator.rent.quarterlyTotal', 'Tiền nhà 3 tháng') }}:
          </span>
          <span :class="[
            'text-lg font-bold',
            themeStore.isDarkMode ? 'text-green-400' : 'text-green-600'
          ]">
            {{ formatCurrency(quarterlyRent) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else :class="[
      'text-center py-12 mt-6',
      themeStore.isDarkMode ? 'text-gray-400' : 'text-gray-500'
    ]">
      <div class="text-4xl mb-2">🏠</div>
      <p class="text-sm">
        {{ $t('calculator.rent.emptyState', 'Nhập tiền nhà để xem chi tiết tính toán') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useLanguageStore } from '../stores/language'
import { useI18n } from 'vue-i18n'

defineProps<{
  monthlyRent: number
  quarterlyRent: number
  formatCurrency: (value: number) => string
  isInBothTab?: boolean
}>()

const emit = defineEmits<{
  'update:monthly-rent': [value: number]
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

const handleRentInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const cleaned = (target.value || '').replace(/[^\d]/g, '')
  if (target.value !== cleaned) target.value = cleaned
  emit('update:monthly-rent', Number(cleaned || 0))
}

// Prevent invalid characters and sanitize paste
const preventInvalidKeyInteger = (e: KeyboardEvent) => {
  const invalid = ['e', 'E', '+', '-', '.']
  if (invalid.includes(e.key)) e.preventDefault()
}

const onPasteInteger = (e: ClipboardEvent) => {
  const input = e.target as HTMLInputElement
  const text = e.clipboardData?.getData('text') ?? ''
  const cleaned = text.replace(/[^\d]/g, '')
  if (cleaned !== text) {
    e.preventDefault()
    input.setRangeText(cleaned, input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length, 'end')
    input.dispatchEvent(new Event('input', { bubbles: true }))
  }
}
</script>

<style scoped>
.rent-calculator {
  animation: slideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.calculation-details {
  animation: fadeInUp 0.4s ease-out 0.2s forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Input focus animations */
input:focus {
  transform: scale(1.02);
}

/* Hover effects */
.rent-calculator:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.rent-calculator:hover .calculation-details {
  transform: scale(1.02);
}
</style>
