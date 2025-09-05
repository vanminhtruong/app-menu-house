<template>
  <CalculatorFooter
    :current-date="currentDate"
    :electricity-total="electricityTotal"
    :water-total="waterTotal"
    @fill-sample-data="$emit('fill-sample-data')"
    @open-detail-modal="$emit('open-detail-modal')"
    @reset-form="$emit('reset-form')"
  />
</template>

<script setup lang="ts">
// Wrapper component to separate footer layout without changing original
// @ts-ignore
import CalculatorFooter from './CalculatorFooter.vue'

const props = defineProps<{
  currentDate: string
  electricityTotal?: number
  waterTotal?: number
}>()

defineEmits(['fill-sample-data', 'open-detail-modal', 'reset-form'])
</script>
