<template>
  <Transition name="fade">
    <button 
      v-if="backToTopStore.isVisible" 
      :class="backToTopStore.buttonClasses"
      @click="backToTopStore.scrollToTop"
      :title="t('common.backToTop')"
      aria-label="Back to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useBackToTopStore } from '../stores/backToTop'
import { useI18n } from 'vue-i18n'

const backToTopStore = useBackToTopStore()
const { t } = useI18n()

onMounted(() => {
  backToTopStore.setupScrollListener()
})

onUnmounted(() => {
  backToTopStore.removeScrollListener()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

button:hover {
  transform: translateY(-3px);
}

button:active {
  transform: translateY(0);
}
</style> 