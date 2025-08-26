<template>
  <div
    v-if="showDetailModal"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 animate-fade-in"
    style="overflow-y: auto; padding: 1rem;"
    @click.self="closeDetailModal"
  >
    <div
      class="flex items-start justify-center min-h-full py-4"
    >
      <div
        :class="[
          'relative rounded-lg max-w-lg w-full max-h-[calc(100vh-2rem)] overflow-hidden transform transition-all duration-300 animate-scale-in',
          themeStore.isDarkMode
            ? 'bg-gray-800 border border-gray-700 text-white shadow-[0_25px_50px_rgba(0,0,0,0.5)]'
            : 'bg-white text-gray-800 shadow-2xl'
        ]"
      >
        <div class="sticky top-0 z-10 flex justify-between items-center p-4 border-b"
          :class="themeStore.isDarkMode ? 'bg-gradient-to-r from-gray-700 to-gray-600 border-gray-600' : 'bg-white border-gray-200'"
        >
          <h3 class="text-lg font-medium">{{ t('calculator.detailModal.title') }}</h3>
          <button
            @click="closeDetailModal"
            :class="[
              'p-2 rounded-full transition-all duration-200 focus:outline-none',
              themeStore.isDarkMode
                ? 'hover:bg-gray-600 hover:text-white active:bg-gray-500 hover:shadow-md'
                : 'hover:bg-red-100 text-gray-700 hover:text-red-600 active:bg-red-200'
            ]"
            :title="t('calculator.detailModal.closeButton')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="overflow-y-auto max-h-[calc(100vh-8rem)] p-6 pt-4 space-y-6 text-left">
        <!-- Ngày tháng -->
        <div class="text-center text-lg font-medium">
          {{ currentDate }}
        </div>
        
        <!-- Phần điện -->
        <div>
          <div class="font-medium text-lg mb-2">+ {{ t('calculator.tabs.electricity') }}:</div>
          <div :class="[
            'rounded-lg p-4',
            themeStore.isDarkMode ? 'bg-gray-900 border border-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'bg-gray-50'
          ]">
            <div class="flex items-start mb-2">
              <span class="w-20">{{ t('calculator.detailModal.reading') }}:</span>
              <span class="font-medium">
                {{ t('calculator.detailModal.new') }}: {{ electricityNew || '0' }} - {{ t('calculator.detailModal.old') }}: {{ electricityOld || '0' }} = {{ electricityUsage }} kWh
              </span>
            </div>
            <div class="flex items-start mb-2">
              <span class="w-20">{{ t('calculator.detailModal.amount') }}:</span>
              <span class="font-medium">{{ electricityRate }} × {{ electricityUsage }} = {{ formatCurrency(electricityTotal) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Phần nước -->
        <div>
          <div class="font-medium text-lg mb-2">+ {{ t('calculator.tabs.water') }}:</div>
          <div :class="[
            'rounded-lg p-4',
            themeStore.isDarkMode ? 'bg-gray-900 border border-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'bg-gray-50'
          ]">
            <div class="flex items-start mb-2">
              <span class="w-20">{{ t('calculator.detailModal.reading') }}:</span>
              <span class="font-medium">
                {{ t('calculator.detailModal.new') }}: {{ waterNew || '0' }} - {{ t('calculator.detailModal.old') }}: {{ waterOld || '0' }} = {{ waterUsage }} m³
              </span>
            </div>
            <div class="flex items-start mb-2">
              <span class="w-20">{{ t('calculator.detailModal.amount') }}:</span>
              <span class="font-medium">{{ waterRate }} × {{ waterUsage }} = {{ formatCurrency(waterTotal) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Phần tiền nhà -->
        <div v-if="monthlyRent && monthlyRent > 0">
          <div class="font-medium text-lg mb-2">+ {{ t('calculator.tabs.rent', 'Tiền Nhà') }}:</div>
          <div :class="[
            'rounded-lg p-4',
            themeStore.isDarkMode ? 'bg-gray-900 border border-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'bg-gray-50'
          ]">
            <div class="flex items-start mb-2">
              <span class="w-20">{{ t('calculator.rent.perMonth', 'Tiền nhà/tháng') }}:</span>
              <span class="font-medium">{{ formatCurrency(monthlyRent) }}</span>
            </div>
            <div class="flex items-start mb-2">
              <span class="w-20">{{ t('calculator.detailModal.amount') }}:</span>
              <span class="font-medium">{{ formatCurrency(monthlyRent) }} × 3 = {{ formatCurrency(quarterlyRent || 0) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Tổng điện nước nhà -->
        <div>
          <div class="font-medium text-lg mb-2">{{ t('calculator.detailModal.utilityTotal') }}:</div>
          <div :class="[
            'rounded-lg p-4',
            themeStore.isDarkMode ? 'bg-gray-900 border border-gray-600 shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'bg-gray-50'
          ]">
            <div class="font-medium">
              {{ formatCurrency(electricityTotal) }} + {{ formatCurrency(waterTotal) }} + {{ formatCurrency(quarterlyRent || 0) }} = {{ formatCurrency(totalBill) }}
            </div>
          </div>
        </div>
        
        <!-- Phần tổng cộng -->
        <div>
          <div class="font-medium text-lg mb-2">{{ t('calculator.detailModal.grandTotal') }}:</div>
          <div :class="[
            'rounded-lg p-4 border-2 text-center',
            themeStore.isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500 shadow-[0_4px_12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]' : 'bg-blue-50 border-blue-200'
          ]">
            <div class="text-xl font-bold">
              {{ formatCurrency(totalBill) }}
            </div>
            <div class="text-sm mt-1" :class="themeStore.isDarkMode ? 'text-gray-300' : 'text-gray-600'">
              {{ t('calculator.detailModal.note') }}
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="flex gap-3 pt-2">
          <button
            @click="copyDetailToClipboard"
            :class="[
              'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
              themeStore.isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 focus:ring-offset-gray-800'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {{ t('calculator.detailModal.copyButton', 'Sao chép') }}
          </button>

          <button
            @click="copyTotalToClipboard"
            :class="[
              'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
              themeStore.isDarkMode
                ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 focus:ring-offset-gray-800'
                : 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            {{ t('calculator.detailModal.copyTotalButton', 'Sao chép tổng') }}
          </button>
        </div>
        </div>

        <!-- Thanh chỉ dẫn cách đóng modal -->
        <div
          :class="[
            'py-2 text-center text-xs sticky bottom-0',
            themeStore.isDarkMode ? 'bg-gray-700 text-gray-400 border-t border-gray-600' : 'bg-gray-50 text-gray-500 border-t border-gray-200'
          ]"
        >
          <span class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ t('calculator.detailModal.closeButton') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '../stores/theme'
import { useToast } from '../composables/useToast'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  showDetailModal: boolean
  currentDate: string
  electricityOld: number | string
  electricityNew: number | string
  electricityRate: number
  electricityUsage: number
  electricityTotal: number
  waterOld: number | string
  waterNew: number | string
  waterRate: number
  waterUsage: number
  waterTotal: number
  monthlyRent?: number
  quarterlyRent?: number
  totalBill: number
  formatCurrency: (value: number) => string
}>()

