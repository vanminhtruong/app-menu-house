import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({ t: (_key: string, fallback?: string) => fallback ?? _key })
}))

vi.mock('../useToast', () => ({
  useToast: () => ({ toastSuccess: { reset: () => {} } })
}))

import {
  useRentCalculator,
  FIXED_MONTHLY_RENT,
  FIXED_QUARTERLY_RENT,
  RENT_INCLUDED_KEY
} from '../useRentCalculator'

describe('useRentCalculator – công tắc cộng tiền nhà', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('mặc định bật: tiền nhà cố định được cộng vào tổng', () => {
    const rent = useRentCalculator()

    expect(rent.includeRent.value).toBe(true)
    expect(rent.monthlyRent.value).toBe(FIXED_MONTHLY_RENT)
    expect(rent.quarterlyRent.value).toBe(FIXED_QUARTERLY_RENT)
  })

  it('tắt công tắc thì tổng tiền nhà về 0 (không cộng vào chi tiết)', () => {
    const rent = useRentCalculator()

    rent.setIncludeRent(false)

    expect(rent.includeRent.value).toBe(false)
    expect(rent.quarterlyRent.value).toBe(0)
    // Tiền nhà cố định vẫn hiển thị ở ô nhập, chỉ không cộng vào tổng
    expect(rent.monthlyRent.value).toBe(FIXED_MONTHLY_RENT)
  })

  it('bật lại thì tổng tiền nhà trở về đúng hằng số', () => {
    const rent = useRentCalculator()

    rent.setIncludeRent(false)
    expect(rent.quarterlyRent.value).toBe(0)

    rent.setIncludeRent(true)
    expect(rent.includeRent.value).toBe(true)
    expect(rent.quarterlyRent.value).toBe(FIXED_QUARTERLY_RENT)
  })

  it('toggleRent đảo trạng thái qua lại', () => {
    const rent = useRentCalculator()

    rent.toggleRent()
    expect(rent.includeRent.value).toBe(false)
    expect(rent.quarterlyRent.value).toBe(0)

    rent.toggleRent()
    expect(rent.includeRent.value).toBe(true)
    expect(rent.quarterlyRent.value).toBe(FIXED_QUARTERLY_RENT)
  })

  it('ghi nhớ trạng thái tắt vào localStorage', async () => {
    const rent = useRentCalculator()

    rent.setIncludeRent(false)
    await nextTick()

    expect(localStorage.getItem(RENT_INCLUDED_KEY)).toBe('0')
  })

  it('đọc lại trạng thái đã lưu khi khởi tạo', () => {
    localStorage.setItem(RENT_INCLUDED_KEY, '0')

    const rent = useRentCalculator()

    expect(rent.includeRent.value).toBe(false)
    expect(rent.quarterlyRent.value).toBe(0)
  })

  it('không cho tiền nhà lệch khỏi hằng số cố định', async () => {
    const rent = useRentCalculator()

    rent.monthlyRent.value = 999
    await nextTick()

    expect(rent.monthlyRent.value).toBe(FIXED_MONTHLY_RENT)
    expect(rent.quarterlyRent.value).toBe(FIXED_QUARTERLY_RENT)
  })
})
