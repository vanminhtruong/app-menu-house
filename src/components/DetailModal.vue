<template>
  <div
    v-if="showDetailModal"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black bg-opacity-50 p-4 transition-opacity duration-300 animate-fade-in"
    :style="themeStore.isPureDark ? { backdropFilter: 'blur(20px)' } : undefined"
    @click.self="closeDetailModal"
  >
    <div
      :class="[
        'relative flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-lg transform transition-all duration-300 animate-scale-in',
        themeStore.isPureDark
          ? 'bg-black border-none pd-shadow-lg text-white'
          : themeStore.isDarkMode
          ? 'bg-gray-800 border border-gray-700 text-white shadow-[0_25px_50px_rgba(0,0,0,0.5)]'
          : 'bg-white text-gray-800 shadow-2xl',
      ]"
      :style="{ maxHeight: 'calc(100vh - 2rem)' }"
    >
        <div
          class="z-10 flex flex-none justify-between items-center p-4 border-b"
          :class="
            themeStore.isPureDark
              ? 'bg-neutral-900 border-none pd-shadow'
              : themeStore.isDarkMode
              ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600'
              : 'bg-white border-gray-200'
          "
        >
          <h3 class="text-lg font-medium">
            {{ $t("calculator.detailModal.title") }}
          </h3>
          <button
            @click="closeDetailModal"
            :class="[
              'p-2 rounded-full transition-all duration-200 focus:outline-none',
              themeStore.isPureDark
                ? 'hover:bg-neutral-800 hover:text-white active:bg-neutral-700 hover:shadow-md'
                : themeStore.isDarkMode
                ? 'hover:bg-gray-600 hover:text-white active:bg-gray-500 hover:shadow-md'
                : 'hover:bg-red-100 text-gray-700 hover:text-red-600 active:bg-red-200',
            ]"
            :title="$t('calculator.detailModal.closeButton')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div
          class="pd-scroll min-h-0 flex-1 overflow-y-auto p-6 pt-4 space-y-6 text-left"
        >
          <!-- Ngày tháng -->
          <div class="text-center text-lg font-medium" dir="ltr">
            {{ currentDate }}
          </div>

          <!-- Phần điện -->
          <div>
            <div class="font-medium text-lg mb-2">
              + {{ $t("calculator.tabs.electricity") }}:
            </div>
            <div
              :class="[
                'rounded-lg p-4',
                themeStore.isPureDark
                  ? 'bg-black border-none pd-shadow'
                  : themeStore.isDarkMode
                  ? 'bg-gray-900 border border-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                  : 'bg-gray-50',
              ]"
            >
              <div class="flex items-start mb-2">
                <span class="w-20"
                  >{{ $t("calculator.detailModal.reading") }}:</span
                >
                <span class="font-medium">
                  {{ $t("calculator.detailModal.new") }}:
                  {{ electricityNew || "0" }} -
                  {{ $t("calculator.detailModal.old") }}:
                  {{ electricityOld || "0" }} = {{ electricityUsage }} kWh
                </span>
              </div>
              <div class="flex items-start mb-2">
                <span class="w-20"
                  >{{ $t("calculator.detailModal.amount") }}:</span
                >
                <span class="font-medium"
                  >{{ electricityRate }} × {{ electricityUsage }} =
                  {{ formatCurrency(electricityTotal) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Phần nước -->
          <div>
            <div class="font-medium text-lg mb-2">
              + {{ $t("calculator.tabs.water") }}:
            </div>
            <div
              :class="[
                'rounded-lg p-4',
                themeStore.isPureDark
                  ? 'bg-black border-none pd-shadow'
                  : themeStore.isDarkMode
                  ? 'bg-gray-900 border border-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                  : 'bg-gray-50',
              ]"
            >
              <div class="flex items-start mb-2">
                <span class="w-20"
                  >{{ $t("calculator.detailModal.reading") }}:</span
                >
                <span class="font-medium">
                  {{ $t("calculator.detailModal.new") }}:
                  {{ waterNew || "0" }} -
                  {{ $t("calculator.detailModal.old") }}:
                  {{ waterOld || "0" }} = {{ waterUsage }} m³
                </span>
              </div>
              <div class="flex items-start mb-2">
                <span class="w-20"
                  >{{ $t("calculator.detailModal.amount") }}:</span
                >
                <span class="font-medium"
                  >{{ waterRate }} × {{ waterUsage }} =
                  {{ formatCurrency(waterTotal) }}</span
                >
              </div>
            </div>
          </div>

          <!-- Phần tiền nhà: chỉ hiện khi công tắc "cộng tiền nhà" đang BẬT -->
          <div v-if="quarterlyRent && quarterlyRent > 0">
            <div class="font-medium text-lg">
              + {{ $t("calculator.tabs.rent", "Tiền Nhà") }}:
              <span class="font-bold">{{ formatCurrency(quarterlyRent || 0) }}</span>
            </div>
          </div>

          <!-- Tổng điện nước nhà -->
          <div>
            <div class="font-medium text-lg mb-2">
              <span v-if="quarterlyRent && quarterlyRent > 0">
                {{ $t("calculator.detailModal.utilityAndRentTotal") }}:
              </span>
              <span v-else>
                {{ $t("calculator.detailModal.utilityTotal") }}:
              </span>
            </div>
            <div
              :class="[
                'rounded-lg p-4',
                themeStore.isPureDark
                  ? 'bg-black border-none pd-shadow'
                  : themeStore.isDarkMode
                  ? 'bg-gray-900 border border-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
                  : 'bg-gray-50',
              ]"
            >
              <div class="font-medium" v-if="quarterlyRent && quarterlyRent > 0">
                {{ formatCurrency(electricityTotal) }} +
                {{ formatCurrency(waterTotal) }} +
                {{ formatCurrency(quarterlyRent || 0) }} =
                {{ formatCurrency(totalBill) }}
              </div>
              <div class="font-medium" v-else>
                {{ formatCurrency(electricityTotal) }} +
                {{ formatCurrency(waterTotal) }} =
                {{ formatCurrency(totalBill) }}
              </div>
            </div>
          </div>

          <!-- Phần tổng cộng -->
          <div>
            <div class="font-medium text-lg mb-2">
              {{ $t("calculator.detailModal.grandTotal") }}:
            </div>
            <div
              :class="[
                'rounded-lg p-4 border-2 text-center',
                themeStore.isPureDark
                  ? 'bg-black border-none pd-shadow-lg'
                  : themeStore.isDarkMode
                  ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]'
                  : 'bg-blue-50 border-blue-200',
              ]"
            >
              <div class="text-xl font-bold">
                {{ formatCurrency(totalBill) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Thanh chỉ dẫn cách đóng modal -->
        <div
          :class="[
            'flex-none py-2 text-center text-xs',
            themeStore.isPureDark
              ? 'bg-black text-gray-500 border-t border-gray-800'
              : themeStore.isDarkMode
              ? 'bg-gray-700 text-gray-400 border-t border-gray-600'
              : 'bg-gray-50 text-gray-500 border-t border-gray-200',
          ]"
        >
          <span class="flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ $t("calculator.detailModal.closeButton") }}
          </span>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useThemeStore } from "../stores/theme";
import { useLanguageStore } from "../stores/language";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  showDetailModal: boolean;
  currentDate: string;
  electricityOld: number | string;
  electricityNew: number | string;
  electricityRate: number;
  electricityUsage: number;
  electricityTotal: number;
  waterOld: number | string;
  waterNew: number | string;
  waterRate: number;
  waterUsage: number;
  waterTotal: number;
  monthlyRent?: number;
  quarterlyRent?: number;
  totalBill: number;
  formatCurrency: (value: number) => string;
}>();

const emit = defineEmits(["close-detail-modal"]);

const themeStore = useThemeStore();
const languageStore = useLanguageStore();
const { t, locale } = useI18n();

// Initialize locale and watch for language changes
onMounted(() => {
  locale.value = languageStore.currentLanguage;
});

watch(
  () => languageStore.currentLanguage,
  (newLang) => {
    locale.value = newLang;
  },
  { immediate: true }
);

const closeDetailModal = () => {
  emit("close-detail-modal");
};
</script>

<style scoped>
/* Modal animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
</style> 