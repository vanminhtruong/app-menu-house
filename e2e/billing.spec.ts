import { test, expect } from '@playwright/test'

const money = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + ' ₫'

// Kịch bản chuẩn:
// Điện: (13820 - 13626) = 194 kWh × 4000  = 776.000 ₫
// Nước: (284   - 276)   = 8   m³  × 30000 = 240.000 ₫
// Điện + nước                             = 1.016.000 ₫
// Tiền nhà 3 tháng (mặc định đang bật)    = 7.200.000 ₫
// TỔNG CỘNG                               = 8.216.000 ₫
const ELEC_OLD = 13626
const ELEC_NEW = 13820
const ELEC_RATE = 4000
const ELEC_USAGE = ELEC_NEW - ELEC_OLD
const ELEC_TOTAL = ELEC_USAGE * ELEC_RATE

const WATER_OLD = 276
const WATER_NEW = 284
const WATER_RATE = 30000
const WATER_USAGE = WATER_NEW - WATER_OLD
const WATER_TOTAL = WATER_USAGE * WATER_RATE

const RENT_QUARTERLY = 7200000

test.describe('Tính tiền điện & nước', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear())
    await page.goto('/')
    // Chờ LazyLoader (delay 1s) render xong form
    await page.locator('#electricity-old').waitFor({ state: 'visible', timeout: 20000 })
  })

  test('tiền điện = (số mới - số cũ) × đơn giá', async ({ page }) => {
    await page.fill('#electricity-old', String(ELEC_OLD))
    await page.fill('#electricity-new', String(ELEC_NEW))
    await page.getByPlaceholder('Đơn giá điện').fill(String(ELEC_RATE))

    // Công thức hiển thị đúng
    await expect(
      page.getByText(`(${ELEC_NEW} - ${ELEC_OLD}) × ${ELEC_RATE} = ${money(ELEC_TOTAL)}`, { exact: false })
    ).toBeVisible()

    // Thành tiền xuất hiện trong khối kết quả điện
    await expect(page.getByText(money(ELEC_TOTAL), { exact: true }).first()).toBeVisible()
  })

  test('tiền nước = (số mới - số cũ) × đơn giá', async ({ page }) => {
    await page.fill('#water-old', String(WATER_OLD))
    await page.fill('#water-new', String(WATER_NEW))
    await page.getByPlaceholder('Đơn giá nước').fill(String(WATER_RATE))

    await expect(
      page.getByText(`(${WATER_NEW} - ${WATER_OLD}) × ${WATER_RATE} = ${money(WATER_TOTAL)}`, { exact: false })
    ).toBeVisible()
    await expect(page.getByText(money(WATER_TOTAL), { exact: true }).first()).toBeVisible()
  })

  test('tổng hợp cộng đúng điện + nước + tiền nhà', async ({ page }) => {
    await page.fill('#electricity-old', String(ELEC_OLD))
    await page.fill('#electricity-new', String(ELEC_NEW))
    await page.getByPlaceholder('Đơn giá điện').fill(String(ELEC_RATE))

    await page.fill('#water-old', String(WATER_OLD))
    await page.fill('#water-new', String(WATER_NEW))
    await page.getByPlaceholder('Đơn giá nước').fill(String(WATER_RATE))

    // TotalSummary liệt kê từng khoản
    await expect(page.getByText(money(ELEC_TOTAL), { exact: true }).first()).toBeVisible()
    await expect(page.getByText(money(WATER_TOTAL), { exact: true }).first()).toBeVisible()
    await expect(page.getByText(money(RENT_QUARTERLY), { exact: true }).first()).toBeVisible()

    // Tổng cuối cùng = điện + nước + tiền nhà quý
    const grandTotal = ELEC_TOTAL + WATER_TOTAL + RENT_QUARTERLY
    await expect(page.getByText(money(grandTotal), { exact: true }).first()).toBeVisible()
  })

  test('số mới nhỏ hơn số cũ thì thành tiền bằng 0 (không tính âm)', async ({ page }) => {
    await page.fill('#electricity-old', '1000')
    await page.fill('#electricity-new', '900')
    await page.getByPlaceholder('Đơn giá điện').fill('4000')

    await expect(page.getByText('(900 - 1000) × 4000 = 0 ₫', { exact: false })).toBeVisible()
  })

  test('đổi đơn giá thì thành tiền cập nhật theo', async ({ page }) => {
    await page.fill('#electricity-old', '100')
    await page.fill('#electricity-new', '200')
    await page.getByPlaceholder('Đơn giá điện').fill('3500')
    await expect(page.getByText('(200 - 100) × 3500 = 350.000 ₫', { exact: false })).toBeVisible()

    await page.getByPlaceholder('Đơn giá điện').fill('5000')
    await expect(page.getByText('(200 - 100) × 5000 = 500.000 ₫', { exact: false })).toBeVisible()
  })

  test('dữ liệu mẫu cho ra đúng con số kỳ vọng', async ({ page }) => {
    // Nút "Dữ liệu mẫu" điền điện 13626 -> 13820, nước 276 -> 284, đơn giá mặc định
    await page.getByRole('button', { name: 'Dữ liệu mẫu' }).click()

    await expect(page.locator('#electricity-old')).toHaveValue('13626')
    await expect(page.locator('#electricity-new')).toHaveValue('13820')
    await expect(page.locator('#water-old')).toHaveValue('276')
    await expect(page.locator('#water-new')).toHaveValue('284')

    await expect(page.getByText(money(ELEC_TOTAL), { exact: true }).first()).toBeVisible()
    await expect(page.getByText(money(WATER_TOTAL), { exact: true }).first()).toBeVisible()
  })
})
