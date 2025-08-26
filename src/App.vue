<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, defineAsyncComponent, watch } from 'vue'
import { useThemeStore } from './stores/theme'
import { useLanguageStore } from './stores/language'
import { useUtilityCalculator } from './composables/useUtilityCalculator'
import { useToastTheme } from './composables/useToastTheme'
import { useI18n } from 'vue-i18n'

// Import the component asynchronously
const BackToTop = defineAsyncComponent(() => import('./components/BackToTop.vue'))
const Fireworks = defineAsyncComponent(() => import('./components/Fireworks.vue'))

const themeStore = useThemeStore()
const languageStore = useLanguageStore()
const { showFireworks } = useUtilityCalculator()
const { forceUpdateTheme } = useToastTheme()
const { locale } = useI18n()

onMounted(() => {
  // Đảm bảo dark mode được áp dụng khi component được mount
  themeStore.updateThemeClass()

  // Khởi tạo i18n locale từ language store
  locale.value = languageStore.currentLanguage
  console.log('App mounted - Current locale:', locale.value, 'Language store:', languageStore.currentLanguage)

  // Khởi tạo toast theme
  setTimeout(() => {
    forceUpdateTheme()
  }, 200)
})

// Watch for language changes và đồng bộ với i18n
watch(() => languageStore.currentLanguage, (newLang) => {
  console.log('Language changed to:', newLang)
  locale.value = newLang
}, { immediate: true })
</script>

<template>
  <div>
    <RouterView />
    <BackToTop />
    <Fireworks :show="showFireworks" :duration="5000" />
  </div>
</template>

<style>
/* Global styles */
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
