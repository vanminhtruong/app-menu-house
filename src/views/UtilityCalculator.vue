<template>
  <div
    :class="[
      'h-screen py-8 px-4 max-sm:py-6 max-sm:px-3 max-xs:py-4 max-xs:px-2 transition-colors duration-300 relative overflow-y-auto overflow-x-hidden',
      themeStore.isDarkMode ? 'text-white' : '',
      modalControl.showDetailModal.value ? 'overflow-hidden' : '',
      // Fallback background when AnimatedBackground is disabled
      !backgroundStore.isEnabled
        ? themeStore.isPureDark
          ? 'bg-black'
          : themeStore.isDarkMode
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
        : '',
    ]"
  >
    <!-- Animated Background -->
    <AnimatedBackground
      :is-dark-mode="themeStore.isDarkMode"
      :is-pure-dark="themeStore.isPureDark"
      :is-visible="backgroundStore.isEnabled"
    />
    <div class="max-w-3xl mx-auto relative z-20">
      <LazyLoader :delay="1000" :loading-text="i18n.t('common.loading')">
        <div
          :class="[
            'rounded-2xl max-sm:rounded-xl max-xs:rounded-lg overflow-hidden',
            // Conditional backdrop blur and transparency based on background state
            backgroundStore.isEnabled ? 'backdrop-blur-sm' : '',
            // Different styling when background is enabled vs disabled
            backgroundStore.isEnabled
              ? themeStore.isPureDark
                ? 'bg-black/95 pd-shadow-lg border-none'
                : themeStore.isDarkMode
                ? 'bg-gray-800/90 shadow-[0_0_30px_rgba(0,0,0,0.8),0_0_60px_rgba(0,0,0,0.4)] border border-gray-700/50'
                : 'bg-white/85 shadow-xl border border-white/20'
              : themeStore.isPureDark
              ? 'bg-black pd-shadow-lg border-none'
              : themeStore.isDarkMode
              ? 'bg-gray-800 shadow-2xl border border-gray-700'
              : 'bg-white shadow-xl border border-gray-200',
          ]"
        >
          <!-- Header -->
          <ScrollReveal
            :once="true"
            :delay="200"
            :duration="1000"
            direction="down"
          >
            <AppHeader />
          </ScrollReveal>

          <!-- Calculator Form -->
          <div
            :class="[
              'p-6 max-sm:p-4 max-xs:p-3',
              themeStore.isDarkMode ? 'text-gray-200' : '',
            ]"
          >
            <!-- Tabs -->
            <ScrollReveal
              :once="true"
              :delay="400"
              :duration="1000"
              direction="right"
              :distance="30"
            >
              <CalculatorTabs :active-tab="utilityCalculator.activeTab.value" @change-tab="utilityCalculator.changeTab" />
            </ScrollReveal>

            <!-- Electricity Calculator -->
            <transition name="tab-content" mode="out-in" appear>
              <ScrollReveal
                v-if="utilityCalculator.activeTab.value === 'electricity' || utilityCalculator.activeTab.value === 'both'"
                :once="false"
                :delay="100"
                :duration="800"
                direction="up"
                :threshold="0.6"
                root-margin="0px"
                :hide-delay="120"
              >
                <ElectricityCalculator
                  key="electricity"
                  :electricity-old="utilityCalculator.electricityOld.value"
                  :electricity-new="utilityCalculator.electricityNew.value"
                  :electricity-rate="utilityCalculator.electricityRate.value"
                  :default-electricity-rate="utilityCalculator.defaultElectricityRate"
                  :electricity-total="utilityCalculator.electricityTotal.value"
                  :format-currency="utilityCalculator.formatCurrency"
                  :is-in-both-tab="utilityCalculator.activeTab.value === 'both'"
                  @update:electricity-old="utilityCalculator.electricityOld.value = $event"
                  @update:electricity-new="utilityCalculator.electricityNew.value = $event"
                  @update:electricity-rate="utilityCalculator.electricityRate.value = $event"
                  @image-upload="viewComposable.handleImageUpload"
                />
              </ScrollReveal>
            </transition>

            <!-- Water Calculator -->
            <transition name="tab-content" mode="out-in" appear>
              <ScrollReveal
                v-if="utilityCalculator.activeTab.value === 'water' || utilityCalculator.activeTab.value === 'both'"
                :once="false"
                :delay="100"
                :duration="800"
                direction="up"
                :threshold="0.6"
                root-margin="0px"
                :hide-delay="120"
              >
                <WaterCalculator
                  key="water"
                  :water-old="utilityCalculator.waterOld.value"
                  :water-new="utilityCalculator.waterNew.value"
                  :water-rate="utilityCalculator.waterRate.value"
                  :default-water-rate="utilityCalculator.defaultWaterRate"
                  :water-total="utilityCalculator.waterTotal.value"
                  :format-currency="utilityCalculator.formatCurrency"
                  :is-in-both-tab="utilityCalculator.activeTab.value === 'both'"
                  @update:water-old="utilityCalculator.waterOld.value = $event"
                  @update:water-new="utilityCalculator.waterNew.value = $event"
                  @update:water-rate="utilityCalculator.waterRate.value = $event"
                  @image-upload="viewComposable.handleImageUpload"
                />
              </ScrollReveal>
            </transition>

            <!-- Separator for Both Tab -->
            <div
              v-if="utilityCalculator.activeTab.value === 'both'"
              :class="[
                'separator my-8 max-sm:my-6 max-xs:my-4 flex items-center',
                themeStore.isDarkMode ? 'text-gray-500' : 'text-gray-400',
              ]"
            >
              <div
                :class="[
                  'flex-1 h-px',
                  themeStore.isDarkMode ? 'bg-gray-600' : 'bg-gray-300',
                ]"
              ></div>
              <div class="px-4 max-xs:px-2 text-sm font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 max-xs:h-4 max-xs:w-4 inline mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                Tiền Nhà
              </div>
              <div
                :class="[
                  'flex-1 h-px',
                  themeStore.isDarkMode ? 'bg-gray-600' : 'bg-gray-300',
                ]"
              ></div>
            </div>

            <!-- Rent Calculator -->
            <transition name="tab-content" mode="out-in" appear>
              <ScrollReveal
                v-if="utilityCalculator.activeTab.value === 'rent' || utilityCalculator.activeTab.value === 'both'"
                :once="false"
                :delay="100"
                :duration="800"
                direction="up"
                :threshold="0.6"
                root-margin="0px"
                :hide-delay="120"
              >
                <RentCalculator
                  key="rent"
                  :monthly-rent="utilityCalculator.monthlyRent.value"
                  :quarterly-rent="utilityCalculator.quarterlyRent.value"
                  :format-currency="utilityCalculator.formatCurrency"
                  :is-in-both-tab="utilityCalculator.activeTab.value === 'both'"
                  @update:monthly-rent="utilityCalculator.monthlyRent.value = $event"
                />
              </ScrollReveal>
            </transition>

            <!-- Total Summary -->
            <transition name="tab-content" mode="out-in" appear>
              <div v-if="utilityCalculator.activeTab.value === 'both'" style="overflow: visible">
                <ScrollReveal
                  :once="false"
                  :delay="300"
                  :duration="1000"
                  direction="up"
                >
                  <TotalSummary
                    key="total"
                    :total-bill="utilityCalculator.totalBill.value"
                    :electricity-total="utilityCalculator.electricityTotal.value"
                    :water-total="utilityCalculator.waterTotal.value"
                    :quarterly-rent="utilityCalculator.quarterlyRent.value"
                    :format-currency="utilityCalculator.formatCurrency"
                  />
                </ScrollReveal>

                <!-- Data Manager -->
                <ScrollReveal
                  :once="false"
                  :delay="400"
                  :duration="1000"
                  direction="up"
                >
                  <div class="mt-6">
                    <DataManager
                      :electricity-old="utilityCalculator.electricityOld.value"
                      :electricity-new="utilityCalculator.electricityNew.value"
                      :electricity-rate="utilityCalculator.electricityRate.value"
                      :electricity-usage="utilityCalculator.electricityUsage.value"
                      :electricity-total="utilityCalculator.electricityTotal.value"
                      :water-old="utilityCalculator.waterOld.value"
                      :water-new="utilityCalculator.waterNew.value"
                      :water-rate="utilityCalculator.waterRate.value"
                      :water-usage="utilityCalculator.waterUsage.value"
                      :water-total="utilityCalculator.waterTotal.value"
                      :monthly-rent="utilityCalculator.monthlyRent.value"
                      :quarterly-rent="utilityCalculator.quarterlyRent.value"
                      :total-bill="utilityCalculator.totalBill.value"
                      :current-date="currentDateComposable.currentDate.value"
                      @update-form="viewComposable.handleUpdateForm"
                    />
                  </div>
                </ScrollReveal>
              </div>
            </transition>
          </div>

          <!-- Footer -->
          <ScrollReveal
            :once="true"
            :delay="500"
            :duration="1200"
            direction="up"
            :distance="40"
          >
            <AppFooter
              :current-date="currentDateComposable.currentDate.value"
              :electricity-total="utilityCalculator.electricityTotal.value"
              :water-total="utilityCalculator.waterTotal.value"
              @fill-sample-data="utilityCalculator.fillSampleData"
              @open-detail-modal="viewComposable.handleOpenDetailModal"
              @reset-form="utilityCalculator.resetForm"
            />
          </ScrollReveal>
        </div>
      </LazyLoader>
    </div>

    <!-- Detail Modal -->
    <DetailModal
      v-if="modalControl.showDetailModal.value"
      :show-detail-modal="modalControl.showDetailModal.value"
      :current-date="currentDateComposable.currentDate.value"
      :electricity-old="utilityCalculator.electricityOld.value"
      :electricity-new="utilityCalculator.electricityNew.value"
      :electricity-rate="utilityCalculator.electricityRate.value"
      :electricity-usage="utilityCalculator.electricityUsage.value"
      :electricity-total="utilityCalculator.electricityTotal.value"
      :water-old="utilityCalculator.waterOld.value"
      :water-new="utilityCalculator.waterNew.value"
      :water-rate="utilityCalculator.waterRate.value"
      :water-usage="utilityCalculator.waterUsage.value"
      :water-total="utilityCalculator.waterTotal.value"
      :monthly-rent="utilityCalculator.monthlyRent.value"
      :quarterly-rent="utilityCalculator.quarterlyRent.value"
      :total-bill="utilityCalculator.totalBill.value"
      :format-currency="utilityCalculator.formatCurrency"
      @close-detail-modal="modalControl.closeDetailModal"
    />

    <!-- Processing Overlay -->
    <ProcessingOverlay :is-processing="utilityCalculator.isProcessing.value" :progress="utilityCalculator.progress.value" />
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from "../stores/theme";
import { useLanguageStore } from "../stores/language";
import { useBackgroundStore } from "../stores/background";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

