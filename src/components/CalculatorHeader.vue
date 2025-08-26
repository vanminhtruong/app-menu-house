<template>
  <div :class="[
    'px-6 py-4 flex justify-between items-center',
    themeStore.isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-b border-gray-600' : 'bg-indigo-600'
  ]">
    <div>
      <h1 class="text-2xl font-bold text-white">{{ $t('calculator.title') }}</h1>
      <p :class="themeStore.isDarkMode ? 'text-gray-200' : 'text-indigo-100'">{{ $t('calculator.subtitle') }}</p>
    </div>
    <div class="flex items-center space-x-2">
      <!-- Background Toggle Switch -->
      <div class="flex items-center mr-3">
        <div class="flex items-center cursor-pointer" @click="handleBackgroundToggle">
          <div :class="[
            'relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out',
            backgroundStore.isEnabled
              ? 'bg-blue-600 shadow-lg'
              : 'bg-gray-400'
          ]">
            <div :class="[
              'absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-all duration-300 ease-in-out shadow-md',
              backgroundStore.isEnabled ? 'transform translate-x-5' : 'transform translate-x-0'
            ]"></div>
          </div>
          <span :class="[
            'ml-2 text-sm font-medium transition-colors duration-200',
            themeStore.isDarkMode ? 'text-gray-200' : 'text-white'
          ]">
            {{ $t('calculator.background.toggle') }}
          </span>
        </div>
      </div>

      <button
        @click="languageStore.toggleLanguage"
        class="p-2 rounded-full hover:bg-opacity-10 hover:bg-white mr-2"
        :title="languageStore.isVietnamese ? 'Switch to English' : 'Chuyển sang tiếng Việt'"
      >
        <span class="text-white font-medium">{{ languageStore.isVietnamese ? 'EN' : 'VI' }}</span>
      </button>
      <button 
        @click="themeStore.toggleTheme"
        class="p-2 rounded-full hover:bg-opacity-10 hover:bg-white"
        :title="themeStore.isDarkMode ? $t('calculator.theme.lightMode') : $t('calculator.theme.darkMode')"
      >
        <svg v-if="themeStore.isDarkMode" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '../stores/theme'
import { useLanguageStore } from '../stores/language'
import { useBackgroundStore } from '../stores/background'

const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const backgroundStore = useBackgroundStore()
const { locale } = useI18n()

// Initialize locale and watch for language changes
onMounted(() => {
  locale.value = languageStore.currentLanguage
})

watch(() => languageStore.currentLanguage, (newLang) => {
  locale.value = newLang
}, { immediate: true })

// Handle background toggle with debug logging
const handleBackgroundToggle = () => {
  console.log('Background toggle clicked, current state:', backgroundStore.isEnabled)
  backgroundStore.toggleBackground()
  console.log('Background toggle after click:', backgroundStore.isEnabled)
}
</script>