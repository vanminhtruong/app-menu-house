import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import RentCalculator from '../RentCalculator.vue'
import DetailModal from '../DetailModal.vue'
import vi from '../../locales/vi.json'

const makeI18n = () =>
  createI18n({ legacy: false, locale: 'vi', messages: { vi } })

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value)

const FIXED_MONTHLY_RENT = 2400000
const FIXED_QUARTERLY_RENT = 7200000

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('RentCalculator – công tắc làm mờ / làm rõ tiền nhà', () => {
  const mountRent = (includeRent: boolean) =>
    mount(RentCalculator, {
      props: {
        monthlyRent: FIXED_MONTHLY_RENT,
        quarterlyRent: includeRent ? FIXED_QUARTERLY_RENT : 0,
        includeRent,
        formatCurrency
      },
      global: { plugins: [makeI18n()] }
    })

  it('khi TẮT: mục tiền nhà bị làm mờ và có nhắc không cộng vào tổng', () => {
    const wrapper = mountRent(false)

    expect(wrapper.get('[data-testid="rent-section"]').classes()).toContain('opacity-40')
    expect(wrapper.get('[data-testid="rent-section"]').classes()).toContain('grayscale')
    expect(wrapper.find('[data-testid="rent-excluded-hint"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="rent-toggle"]').attributes('aria-checked')).toBe('false')
  })

  it('khi BẬT: mục tiền nhà rõ, không còn nhắc tắt', () => {
    const wrapper = mountRent(true)

    expect(wrapper.get('[data-testid="rent-section"]').classes()).toContain('opacity-100')
    expect(wrapper.get('[data-testid="rent-section"]').classes()).not.toContain('opacity-40')
    expect(wrapper.find('[data-testid="rent-excluded-hint"]').exists()).toBe(false)
    expect(wrapper.get('[data-testid="rent-toggle"]').attributes('aria-checked')).toBe('true')
  })

  it('bấm công tắc sẽ phát sự kiện đảo trạng thái', async () => {
    const wrapper = mountRent(true)

    await wrapper.get('[data-testid="rent-toggle"]').trigger('click')

    expect(wrapper.emitted('update:include-rent')?.[0]).toEqual([false])
  })

  it('khi TẮT: tổng 3 tháng hiển thị gạch ngang để biết không được cộng', () => {
    const wrapper = mountRent(false)

    const struck = wrapper.findAll('span.line-through')
    expect(struck.length).toBeGreaterThan(0)
    expect(struck[0].text()).toContain(formatCurrency(FIXED_QUARTERLY_RENT))
  })
})

describe('DetailModal – chỉ cộng tiền nhà khi công tắc BẬT', () => {
  const mountModal = (quarterlyRent: number) =>
    mount(DetailModal, {
      props: {
        showDetailModal: true,
        currentDate: '01/01/2025',
        electricityOld: 100,
        electricityNew: 200,
        electricityRate: 3000,
        electricityUsage: 100,
        electricityTotal: 300000,
        waterOld: 10,
        waterNew: 20,
        waterRate: 10000,
        waterUsage: 10,
        waterTotal: 100000,
        monthlyRent: FIXED_MONTHLY_RENT,
        quarterlyRent,
        totalBill: 400000 + quarterlyRent,
        formatCurrency
      },
      global: { plugins: [makeI18n()] }
    })

  it('có tiền nhà trong chi tiết khi quarterlyRent > 0', () => {
    const wrapper = mountModal(FIXED_QUARTERLY_RENT)
    const text = wrapper.text()

    expect(text).toContain('Tiền Nhà')
    expect(text).toContain(formatCurrency(FIXED_QUARTERLY_RENT))
    expect(text).toContain(formatCurrency(400000 + FIXED_QUARTERLY_RENT))
  })

  it('không có tiền nhà trong chi tiết khi quarterlyRent = 0', () => {
    const wrapper = mountModal(0)
    const text = wrapper.text()

    expect(text).not.toContain('Tiền Nhà')
    expect(text).toContain('Tổng Điện Nước')
    expect(text).not.toContain('Tổng Điện Nước + Tiền Nhà')
    expect(text).toContain(formatCurrency(400000))
  })
})
