<template>
  <div
    :class="[
      'px-6 py-4 max-sm:px-4 max-sm:py-3 max-xs:px-3 max-xs:py-2 flex justify-between items-center flex-wrap gap-2',
      themeStore.isPureDark
        ? 'bg-black border-b border-gray-900'
        : themeStore.isDarkMode
        ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-b border-gray-600'
        : 'bg-indigo-600',
    ]"
  >
    <div class="min-w-0">
      <h1
        class="text-2xl max-sm:text-xl max-xs:text-lg font-bold text-white leading-tight"
      >
        {{ $t("calculator.title") }}
      </h1>
      <p
        class="text-sm max-xs:text-xs"
        :class="themeStore.isDarkMode ? 'text-gray-200' : 'text-indigo-100'"
      >
        {{ $t("calculator.subtitle") }}
      </p>
    </div>
    <div class="flex items-center space-x-2 max-sm:space-x-1 max-xs:space-x-1">
      <!-- Background Toggle Switch -->
      <div class="flex items-center mr-3">
        <div
          class="flex items-center cursor-pointer"
          @click="handleBackgroundToggle"
        >
          <div
            :class="[
              'relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out',
              backgroundStore.isEnabled
                ? 'bg-blue-600 shadow-lg'
                : 'bg-gray-400',
            ]"
          >
            <div
              :class="[
                'absolute top-0.5 left-0.5 bg-white rounded-full h-5 w-5 transition-all duration-300 ease-in-out shadow-md',
                backgroundStore.isEnabled
                  ? 'transform translate-x-5'
                  : 'transform translate-x-0',
              ]"
            ></div>
          </div>
          <span
            :class="[
              'ml-2 text-sm font-medium transition-colors duration-200',
              themeStore.isDarkMode ? 'text-gray-200' : 'text-white',
            ]"
          >
            {{ $t("calculator.background.toggle") }}
          </span>
        </div>
      </div>

      <!-- Language Dropdown -->
      <div class="lang-dropdown-wrapper mr-1" ref="langDropdownRef">
        <button
          ref="langBtnRef"
          @click="toggleLangDropdown"
          :class="[
            'lang-trigger flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none',
            isLangOpen
              ? themeStore.isPureDark
                ? 'bg-white/10 text-white ring-2 ring-white/20'
                : themeStore.isDarkMode
                ? 'bg-white/15 text-white ring-2 ring-white/25'
                : 'bg-white/25 text-white ring-2 ring-white/40'
              : themeStore.isPureDark
              ? 'bg-transparent text-white hover:bg-white/10'
              : themeStore.isDarkMode
              ? 'bg-transparent text-white hover:bg-white/15'
              : 'bg-transparent text-white hover:bg-white/20',
          ]"
          :title="`${$t('calculator.language.select', 'Chọn ngôn ngữ')}: ${
            currentLang?.name
          }`"
        >
          <span class="lang-flag text-base leading-none">{{
            currentLang?.flag
          }}</span>
          <span class="lang-code font-bold tracking-wide">{{
            currentLang?.code
          }}</span>
          <svg
            class="lang-caret w-3.5 h-3.5 transition-transform duration-300 opacity-80"
            :class="isLangOpen ? 'rotate-180' : 'rotate-0'"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.5"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        <!-- Dropdown Panel – Teleported to body to escape overflow:hidden parents -->
        <Teleport to="body">
          <Transition name="lang-dropdown">
            <div
              v-if="isLangOpen"
              :class="[
                'lang-panel-teleport rounded-2xl overflow-hidden',
                themeStore.isPureDark
                  ? 'bg-neutral-900/95 border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.8)]'
                  : themeStore.isDarkMode
                  ? 'bg-gray-800/95 border border-white/12 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
                  : 'bg-white/95 border border-indigo-100 shadow-[0_8px_32px_rgba(79,70,229,0.18)]',
              ]"
              :style="dropdownStyle"
              style="
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
              "
            >
              <!-- Panel Header -->
              <div
                :class="[
                  'px-3 py-2 text-xs font-semibold uppercase tracking-widest border-b',
                  themeStore.isPureDark
                    ? 'text-gray-500 border-white/6'
                    : themeStore.isDarkMode
                    ? 'text-gray-400 border-white/8'
                    : 'text-indigo-400 border-indigo-50',
                ]"
              >
                {{ $t("calculator.language.select", "Ngôn ngữ") }}
              </div>

              <!-- Language Options -->
              <div class="py-1">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="selectLang(lang.locale)"
                  :class="[
                    'lang-option w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 focus:outline-none',
                    languageStore.currentLanguage === lang.locale
                      ? themeStore.isPureDark
                        ? 'bg-indigo-500/20 text-indigo-300'
                        : themeStore.isDarkMode
                        ? 'bg-indigo-500/25 text-indigo-200'
                        : 'bg-indigo-50 text-indigo-700'
                      : themeStore.isPureDark
                      ? 'text-gray-300 hover:bg-white/6 hover:text-white'
                      : themeStore.isDarkMode
                      ? 'text-gray-200 hover:bg-white/8 hover:text-white'
                      : 'text-gray-700 hover:bg-indigo-50/70 hover:text-indigo-700',
                  ]"
                >
                  <span class="text-xl leading-none">{{ lang.flag }}</span>
                  <div class="flex-1 text-left">
                    <div class="font-semibold text-xs tracking-wider">
                      {{ lang.code }}
                    </div>
                    <div class="text-xs opacity-60 font-normal leading-tight">
                      {{ lang.name }}
                    </div>
                  </div>
                  <!-- Active checkmark -->
                  <svg
                    v-if="languageStore.currentLanguage === lang.locale"
                    class="w-4 h-4 flex-shrink-0"
                    :class="
                      themeStore.isDarkMode
                        ? 'text-indigo-300'
                        : 'text-indigo-600'
                    "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Transition>
        </Teleport>
      </div>

      <button
        @click="themeStore.toggleTheme"
        class="p-2 max-xs:p-1.5 rounded-full hover:bg-opacity-10 hover:bg-white"
        :title="
          themeStore.themeMode === 'pure-dark'
            ? 'Chế độ sáng'
            : themeStore.themeMode === 'dark'
            ? 'Chế độ tối đen tuyền'
            : $t('calculator.theme.darkMode')
        "
      >
        <svg
          v-if="themeStore.themeMode === 'pure-dark'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 max-sm:h-5 max-sm:w-5 max-xs:h-5 max-xs:w-5 text-gray-400"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
          />
        </svg>
        <svg
          v-else-if="themeStore.themeMode === 'dark'"
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 max-sm:h-5 max-sm:w-5 max-xs:h-5 max-xs:w-5 text-yellow-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 max-sm:h-5 max-sm:w-5 max-xs:h-5 max-xs:w-5 text-gray-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useThemeStore } from "../stores/theme";
import { useLanguageStore } from "../stores/language";
import { useBackgroundStore } from "../stores/background";

const themeStore = useThemeStore();
const languageStore = useLanguageStore();
const backgroundStore = useBackgroundStore();
const { locale } = useI18n();

// Language dropdown state
const isLangOpen = ref(false);
const langDropdownRef = ref<HTMLElement | null>(null);
const langBtnRef = ref<HTMLElement | null>(null);

// Reactive dropdown position (updated when opened)
const dropdownPos = ref({ top: 0, right: 0 });

const dropdownStyle = computed(() => ({
  position: "fixed" as const,
  top: dropdownPos.value.top + "px",
  right: dropdownPos.value.right + "px",
  width: "176px",
  zIndex: 9999,
}));

const languages = [
  { locale: "vi", code: "VI", name: "Tiếng Việt", flag: "🇻🇳" },
  { locale: "en", code: "EN", name: "English", flag: "🇬🇧" },
  { locale: "ko", code: "KO", name: "한국어", flag: "🇰🇷" },
  { locale: "zh", code: "ZH", name: "中文", flag: "🇨🇳" },
];

const currentLang = computed(
  () =>
    languages.find((l) => l.locale === languageStore.currentLanguage) ??
    languages[0]
);

const updateDropdownPos = () => {
  if (!langBtnRef.value) return;
  const rect = langBtnRef.value.getBoundingClientRect();
  dropdownPos.value = {
    top: rect.bottom + 8,
    right: window.innerWidth - rect.right,
  };
};

const toggleLangDropdown = () => {
  if (!isLangOpen.value) updateDropdownPos();
  isLangOpen.value = !isLangOpen.value;
};

const selectLang = (lang: string) => {
  languageStore.setLanguage(lang);
  isLangOpen.value = false;
};

// Close dropdown when clicking outside
const handleOutsideClick = (e: MouseEvent) => {
  if (
    langDropdownRef.value &&
    !langDropdownRef.value.contains(e.target as Node)
  ) {
    isLangOpen.value = false;
  }
};

// Initialize locale and watch for language changes
onMounted(() => {
  locale.value = languageStore.currentLanguage;
  document.addEventListener("click", handleOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleOutsideClick);
});

watch(
  () => languageStore.currentLanguage,
  (newLang) => {
    locale.value = newLang;
  },
  { immediate: true }
);

// Handle background toggle with debug logging
const handleBackgroundToggle = () => {
  console.log(
    "Background toggle clicked, current state:",
    backgroundStore.isEnabled
  );
  backgroundStore.toggleBackground();
  console.log("Background toggle after click:", backgroundStore.isEnabled);
};
</script>

<style scoped>
/* Dropdown wrapper needs relative positioning */
.lang-dropdown-wrapper {
  position: relative;
}

/* Teleported panel base */
.lang-panel-teleport {
  position: fixed;
}

/* Dropdown panel animation */
.lang-dropdown-enter-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.lang-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.lang-dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
.lang-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

/* Option hover ripple feel */
.lang-option {
  position: relative;
  overflow: hidden;
}
.lang-option::after {
  content: "";
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.15s ease;
}
.lang-option:active::after {
  opacity: 0.08;
}

/* Trigger button glow on open */
.lang-trigger {
  position: relative;
}
</style>