import { useUtilityCalculator } from "../composables/useUtilityCalculator";
import { useModalControl } from "../composables/useModalControl";
import { useCurrentDate } from "../composables/useCurrentDate";
import { useToast } from "../composables/useToast";
import { useUtilityCalculatorView } from "../composables/useUtilityCalculatorView";

// @ts-ignore
import AppHeader from "../components/AppHeader.vue";
// @ts-ignore
import CalculatorTabs from "../components/CalculatorTabs.vue";
// @ts-ignore
import ElectricityCalculator from "../components/ElectricityCalculator.vue";
// @ts-ignore
import WaterCalculator from "../components/WaterCalculator.vue";
// @ts-ignore
import TotalSummary from "../components/TotalSummary.vue";
// @ts-ignore
import AppFooter from "../components/AppFooter.vue";
// @ts-ignore
import DetailModal from "../components/DetailModal.vue";
// @ts-ignore
import ProcessingOverlay from "../components/ProcessingOverlay.vue";
// @ts-ignore
import LazyLoader from "../components/LazyLoader.vue";
// @ts-ignore
import ScrollReveal from "../components/ScrollReveal.vue";
// @ts-ignore
import DataManager from "../components/DataManager.vue";
// @ts-ignore
import AnimatedBackground from "../components/AnimatedBackground.vue";
// @ts-ignore
import RentCalculator from "../components/RentCalculator.vue";

// Get stores
const themeStore = useThemeStore();
const languageStore = useLanguageStore();
const backgroundStore = useBackgroundStore();
const i18n = useI18n();
const toast = useToast();

// Get composables
const utilityCalculator = useUtilityCalculator();
const currentDateComposable = useCurrentDate();
const modalControl = useModalControl();
const viewComposable = useUtilityCalculatorView(
  utilityCalculator,
  currentDateComposable,
  modalControl
);

</script>

<style>
@import "./css/UtilityCalculator.css";
</style>