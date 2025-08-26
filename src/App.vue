<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, defineAsyncComponent } from 'vue'
import { useThemeStore } from './stores/theme'
import { useUtilityCalculator } from './composables/useUtilityCalculator'
import { useToastTheme } from './composables/useToastTheme'

// Import the component asynchronously
const BackToTop = defineAsyncComponent(() => import('./components/BackToTop.vue'))
const Fireworks = defineAsyncComponent(() => import('./components/Fireworks.vue'))

const themeStore = useThemeStore()
const { showFireworks } = useUtilityCalculator()
const { forceUpdateTheme } = useToastTheme()

onMounted(() => {
  // Đảm bảo dark mode được áp dụng khi component được mount
  themeStore.updateThemeClass()

  // Khởi tạo toast theme
  setTimeout(() => {
    forceUpdateTheme()
  }, 200)
})
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
