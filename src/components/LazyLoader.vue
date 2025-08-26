<template>
  <div 
    :class="[
      'lazy-loader-container',
      themeStore.isDarkMode ? 'dark-theme' : 'light-theme',
      loaded ? 'loaded' : ''
    ]"
  >
    <div v-if="!loaded" class="loader-wrapper">
      <div class="spinner"></div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>
    <div 
      :class="['content-wrapper', loaded ? 'visible' : 'hidden']"
      v-show="loaded"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, withDefaults } from 'vue';
import { useThemeStore } from '../stores/theme';

interface LazyLoaderProps {
  delay?: number;
  loadingText?: string;
}

const props = withDefaults(defineProps<LazyLoaderProps>(), {
  delay: 800,
  loadingText: 'Đang tải...'
});

const themeStore = useThemeStore();
const loaded = ref(false);

onMounted(() => {
  // Simulate loading delay
  setTimeout(() => {
    loaded.value = true;
  }, props.delay);
});
</script>

<style scoped>
.lazy-loader-container {
  position: relative;
  width: 100%;
  min-height: 100px;
  transition: all 0.3s ease;
}

.loader-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  animation: spin 1s linear infinite;
}

.dark-theme .spinner {
  border-top-color: #4f46e5;
  border-left-color: rgba(79, 70, 229, 0.5);
  box-shadow: 0 0 15px rgba(79, 70, 229, 0.3);
}

.light-theme .spinner {
  border-top-color: #4f46e5;
  border-left-color: rgba(79, 70, 229, 0.5);
  box-shadow: 0 0 15px rgba(79, 70, 229, 0.1);
}

.loading-text {
  margin-top: 12px;
  font-size: 0.875rem;
}

.dark-theme .loading-text {
  color: #e2e8f0;
}

.light-theme .loading-text {
  color: #334155;
}

.content-wrapper {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.content-wrapper.visible {
  opacity: 1;
  transform: translateY(0);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Transition for theme switching */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
</style> 