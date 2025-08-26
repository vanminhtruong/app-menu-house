<template>
  <div :class="[
    'min-h-screen py-8 px-4 transition-colors duration-300 relative overflow-hidden',
    themeStore.isDarkMode ? 'text-white' : '',
    showDetailModal ? 'overflow-hidden' : '',
    // Fallback background when AnimatedBackground is disabled
    !backgroundStore.isEnabled ? (
      themeStore.isDarkMode
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    ) : ''
  ]">
    <!-- Animated Background -->
    <AnimatedBackground
      :is-dark-mode="themeStore.isDarkMode"
      :is-visible="backgroundStore.isEnabled"
    />
    <div class="max-w-3xl mx-auto relative z-20">
      <LazyLoader :delay="1000" :loading-text="$t('common.loading')">
        <div :class="[
          'rounded-2xl overflow-hidden',
          // Conditional backdrop blur and transparency based on background state
          backgroundStore.isEnabled ? 'backdrop-blur-sm' : '',
          // Different styling when background is enabled vs disabled
          backgroundStore.isEnabled ? (
            themeStore.isDarkMode
              ? 'bg-gray-800/90 shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_60px_rgba(0,0,0,0.4)] border border-gray-700/50'
              : 'bg-white/85 shadow-xl border border-white/20'
          ) : (
            themeStore.isDarkMode
              ? 'bg-gray-800 shadow-2xl border border-gray-700'
              : 'bg-white shadow-xl border border-gray-200'
          )
        ]">
          <!-- Header -->
          <ScrollReveal :once="true" :delay="200" :duration="1000" direction="down">
            <CalculatorHeader />
          </ScrollReveal>

          <!-- Calculator Form -->
          <div :class="['p-6', themeStore.isDarkMode ? 'text-gray-200' : '']">
            <!-- Tabs -->
            <ScrollReveal :once="true" :delay="400" :duration="1000" direction="right" :distance="30">
              <CalculatorTabs 
                :active-tab="activeTab" 
                @change-tab="changeTab" 
              />
            </ScrollReveal>

            <!-- Electricity Calculator -->
            <transition
              name="tab-content"
              mode="out-in"
              appear
            >
              <ScrollReveal v-if="activeTab === 'electricity' || activeTab === 'both'" :once="false" :delay="100" :duration="800" direction="up" :threshold="0.6" root-margin="-100px 0px -100px 0px">
                <ElectricityCalculator
                  key="electricity" 
                  :electricity-old="electricityOld"
                  :electricity-new="electricityNew"
                  :electricity-rate="electricityRate"
                  :default-electricity-rate="defaultElectricityRate"
                  :electricity-total="electricityTotal"
                  :format-currency="formatCurrency"
                  :is-in-both-tab="activeTab === 'both'"
                  @update:electricity-old="electricityOld = $event"
                  @update:electricity-new="electricityNew = $event"
                  @update:electricity-rate="electricityRate = $event"
                  @image-upload="handleImageUpload"
                />
              </ScrollReveal>
            </transition>

            <!-- Water Calculator -->
            <transition
              name="tab-content"
              mode="out-in"
              appear
            >
              <ScrollReveal v-if="activeTab === 'water' || activeTab === 'both'" :once="false" :delay="100" :duration="800" direction="up" :threshold="0.6" root-margin="-100px 0px -100px 0px">
                <WaterCalculator
                  key="water"
                  :water-old="waterOld"
                  :water-new="waterNew"
                  :water-rate="waterRate"
                  :default-water-rate="defaultWaterRate"
                  :water-total="waterTotal"
                  :format-currency="formatCurrency"
                  :is-in-both-tab="activeTab === 'both'"
                  @update:water-old="waterOld = $event"
                  @update:water-new="waterNew = $event"
                  @update:water-rate="waterRate = $event"
                  @image-upload="handleImageUpload"
                />
              </ScrollReveal>
            </transition>

            <!-- Separator for Both Tab -->
            <div v-if="activeTab === 'both'" :class="[
              'separator my-8 flex items-center',
              themeStore.isDarkMode ? 'text-gray-500' : 'text-gray-400'
            ]">
              <div :class="[
                'flex-1 h-px',
                themeStore.isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              ]"></div>
              <div class="px-4 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Tiền Nhà
              </div>
              <div :class="[
                'flex-1 h-px',
                themeStore.isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
              ]"></div>
            </div>

            <!-- Rent Calculator -->
            <transition
              name="tab-content"
              mode="out-in"
              appear
            >
              <ScrollReveal v-if="activeTab === 'rent' || activeTab === 'both'" :once="false" :delay="100" :duration="800" direction="up" :threshold="0.6" root-margin="-100px 0px -100px 0px">
                <RentCalculator
                  key="rent"
                  :monthly-rent="monthlyRent"
                  :quarterly-rent="quarterlyRent"
                  :format-currency="formatCurrency"
                  :is-in-both-tab="activeTab === 'both'"
                  @update:monthly-rent="monthlyRent = $event"
                />
              </ScrollReveal>
            </transition>

            <!-- Total Summary -->
            <transition
              name="tab-content"
              mode="out-in"
              appear
            >
              <div v-if="activeTab === 'both'" style="overflow: visible;">
                <ScrollReveal :once="false" :delay="300" :duration="1000" direction="up">
                  <TotalSummary
                    key="total"
                    :total-bill="totalBill"
                    :electricity-total="electricityTotal"
                    :water-total="waterTotal"
                    :quarterly-rent="quarterlyRent"
                    :format-currency="formatCurrency"
                  />
                </ScrollReveal>

                <!-- Data Manager -->
                <ScrollReveal :once="false" :delay="400" :duration="1000" direction="up">
                  <div class="mt-6">
                    <DataManager
                      :electricity-old="electricityOld"
                      :electricity-new="electricityNew"
                      :electricity-rate="electricityRate"
                      :electricity-usage="electricityUsage"
                      :electricity-total="electricityTotal"
                      :water-old="waterOld"
                      :water-new="waterNew"
                      :water-rate="waterRate"
                      :water-usage="waterUsage"
                      :water-total="waterTotal"
                      :monthly-rent="monthlyRent"
                      :quarterly-rent="quarterlyRent"
                      :total-bill="totalBill"
                      :current-date="currentDate"
                      @update-form="handleUpdateForm"
                    />
                  </div>
                </ScrollReveal>
              </div>
            </transition>
          </div>

          <!-- Footer -->
          <ScrollReveal :once="true" :delay="500" :duration="1200" direction="up" :distance="40">
            <CalculatorFooter 
              :current-date="currentDate"
              :electricity-total="electricityTotal"
              :water-total="waterTotal"
              @fill-sample-data="fillSampleData"
              @open-detail-modal="handleOpenDetailModal"
              @reset-form="resetForm"
            />
          </ScrollReveal>
        </div>
      </LazyLoader>
    </div>

    <!-- Detail Modal -->
    <DetailModal 
      v-if="showDetailModal"
      :show-detail-modal="showDetailModal"
      :current-date="currentDate"
      :electricity-old="electricityOld"
      :electricity-new="electricityNew"
      :electricity-rate="electricityRate"
      :electricity-usage="electricityUsage"
      :electricity-total="electricityTotal"
      :water-old="waterOld"
      :water-new="waterNew"
      :water-rate="waterRate"
      :water-usage="waterUsage"
      :water-total="waterTotal"
      :monthly-rent="monthlyRent"
      :quarterly-rent="quarterlyRent"
      :total-bill="totalBill"
      :format-currency="formatCurrency"
      @close-detail-modal="closeDetailModal"
    />

    <!-- Processing Overlay -->
    <ProcessingOverlay 
      :is-processing="isProcessing"
      :progress="progress"
    />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'
