<template>
  <div class="flex border-b mb-6" :class="themeStore.isDarkMode ? 'border-gray-800' : 'border-gray-200'">
    <button 
      @click="changeTab('electricity')"
      :class="[
        'tab-button px-4 py-2 font-medium text-sm transition-all duration-300',
        activeTab === 'electricity' 
          ? (themeStore.isDarkMode ? 'text-white border-b-2 border-white shadow-[0_4px_6px_-6px_rgba(255,255,255,0.3)] active-tab-indicator' : 'text-indigo-600 border-b-2 border-indigo-600') 
          : (themeStore.isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
      ]">
      {{ t('calculator.tabs.electricity') }}
    </button>
    <button 
      @click="changeTab('water')"
      :class="[
        'tab-button px-4 py-2 font-medium text-sm transition-all duration-300',
        activeTab === 'water' 
          ? (themeStore.isDarkMode ? 'text-white border-b-2 border-white shadow-[0_4px_6px_-6px_rgba(255,255,255,0.3)] active-tab-indicator' : 'text-indigo-600 border-b-2 border-indigo-600') 
          : (themeStore.isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
      ]">
      {{ t('calculator.tabs.water') }}
    </button>
    <button 
      @click="changeTab('rent')"
      :class="[
        'tab-button px-4 py-2 font-medium text-sm transition-all duration-300',
        activeTab === 'rent' 
          ? (themeStore.isDarkMode ? 'text-white border-b-2 border-white shadow-[0_4px_6px_-6px_rgba(255,255,255,0.3)] active-tab-indicator' : 'text-indigo-600 border-b-2 border-indigo-600') 
          : (themeStore.isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
      ]">
      {{ t('calculator.tabs.rent', 'Tiền Nhà') }}
    </button>
    <button 
      @click="changeTab('both')"
      :class="[
        'tab-button px-4 py-2 font-medium text-sm transition-all duration-300',
        activeTab === 'both' 
          ? (themeStore.isDarkMode ? 'text-white border-b-2 border-white shadow-[0_4px_6px_-6px_rgba(255,255,255,0.3)] active-tab-indicator' : 'text-indigo-600 border-b-2 border-indigo-600') 
          : (themeStore.isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
      ]">
      {{ t('calculator.tabs.all', 'Tất Cả') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'
import { useI18n } from 'vue-i18n'

defineProps<{
  activeTab: string
}>()

const emit = defineEmits(['change-tab'])
const themeStore = useThemeStore()
const { t } = useI18n()

const changeTab = (tab: string) => {
  emit('change-tab', tab)
}
</script>

<style scoped>
/* Tab button transitions */
.tab-button {
  position: relative;
  overflow: hidden;
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease-in-out;
}

.tab-button:hover::before {
  left: 100%;
}

/* Pulse animation for active tab indicator */
.active-tab-indicator {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(255, 255, 255, 0);
  }
}
</style> 