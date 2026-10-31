import { useToast as useVueToastification } from 'vue-toastification'
import i18n from '../i18n'
import { watch } from 'vue'
import { useToastTheme } from './useToastTheme'

// Interface cho toast options
interface ToastOptions {
  timeout?: number
  hideProgressBar?: boolean
  closeButton?: boolean | string
  icon?: boolean
  closeOnClick?: boolean
}

// Interface cho toast messages
interface ToastMessages {
  success: {
    copy: string
    save: string
    reset: string
    upload: string
    calculate: string
    general: string
  }
  error: {
    copy: string
    save: string
    upload: string
    network: string
    validation: string
    general: string
  }
  warning: {
    validation: string
    limit: string
    noData: string
    general: string
  }
  info: {
    processing: string
    loading: string
    general: string
  }
}

export function useToast() {
  const toast = useVueToastification()

  // Initialize toast theme management
  const { forceUpdateTheme } = useToastTheme()

  // Resolve translations through the shared i18n instance, also outside component setup.
  const t = (key: string, fallback: string) => i18n.global.t(key, fallback)

  // Rebuild predefined messages when the selected language changes.
  const createMessages = (): ToastMessages => ({
    success: {
      copy: t('toast.success.copy', 'Đã sao chép thành công!'),
      save: t('toast.success.save', 'Đã lưu thành công!'),
      reset: t('toast.success.reset', 'Đã reset form thành công!'),
      upload: t('toast.success.upload', 'Tải ảnh thành công!'),
      calculate: t('toast.success.calculate', 'Tính toán hoàn tất!'),
      general: t('toast.success.general', 'Thao tác thành công!')
    },
    error: {
      copy: t('toast.error.copy', 'Không thể sao chép!'),
      save: t('toast.error.save', 'Lỗi khi lưu dữ liệu!'),
      upload: t('toast.error.upload', 'Lỗi khi tải ảnh!'),
      network: t('toast.error.network', 'Lỗi kết nối mạng!'),
      validation: t('toast.error.validation', 'Dữ liệu không hợp lệ!'),
      general: t('toast.error.general', 'Có lỗi xảy ra!')
    },
    warning: {
      validation: t('toast.warning.validation', 'Vui lòng kiểm tra lại dữ liệu!'),
      limit: t('toast.warning.limit', 'Đã đạt giới hạn cho phép!'),
      noData: t('toast.warning.noData', 'Vui lòng nhập ít nhất một loại tiện ích để xem chi tiết!'),
      general: t('toast.warning.general', 'Cảnh báo!')
    },
    info: {
      processing: t('toast.info.processing', 'Đang xử lý...'),
      loading: t('toast.info.loading', 'Đang tải...'),
      general: t('toast.info.general', 'Thông tin')
    }
  })
  const messages = createMessages()
  watch(i18n.global.locale, () => {
    const translated = createMessages()
    for (const category of ['success', 'error', 'warning', 'info'] as const) {
      Object.assign(messages[category], translated[category])
    }
  }, { flush: 'sync' })

  // Success toast
  const showSuccess = (message?: string, options?: ToastOptions) => {
    toast.success(message || messages.success.general, {
      timeout: 3000,
      hideProgressBar: false,
      closeButton: false,
      icon: true,
      ...options
    })
    // Ensure theme is applied to new toast
    setTimeout(() => forceUpdateTheme(), 50)
  }

  // Error toast
  const showError = (message?: string, options?: ToastOptions) => {
    toast.error(message || messages.error.general, {
      timeout: 6000,
      hideProgressBar: false,
      closeButton: true,
      icon: true,
      ...options
    })
    // Ensure theme is applied to new toast
    setTimeout(() => forceUpdateTheme(), 50)
  }

  // Warning toast
  const showWarning = (message?: string, options?: ToastOptions) => {
    toast.warning(message || messages.warning.general, {
      timeout: 5000,
      hideProgressBar: false,
      closeButton: true,
      icon: true,
      ...options
    })
    // Ensure theme is applied to new toast
    setTimeout(() => forceUpdateTheme(), 50)
  }

  // Info toast
  const showInfo = (message?: string, options?: ToastOptions) => {
    toast.info(message || messages.info.general, {
      timeout: 4000,
      hideProgressBar: false,
      closeButton: false,
      icon: true,
      ...options
    })
    // Ensure theme is applied to new toast
    setTimeout(() => forceUpdateTheme(), 50)
  }

  // Predefined toast functions
  const toastSuccess = {
    copy: () => showSuccess(messages.success.copy),
    save: () => showSuccess(messages.success.save),
    reset: () => showSuccess(messages.success.reset),
    upload: () => showSuccess(messages.success.upload),
    calculate: () => showSuccess(messages.success.calculate)
  }

  const toastError = {
    copy: () => showError(messages.error.copy),
    save: () => showError(messages.error.save),
    upload: () => showError(messages.error.upload),
    network: () => showError(messages.error.network),
    validation: () => showError(messages.error.validation)
  }

  const toastWarning = {
    validation: () => showWarning(messages.warning.validation),
    limit: () => showWarning(messages.warning.limit),
    noData: () => showWarning(messages.warning.noData)
  }

  const toastInfo = {
    processing: () => showInfo(messages.info.processing),
    loading: () => showInfo(messages.info.loading)
  }

  // Copy to clipboard with toast
  const copyToClipboard = async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccess(successMessage || messages.success.copy)
      return true
    } catch (error) {
      console.error('Copy failed:', error)
      showError(messages.error.copy)
      return false
    }
  }

  // Clear all toasts
  const clearAll = () => {
    toast.clear()
  }

  return {
    // Basic toast functions
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Predefined toast functions
    toastSuccess,
    toastError,
    toastWarning,
    toastInfo,
    
    // Utility functions
    copyToClipboard,
    clearAll,
    
    // Messages object for custom usage
    messages
  }
}
