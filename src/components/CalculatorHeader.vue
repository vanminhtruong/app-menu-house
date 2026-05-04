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
            'lang-trigger group flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none border',
            isLangOpen
              ? themeStore.isPureDark
                ? 'bg-white/12 text-white border-white/20 shadow-lg shadow-black/30'
                : themeStore.isDarkMode
                ? 'bg-white/15 text-white border-white/20 shadow-lg shadow-black/20'
                : 'bg-white/30 text-white border-white/50 shadow-lg shadow-indigo-900/20'
              : themeStore.isPureDark
              ? 'bg-white/6 text-white/90 border-white/10 hover:bg-white/12 hover:border-white/20 hover:text-white'
              : themeStore.isDarkMode
              ? 'bg-white/8 text-white/90 border-white/12 hover:bg-white/15 hover:border-white/22 hover:text-white'
              : 'bg-white/15 text-white border-white/30 hover:bg-white/28 hover:border-white/50',
          ]"
          :title="`${$t('calculator.language.select', 'Chọn ngôn ngữ')}: ${
            currentLang?.name
          }`"
        >
          <img
            v-if="currentLang"
            :src="getFlagSvg(currentLang.countryCode)"
            :alt="currentLang.name"
            class="lang-flag-img w-5 h-auto rounded-sm shadow-sm object-cover"
          />
          <svg
            class="lang-caret w-3 h-3 transition-transform duration-300 opacity-70"
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
                  ? 'bg-[#111]/96 border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.04)]'
                  : themeStore.isDarkMode
                  ? 'bg-gray-800/96 border border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06)]'
                  : 'bg-white/98 border border-indigo-100/80 shadow-[0_16px_48px_rgba(79,70,229,0.22),0_4px_12px_rgba(0,0,0,0.08)]',
              ]"
              :style="dropdownStyle"
              style="backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);"
            >
              <!-- Panel Header -->
              <div
                :class="[
                  'flex items-center gap-2 px-4 py-2.5 border-b',
                  themeStore.isPureDark
                    ? 'border-white/8'
                    : themeStore.isDarkMode
                    ? 'border-white/8'
                    : 'border-indigo-100',
                ]"
              >
                <!-- Globe icon -->
                <svg
                  class="w-3.5 h-3.5 flex-shrink-0"
                  :class="themeStore.isDarkMode ? 'text-indigo-400' : 'text-indigo-500'"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" stroke-width="1.8"/>
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke-width="1.8"/>
                </svg>
                <span
                  :class="[
                    'text-xs font-semibold uppercase tracking-widest',
                    themeStore.isPureDark
                      ? 'text-gray-400'
                      : themeStore.isDarkMode
                      ? 'text-gray-400'
                      : 'text-indigo-500',
                  ]"
                >
                  {{ $t("calculator.language.select", "Ngôn ngữ") }}
                </span>
              </div>

              <!-- Language Options -->
              <div class="p-1.5 flex flex-col gap-0.5">
                <button
                  v-for="lang in languages"
                  :key="lang.code"
                  @click="selectLang(lang.locale)"
                  :class="[
                    'lang-option w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 focus:outline-none',
                    languageStore.currentLanguage === lang.locale
                      ? themeStore.isPureDark
                        ? 'bg-indigo-500/18 text-indigo-300 shadow-sm'
                        : themeStore.isDarkMode
                        ? 'bg-indigo-500/22 text-indigo-200 shadow-sm'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : themeStore.isPureDark
                      ? 'text-gray-300 hover:bg-white/7 hover:text-white'
                      : themeStore.isDarkMode
                      ? 'text-gray-200 hover:bg-white/8 hover:text-white'
                      : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700',
                  ]"
                >
                  <!-- Flag badge -->
                  <span
                    :class="[
                      'lang-flag-badge w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden flex-shrink-0',
                      languageStore.currentLanguage === lang.locale
                        ? themeStore.isDarkMode
                          ? 'ring-2 ring-indigo-400/40'
                          : 'ring-2 ring-white/40'
                        : '',
                    ]"
                  >
                    <img
                      :src="getFlagSvg(lang.countryCode)"
                      :alt="lang.name"
                      class="w-full h-full object-cover"
                    />
                  </span>
                  <div class="flex-1 text-left min-w-0">
                    <div
                      :class="[
                        'font-semibold text-xs tracking-wider leading-none mb-0.5',
                        languageStore.currentLanguage === lang.locale && !themeStore.isDarkMode ? 'text-white' : '',
                      ]"
                    >
                      {{ lang.code }}
                    </div>
                    <div
                      :class="[
                        'text-xs leading-tight truncate',
                        languageStore.currentLanguage === lang.locale
                          ? themeStore.isDarkMode ? 'opacity-70' : 'text-indigo-100'
                          : 'opacity-50',
                      ]"
                    >
                      {{ lang.name }}
                    </div>
                  </div>
                  <!-- Active indicator dot -->
                  <div
                    v-if="languageStore.currentLanguage === lang.locale"
                    :class="[
                      'w-2 h-2 rounded-full flex-shrink-0',
                      themeStore.isDarkMode ? 'bg-indigo-400' : 'bg-white',
                    ]"
                  ></div>
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
import * as flags from "country-flag-icons/string/3x2";

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
  width: "192px",
  zIndex: 9999,
}));

const languages = [
  { locale: "vi", code: "VI", name: "Tiếng Việt", countryCode: "VN" },
  { locale: "en", code: "EN", name: "English", countryCode: "GB" },
  { locale: "ko", code: "KO", name: "한국어", countryCode: "KR" },
  { locale: "zh", code: "ZH", name: "中文", countryCode: "CN" },
];

const getFlagSvg = (countryCode: string): string => {
  const svg = (flags as unknown as Record<string, string>)[countryCode];
  if (!svg) return "";
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

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
  transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.lang-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.lang-dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scale(0.94);
}
.lang-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.97);
}

/* Option hover */
.lang-option {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}
.lang-option::after {
  content: "";
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.12s ease;
  border-radius: inherit;
}
.lang-option:active::after {
  opacity: 0.07;
}

/* Trigger button */
.lang-trigger {
  position: relative;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Flag badge subtle scale on hover */
.lang-option:hover .lang-flag-badge {
  transform: scale(1.08);
  transition: transform 0.15s ease;
}
.lang-flag-badge {
  transition: transform 0.15s ease;
}
</style>