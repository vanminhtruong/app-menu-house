<template>
  <div
    :class="[
      'rent-calculator rounded-lg p-6 max-sm:p-4 max-xs:p-3 border transition-all duration-300',
      themeStore.isPureDark
        ? 'bg-black border-none pd-shadow-lg'
        : themeStore.isDarkMode
        ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]'
        : 'bg-white border-gray-200 shadow-sm',
      isInBothTab
        ? 'mt-8 mb-6 max-sm:mt-6 max-sm:mb-4 max-xs:mt-4 max-xs:mb-3'
        : '',
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 mb-6 max-sm:mb-4 max-xs:mb-3">
      <h2
        :class="[
          'text-xl max-sm:text-lg max-xs:text-base font-bold flex items-center gap-2 max-sm:gap-1.5 max-xs:gap-1 leading-tight max-xs:leading-snug max-sm:whitespace-normal max-sm:break-words',
          themeStore.isDarkMode ? 'text-white' : 'text-gray-800',
        ]"
      >
        <span class="text-2xl max-sm:text-xl max-xs:text-lg">🏠</span>
        {{ $t("calculator.rent.title", "Tính Tiền Nhà") }}
      </h2>

      <!-- Công tắc: bật/tắt cộng tiền nhà vào tổng -->
      <button
        type="button"
        role="switch"
        :aria-checked="includeRent"
        data-testid="rent-toggle"
        :title="
          includeRent
            ? $t('calculator.rent.included', 'Đang cộng tiền nhà vào tổng')
            : $t('calculator.rent.excluded', 'Đã tắt — tiền nhà không cộng vào tổng')
        "
        :class="[
          'rent-toggle inline-flex items-center gap-2 rounded-full pl-3 pr-1 py-1 border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shrink-0',
          includeRent
            ? themeStore.isPureDark
              ? 'bg-blue-600/20 border-blue-500 text-blue-300'
              : themeStore.isDarkMode
              ? 'bg-blue-500/20 border-blue-400 text-blue-200'
              : 'bg-blue-50 border-blue-300 text-blue-700'
            : themeStore.isPureDark
            ? 'bg-neutral-900 border-neutral-700 text-neutral-500'
            : themeStore.isDarkMode
            ? 'bg-gray-700 border-gray-600 text-gray-400'
            : 'bg-gray-100 border-gray-300 text-gray-500',
        ]"
        @click="emit('update:include-rent', !includeRent)"
      >
        <span class="text-xs font-medium whitespace-nowrap">
          {{ $t("calculator.rent.includeToggle", "Cộng tiền nhà") }}
        </span>
        <span
          :class="[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300',
            includeRent
              ? 'bg-green-500'
              : themeStore.isDarkMode
              ? 'bg-gray-500'
              : 'bg-gray-300',
          ]"
        >
          <span
            :class="[
              'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-300',
              includeRent ? 'translate-x-5' : 'translate-x-0.5',
            ]"
          ></span>
        </span>
      </button>
    </div>

    <!-- Nhắc rõ trạng thái khi công tắc đang tắt -->
    <p
      v-if="!includeRent"
      data-testid="rent-excluded-hint"
      :class="[
        'text-xs mb-4 max-sm:mb-3',
        themeStore.isDarkMode ? 'text-gray-400' : 'text-gray-500',
      ]"
    >
      {{
        $t(
          "calculator.rent.excluded",
          "Đã tắt — tiền nhà không được cộng vào tổng"
        )
      }}
    </p>

    <!-- Vùng tiền nhà: mờ đi khi công tắc tắt, rõ lên khi bật -->
    <div
      :class="[
        'transition-all duration-300',
        includeRent ? 'opacity-100' : 'opacity-40 grayscale',
      ]"
      data-testid="rent-section"
    >
    <!-- Monthly Rent Input -->
    <div class="mb-8">
      <label
        for="monthly-rent"
        :class="[
          'block text-sm font-medium mb-2',
          themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-700',
        ]"
      >
        {{ $t("calculator.rent.monthlyRent", "Tiền nhà 1 tháng") }} (VND)
        <span
          class="inline-flex items-center align-middle ml-1"
          :title="$t('calculator.rent.fixed', 'Tiền nhà cố định')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 1a4 4 0 00-4 4v3H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2V10a2 2 0 00-2-2h-1V5a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3H8V5z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </label>
      <input
        id="monthly-rent"
        type="number"
        inputmode="numeric"
        step="1"
        min="0"
        readonly
        aria-readonly="true"
        :value="monthlyRent"
        :placeholder="
          $t('calculator.rent.placeholder', 'Nhập tiền nhà 1 tháng...')
        "
        :class="[
          'w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 text-lg font-medium',
          themeStore.isPureDark
            ? 'bg-neutral-900 border-none pd-shadow-input text-white placeholder-neutral-500 focus:ring-2 focus:ring-blue-500 focus:bg-neutral-900'
            : themeStore.isDarkMode
            ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-500'
            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20',
        ]"
        @keydown="preventInvalidKeyInteger"
        @paste="onPasteInteger"
        @wheel.prevent
        @input="handleRentInput"
      />
    </div>

    <!-- Calculation Details -->
    <div
      v-if="monthlyRent > 0"
      :class="[
        'calculation-details p-5 rounded-lg border-2 border-dashed transition-all duration-300 mt-6',
        themeStore.isPureDark
          ? 'bg-neutral-900/50 border-none pd-shadow'
          : themeStore.isDarkMode
          ? 'bg-gray-800/50 border-gray-500'
          : 'bg-blue-50 border-blue-200',
      ]"
    >
      <h3
        :class="[
          'text-md font-semibold mb-3 flex items-center gap-2',
          themeStore.isDarkMode ? 'text-blue-300' : 'text-blue-700',
        ]"
      >
        <span>🧮</span>
        {{ $t("calculator.rent.calculation", "Chi tiết tính toán") }}
      </h3>

      <div class="space-y-2">
        <!-- Monthly Rent -->
        <div class="flex justify-between items-center">
          <span
            :class="[
              'text-sm',
              themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ $t("calculator.rent.perMonth", "Tiền nhà/tháng") }}:
          </span>
          <span
            :class="[
              'font-medium',
              themeStore.isDarkMode ? 'text-white' : 'text-gray-800',
            ]"
          >
            {{ formatCurrency(monthlyRent) }}
          </span>
        </div>

        <!-- Formula -->
        <div class="flex justify-between items-center">
          <span
            :class="[
              'text-sm',
              themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600',
            ]"
          >
            {{ $t("calculator.rent.formula", "Công thức") }}:
          </span>
          <span
            :class="[
              'font-medium text-sm',
              themeStore.isDarkMode ? 'text-blue-300' : 'text-blue-600',
            ]"
          >
            {{ formatCurrency(monthlyRent) }} × 3
          </span>
        </div>

        <!-- Quarterly Total -->
        <div
          :class="[
            'flex justify-between items-center pt-2 border-t',
            themeStore.isPureDark
              ? 'border-neutral-800'
              : themeStore.isDarkMode
              ? 'border-gray-600'
              : 'border-blue-200',
          ]"
        >
          <span
            :class="[
              'font-semibold',
              themeStore.isDarkMode ? 'text-blue-300' : 'text-blue-700',
            ]"
          >
            {{ $t("calculator.rent.quarterlyTotal", "Tiền nhà 3 tháng") }}:
          </span>
          <span
            v-if="includeRent"
            :class="[
              'text-lg font-bold',
              themeStore.isDarkMode ? 'text-green-400' : 'text-green-600',
            ]"
          >
            {{ formatCurrency(quarterlyRent) }}
          </span>
          <span
            v-else
            :class="[
              'text-lg font-bold line-through',
              themeStore.isDarkMode ? 'text-gray-400' : 'text-gray-500',
            ]"
          >
            {{ formatCurrency(monthlyRent * 3) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      :class="[
        'text-center py-12 mt-6',
        themeStore.isDarkMode ? 'text-gray-400' : 'text-gray-500',
      ]"
    >
      <div class="text-4xl mb-2">🏠</div>
      <p class="text-sm">
        {{
          $t(
            "calculator.rent.emptyState",
            "Nhập tiền nhà để xem chi tiết tính toán"
          )
        }}
      </p>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useThemeStore } from "../stores/theme";