const emit = defineEmits(['close-detail-modal'])

const themeStore = useThemeStore()
const { copyToClipboard, showSuccess, showError } = useToast()
const { t } = useI18n()

const closeDetailModal = () => {
  emit('close-detail-modal')
}

// Copy detailed calculation to clipboard
const copyDetailToClipboard = async () => {
  let detailText = `
${t('calculator.detailModal.title')} - ${props.currentDate}

${t('calculator.tabs.electricity')}:
- ${t('calculator.detailModal.reading')}: ${props.electricityNew} - ${props.electricityOld} = ${props.electricityUsage} kWh
- ${t('calculator.detailModal.amount')}: ${props.electricityRate} × ${props.electricityUsage} = ${props.formatCurrency(props.electricityTotal)}

${t('calculator.tabs.water')}:
- ${t('calculator.detailModal.reading')}: ${props.waterNew} - ${props.waterOld} = ${props.waterUsage} m³
- ${t('calculator.detailModal.amount')}: ${props.waterRate} × ${props.waterUsage} = ${props.formatCurrency(props.waterTotal)}
`

  // Thêm phần tiền nhà nếu có
  if (props.monthlyRent && props.monthlyRent > 0) {
    detailText += `
${t('calculator.tabs.rent', 'Tiền Nhà')}:
- ${t('calculator.rent.perMonth', 'Tiền nhà/tháng')}: ${props.formatCurrency(props.monthlyRent)}
- ${t('calculator.detailModal.amount')}: ${props.formatCurrency(props.monthlyRent)} × 3 = ${props.formatCurrency(props.quarterlyRent || 0)}
`
  }

  detailText += `
${t('calculator.detailModal.grandTotal')}: ${props.formatCurrency(props.totalBill)}
`
  detailText = detailText.trim()

  const success = await copyToClipboard(detailText, t('toast.success.copyDetail', 'Đã sao chép chi tiết tính toán!'))
  if (success) {
    console.log('📋 Chi tiết tính toán đã được sao chép')
  }
}

// Copy only total amount to clipboard
const copyTotalToClipboard = async () => {
  const totalText = props.formatCurrency(props.totalBill)
  const success = await copyToClipboard(totalText, t('toast.success.copyTotal', 'Đã sao chép tổng tiền!'))
  if (success) {
    console.log('💰 Tổng tiền đã được sao chép')
  }
}
</script>

<style scoped>
/* Modal animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}
</style> 