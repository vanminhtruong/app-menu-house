import type { App } from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Cấu hình toast chuyên nghiệp
export const toastOptions: PluginOptions = {
  // Vị trí hiển thị toast
  position: POSITION.TOP_RIGHT,
  
  // Thời gian hiển thị (ms)
  timeout: 4000,
  
  // Đóng khi click
  closeOnClick: true,
  
  // Tạm dừng khi hover
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  
  // Hiển thị nút đóng
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  
  // Icon mặc định
  icon: true,
  
  // Transition effects
  transition: "Vue-Toastification__bounce",
  
  // Số lượng toast tối đa
  maxToasts: 5,
  
  // Loại bỏ toast trùng lặp
  newestOnTop: true,
  
  // Cấu hình container
  container: document.body,
  
  // Custom styling cho dark/light mode
  toastClassName: "custom-toast",
  bodyClassName: ["custom-toast-body"],
  
  // Cấu hình cho từng loại toast
  toastDefaults: {
    // Success toast
    success: {
      timeout: 3000,
      hideProgressBar: false,
      icon: true,
      closeButton: false,
    },
    // Error toast
    error: {
      timeout: 6000,
      hideProgressBar: false,
      icon: true,
      closeButton: true,
    },
    // Warning toast
    warning: {
      timeout: 5000,
      hideProgressBar: false,
      icon: true,
      closeButton: true,
    },
    // Info toast
    info: {
      timeout: 4000,
      hideProgressBar: false,
      icon: true,
      closeButton: false,
    },
  },
}

// Plugin installation function
export default function installToast(app: App) {
  app.use(Toast, toastOptions)
}

// CSS tùy chỉnh cho toast
export const toastCustomCSS = `
/* Custom toast styling */
.custom-toast {
  border-radius: 8px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  font-family: inherit !important;
  font-size: 14px !important;
  backdrop-filter: blur(10px) !important;
}

.custom-toast-body {
  font-weight: 500 !important;
  line-height: 1.4 !important;
}

/* Dark mode support */
.dark-mode .Vue-Toastification__toast {
  background-color: #374151 !important;
  color: #f9fafb !important;
  border: 1px solid #4b5563 !important;
}

.dark-mode .Vue-Toastification__toast--success {
  background-color: #065f46 !important;
  border-color: #10b981 !important;
}

.dark-mode .Vue-Toastification__toast--error {
  background-color: #7f1d1d !important;
  border-color: #ef4444 !important;
}

.dark-mode .Vue-Toastification__toast--warning {
  background-color: #78350f !important;
  border-color: #f59e0b !important;
}

.dark-mode .Vue-Toastification__toast--info {
  background-color: #1e3a8a !important;
  border-color: #3b82f6 !important;
}

/* Progress bar styling */
.Vue-Toastification__progress-bar {
  height: 3px !important;
}

/* Animation improvements */
.Vue-Toastification__bounce-enter-active {
  animation-duration: 0.4s !important;
}

.Vue-Toastification__bounce-leave-active {
  animation-duration: 0.3s !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .Vue-Toastification__container {
    width: 100vw !important;
    padding: 0 16px !important;
  }
  
  .custom-toast {
    margin-bottom: 8px !important;
    border-radius: 6px !important;
  }
}
`