import { useLanguageStore } from "../stores/language";
import { useI18n } from "vue-i18n";

defineProps<{
  monthlyRent: number;
  quarterlyRent: number;
  formatCurrency: (value: number) => string;
  isInBothTab?: boolean;
  /** Công tắc cộng tiền nhà vào tổng (mặc định bật) */
  includeRent?: boolean;
}>();

const emit = defineEmits<{
  "update:monthly-rent": [value: number];
  "update:include-rent": [value: boolean];
}>();

const themeStore = useThemeStore();
const languageStore = useLanguageStore();
const { locale } = useI18n();

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

const handleRentInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const cleaned = (target.value || "").replace(/[^\d]/g, "");
  if (target.value !== cleaned) target.value = cleaned;
  emit("update:monthly-rent", Number(cleaned || 0));
};

// Prevent invalid characters and sanitize paste
const preventInvalidKeyInteger = (e: KeyboardEvent) => {
  const invalid = ["e", "E", "+", "-", "."];
  if (invalid.includes(e.key)) e.preventDefault();
};

const onPasteInteger = (e: ClipboardEvent) => {
  const input = e.target as HTMLInputElement;
  const text = e.clipboardData?.getData("text") ?? "";
  const cleaned = text.replace(/[^\d]/g, "");
  if (cleaned !== text) {
    e.preventDefault();
    input.setRangeText(
      cleaned,
      input.selectionStart ?? input.value.length,
      input.selectionEnd ?? input.value.length,
      "end"
    );
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
};
</script>

<style scoped>
.rent-calculator {
  animation: slideIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.calculation-details {
  animation: fadeInUp 0.4s ease-out 0.2s forwards;
  opacity: 0;
  transform: translateY(10px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Input focus animations */
input:focus {
  transform: scale(1.02);
}

/* Công tắc tiền nhà: đổi con trỏ và giữ công tắc nổi bật khi tắt */
.rent-toggle {
  cursor: pointer;
  user-select: none;
}

.rent-toggle:hover {
  transform: translateY(-1px);
}

/* Hover effects */
.rent-calculator:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.rent-calculator:hover .calculation-details {
  transform: scale(1.02);
}
</style>
