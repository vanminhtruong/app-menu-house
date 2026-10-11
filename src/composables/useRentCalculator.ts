import { ref, computed, watch } from 'vue'
import { useToast } from './useToast'
import { useI18n } from 'vue-i18n'

// Tiền nhà là TIỀN CỐ ĐỊNH (không nhập ở form nữa):
// 2.400.000 đ/tháng → 7.200.000 đ cho 3 tháng.
// Đổi số ở đây là đổi cho toàn app: form, Tổng, modal chi tiết và bản ghi đã lưu.
export const FIXED_MONTHLY_RENT = 2400000
export const FIXED_QUARTERLY_RENT = FIXED_MONTHLY_RENT * 3

// Khoá localStorage ghi nhớ trạng thái bật/tắt "cộng tiền nhà vào tổng"
export const RENT_INCLUDED_KEY = 'rent_included'

// Mặc định BẬT để giữ nguyên hành vi cũ (tiền nhà luôn được cộng vào tổng)
const readIncludeRent = (): boolean => {
  try {
    const stored = localStorage.getItem(RENT_INCLUDED_KEY)
    return stored === null ? true : stored === '1'
  } catch {
    return true
  }
}

export function useRentCalculator() {
  const { toastSuccess } = useToast()
  const { t } = useI18n()

  // State: luôn giữ đúng con số cố định
  const monthlyRent = ref<number>(FIXED_MONTHLY_RENT)

  // Công tắc "cộng tiền nhà vào tổng":
  // BẬT  → mục tiền nhà rõ, chi tiết + tổng cộng có tiền nhà.
  // TẮT  → mục tiền nhà bị làm mờ, chi tiết + tổng cộng KHÔNG có tiền nhà.
  const includeRent = ref<boolean>(readIncludeRent())

  // Chặn mọi nguồn thay đổi (ô nhập ở form, tải bản ghi cũ từ Quản lý dữ liệu)
  // để tiền nhà không bao giờ lệch khỏi con số cố định.
  watch(monthlyRent, (newVal) => {
    if (newVal !== FIXED_MONTHLY_RENT) {
      monthlyRent.value = FIXED_MONTHLY_RENT
    }
  })

  // Ghi nhớ lựa chọn bật/tắt giữa các lần tải trang
  watch(includeRent, (newVal) => {
    try {
      localStorage.setItem(RENT_INCLUDED_KEY, newVal ? '1' : '0')
    } catch {
      // Bỏ qua khi môi trường không có localStorage
    }
  })

  // Computed values
  // Chỉ trả tiền nhà khi công tắc đang BẬT, nhờ vậy mọi nơi dùng
  // quarterlyRent (Tổng, modal chi tiết, tổng chi phí, bản ghi) đều tự đúng.
  const quarterlyRent = computed(() =>
    includeRent.value ? FIXED_QUARTERLY_RENT : 0
  )

  // Methods
  const setIncludeRent = (value: boolean) => {
    includeRent.value = Boolean(value)
  }

  const toggleRent = () => {
    includeRent.value = !includeRent.value
  }

  const resetRent = () => {
    // "Làm Mới" không xoá tiền nhà vì đây là khoản cố định
    monthlyRent.value = FIXED_MONTHLY_RENT
    console.log('🏠 Làm mới form — tiền nhà vẫn cố định:', FIXED_MONTHLY_RENT)
  }

  const fillRentSampleData = () => {
    monthlyRent.value = FIXED_MONTHLY_RENT
    // Dữ liệu mẫu luôn minh hoạ đầy đủ nên bật lại tiền nhà
    includeRent.value = true
    console.log(
      `🏠 Tiền nhà cố định: ${FIXED_MONTHLY_RENT} VND/tháng (3 tháng = ${FIXED_QUARTERLY_RENT} VND)`
    )
  }

  const validateRent = () => {
    if (!monthlyRent.value || monthlyRent.value <= 0) {
      console.warn('⚠️ Vui lòng nhập tiền nhà hợp lệ!')
      return false
    }
    return true
  }

  return {
    // State
    monthlyRent,
    includeRent,

    // Computed
    quarterlyRent,

    // Methods
    setIncludeRent,
    toggleRent,
    resetRent,
    fillRentSampleData,
    validateRent
  }
}
