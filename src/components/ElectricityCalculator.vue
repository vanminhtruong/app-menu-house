<template>
  <div>
    <div 
      @click="toggleAccordion" 
      :class="[
        'flex justify-between items-center cursor-pointer py-3 px-4 rounded-md transition-all duration-300',
        isInBothTab ? (themeStore.isDarkMode ? 'hover:bg-gray-700 border border-gray-700' : 'hover:bg-gray-100 border border-gray-200') : '',
        isInBothTab && isCollapsed ? (themeStore.isDarkMode ? 'mb-3' : 'mb-3') : 'mb-4'
      ]"
    >
      <div class="flex items-center">
        <div class="mr-3 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="themeStore.isDarkMode ? 'text-yellow-300' : 'text-yellow-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 :class="[
          'text-lg font-semibold',
          themeStore.isDarkMode ? 'text-gray-100' : 'text-gray-800'
        ]">{{ $t('calculator.electricity.title') }}</h2>
      </div>
      <div v-if="isInBothTab" class="transform transition-transform duration-300" :class="{ 'rotate-180': !isCollapsed }">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="themeStore.isDarkMode ? 'text-gray-400' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  
    <div 
      v-show="!isCollapsed" 
      :class="[
        'transition-all duration-500 overflow-hidden',
        isInBothTab ? 'accordion-content' : ''
      ]"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="form-group">
          <label :class="[
            'block text-sm font-medium mb-1',
            themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-700'
          ]">{{ $t('calculator.electricity.oldReading') }}</label>
          <div class="relative">
            <input 
              type="number" 
              v-model="electricityOldModel" 
              id="electricity-old"
              :class="[
                'w-full px-3 py-2 rounded-md focus:outline-none transition-colors duration-200',
                themeStore.isDarkMode 
                  ? 'bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 shadow-sm'
              ]"
              :placeholder="$t('calculator.electricity.oldReadingPlaceholder')"
            />
            <label 
              :for="'electricity-old-image-upload'"
              :class="[
                'absolute right-2 top-2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200',
                themeStore.isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600'
              ]"
              :title="$t('calculator.imageUpload.title')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </label>
            <input 
              type="file" 
              id="electricity-old-image-upload" 
              class="hidden" 
              accept="image/*"
              @change="handleImageUpload($event, 'electricity', true)"
            />
          </div>
        </div>
        <div class="form-group">
          <label :class="[
            'block text-sm font-medium mb-1',
            themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-700'
          ]">{{ $t('calculator.electricity.newReading') }}</label>
          <div class="relative">
            <input 
              type="number" 
              v-model="electricityNewModel"
              id="electricity-new" 
              :class="[
                'w-full px-3 py-2 rounded-md focus:outline-none transition-colors duration-200',
                themeStore.isDarkMode 
                  ? 'bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 shadow-sm'
              ]"
              :placeholder="$t('calculator.electricity.newReadingPlaceholder')"
            />
            <label 
              :for="'electricity-new-image-upload'"
              :class="[
                'absolute right-2 top-2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200',
                themeStore.isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                  : 'bg-gray-100 hover:bg-indigo-100 text-gray-500 hover:text-indigo-600'
              ]"
              :title="$t('calculator.imageUpload.title')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </label>
            <input 
              type="file" 
              id="electricity-new-image-upload" 
              class="hidden" 
              accept="image/*"
              @change="handleImageUpload($event, 'electricity', false)"
            />
          </div>
        </div>
      </div>

      <div class="form-group mb-4">
        <label :class="[
          'block text-sm font-medium mb-1',
          themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-700'
        ]">{{ $t('calculator.electricity.rate') }}</label>
        <input 
          type="number" 
          v-model="electricityRateModel" 
          :class="[
            'w-full px-3 py-2 rounded-md focus:outline-none transition-colors duration-200',
            themeStore.isDarkMode 
              ? 'bg-gray-900 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 hover:border-gray-500 shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
              : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-400 shadow-sm'
          ]"
          :placeholder="$t('calculator.electricity.ratePlaceholder')"
        />
      </div>
    </div>

    <div :class="[
      'result-box rounded-lg p-4',
      themeStore.isDarkMode ? 'bg-gray-700 shadow-[0_4px_6px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] border border-gray-600' : 'bg-gray-50 shadow-sm'
    ]">
      <div class="flex justify-between items-center mb-2">
        <span :class="themeStore.isDarkMode ? 'text-sm text-gray-300' : 'text-sm text-gray-600'">{{ $t('calculator.formula') }}</span>
        <span :class="themeStore.isDarkMode ? 'text-sm font-medium text-white' : 'text-sm font-medium'">
          ({{ electricityNewModel || '0' }} - {{ electricityOldModel || '0' }}) × {{ electricityRateModel || defaultElectricityRate }} = {{ formatCurrency(electricityTotal) }}
        </span>
      </div>
      <div class="flex justify-between items-center">
        <span :class="themeStore.isDarkMode ? 'text-sm text-gray-300' : 'text-sm text-gray-600'">{{ $t('calculator.total') }}</span>
        <span :class="themeStore.isDarkMode ? 'text-lg font-bold text-white' : 'text-lg font-bold text-indigo-600'">{{ formatCurrency(electricityTotal) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '../stores/theme'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  electricityOld: number | string
  electricityNew: number | string
  electricityRate: number
  defaultElectricityRate: number
  electricityTotal: number
  formatCurrency: (value: number) => string
  isInBothTab?: boolean
}>()

const emit = defineEmits(['update:electricityOld', 'update:electricityNew', 'update:electricityRate', 'image-upload'])

const themeStore = useThemeStore()
const { t } = useI18n()
const isCollapsed = ref(false)

const toggleAccordion = () => {
  if (props.isInBothTab) {
    isCollapsed.value = !isCollapsed.value
  }
}

// Create local models for two-way binding
const electricityOldModel = computed({
  get: () => props.electricityOld,
  set: (value) => emit('update:electricityOld', value)
})

const electricityNewModel = computed({
  get: () => props.electricityNew,
  set: (value) => emit('update:electricityNew', value)
})

const electricityRateModel = computed({
  get: () => props.electricityRate,
  set: (value) => emit('update:electricityRate', value)
})

// Handle image upload
const handleImageUpload = (event: Event, type: 'electricity' | 'water', isOld: boolean) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  
  const file = input.files[0]
  emit('image-upload', { file, type, isOld })
  
  // Reset input value to allow selecting the same file again
  input.value = ''
}
</script>

<style scoped>
/* Smooth focus and hover states for inputs */
input[type="number"] {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

input[type="number"]:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Result box animations */
.result-box {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.result-box:hover {
  transform: translateY(-2px);
}

/* Stagger animation for form elements */
.form-group {
  animation: slideInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  opacity: 0;
  transform: translateY(20px);
}

.form-group:nth-child(1) { animation-delay: 0.1s; }
.form-group:nth-child(2) { animation-delay: 0.2s; }
.form-group:nth-child(3) { animation-delay: 0.3s; }

@keyframes slideInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accordion animation */
.accordion-content {
  max-height: 1000px;
  opacity: 1;
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  margin-bottom: 1rem;
  transform: translateY(0);
}

.accordion-content.collapsed {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
  transform: translateY(-10px);
}
</style> 