import { useBackgroundStore } from '../stores/background'
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import { useUtilityCalculator } from '../composables/useUtilityCalculator'
import { useModalControl } from '../composables/useModalControl'
import { useCurrentDate } from '../composables/useCurrentDate'
import { useToast } from '../composables/useToast'

// @ts-ignore
import CalculatorHeader from '../components/CalculatorHeader.vue'
// @ts-ignore
import CalculatorTabs from '../components/CalculatorTabs.vue'
// @ts-ignore
import ElectricityCalculator from '../components/ElectricityCalculator.vue'
// @ts-ignore
import WaterCalculator from '../components/WaterCalculator.vue'
// @ts-ignore
import TotalSummary from '../components/TotalSummary.vue'
// @ts-ignore
import CalculatorFooter from '../components/CalculatorFooter.vue'
// @ts-ignore
import DetailModal from '../components/DetailModal.vue'
// @ts-ignore
import ProcessingOverlay from '../components/ProcessingOverlay.vue'
// @ts-ignore
import LazyLoader from '../components/LazyLoader.vue'
// @ts-ignore
import ScrollReveal from '../components/ScrollReveal.vue'
// @ts-ignore
import DataManager from '../components/DataManager.vue'
// @ts-ignore
import AnimatedBackground from '../components/AnimatedBackground.vue'
// @ts-ignore
import RentCalculator from '../components/RentCalculator.vue'

// Get stores
const themeStore = useThemeStore()
const backgroundStore = useBackgroundStore()
const { t } = useI18n()
const { toastError, toastWarning } = useToast()

// Get composables
const {
  activeTab,
  electricityOld,
  electricityNew,
  electricityRate,
  waterOld,
  waterNew,
  waterRate,
  monthlyRent,
  quarterlyRent,
  defaultElectricityRate,
  defaultWaterRate,
  electricityUsage,
  electricityTotal,
  waterUsage,
  waterTotal,
  totalBill,
  validateElectricityReadings,
  validateWaterReadings,
  formatCurrency,
  resetForm,
  fillSampleData,
  changeTab,
  isProcessing,
  progress,
  processImageAndSetValue,
  viewDetails
} = useUtilityCalculator()

const { currentDate, setCurrentDate } = useCurrentDate()

const { showDetailModal, openDetailModal, closeDetailModal } = useModalControl()

// No need for manual locale synchronization - i18n handles it automatically

// Simple validation for modal opening
const validateBeforeOpenModal = () => {
  const hasElectricityData = electricityOld.value && electricityNew.value
  const hasWaterData = waterOld.value && waterNew.value
  const hasRentData = monthlyRent.value && monthlyRent.value > 0

  // Check if any data exists
  if (!hasElectricityData && !hasWaterData && !hasRentData) {
    toastWarning.noData()
    console.warn('⚠️ Vui lòng nhập ít nhất một loại tiện ích để xem chi tiết!')
    return false
  }

  // Simple validation for electricity
  if (hasElectricityData) {
    const oldElec = Number(electricityOld.value) || 0
    const newElec = Number(electricityNew.value) || 0
    if (newElec < oldElec) {
      toastError.validation()
      console.error('⚡ Số điện mới không thể nhỏ hơn số điện cũ!')
      return false
    }
  }

  // Simple validation for water
  if (hasWaterData) {
    const oldWater = Number(waterOld.value) || 0
    const newWater = Number(waterNew.value) || 0
    if (newWater < oldWater) {
      toastError.validation()
      console.error('💧 Số nước mới không thể nhỏ hơn số nước cũ!')
      return false
    }
  }

  return true
}

// Flag to prevent multiple rapid calls
const isProcessingModalOpen = ref(false)

// Custom modal opener with validation
const handleOpenDetailModal = () => {
  // Prevent multiple rapid calls
  if (isProcessingModalOpen.value) {
    return
  }

  isProcessingModalOpen.value = true

  if (validateBeforeOpenModal()) {
    viewDetails() // Trigger fireworks
    openDetailModal()
  }

  // Reset flag after a short delay
  setTimeout(() => {
    isProcessingModalOpen.value = false
  }, 500)
}

// Handle image upload and OCR
const handleImageUpload = async (data: { file: File, type: 'electricity' | 'water', isOld: boolean }) => {
  const { file, type, isOld } = data

  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    toastError.validation()
    console.error('❌ Vui lòng chọn file ảnh!')
    return
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toastError.validation()
    console.error('❌ Kích thước ảnh quá lớn (tối đa 5MB)!')
    return
  }

  await processImageAndSetValue(file, type, isOld)
}

// Handle form update from imported data
const handleUpdateForm = (record: any) => {
  // Update electricity data
  electricityOld.value = record.electricityOld
  electricityNew.value = record.electricityNew
  electricityRate.value = record.electricityRate

  // Update water data
  waterOld.value = record.waterOld
  waterNew.value = record.waterNew
  waterRate.value = record.waterRate

  // Update rent data (if available)
  if (record.monthlyRent !== undefined) {
    monthlyRent.value = record.monthlyRent || 0
  }

  // Update date
  setCurrentDate(record.date)

  // Trigger recalculation
  nextTick(() => {
    // The computed properties will automatically recalculate
    console.log('Form updated with imported data (including rent):', record)
  })
}

// Cleanup on component unmount
onUnmounted(() => {
  isProcessingModalOpen.value = false
})
</script>

<style scoped>
/* Tab content transition animations */
.tab-content-enter-active,
.tab-content-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.tab-content-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  filter: blur(2px);
}

.tab-content-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(1.02);
  filter: blur(1px);
}

.tab-content-enter-to,
.tab-content-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

/* Smooth color transitions for theme switching */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
</style>