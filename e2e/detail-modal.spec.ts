import { test, expect } from '@playwright/test'

// Hồi quy: modal "Xem Chi Tiết" phải cuộn BÊN TRONG nó (thanh cuộn tuỳ biến .pd-scroll)
// chứ không được đẩy/kéo cuộn nền của desktop.
test.describe('Modal chi tiết – hành vi cuộn', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 600 })
    await page.addInitScript(() => window.localStorage.clear())
    await page.goto('/')
    await page.locator('#electricity-old').waitFor({ state: 'visible', timeout: 20000 })
  })

  test('cuộn trong modal, nền desktop đứng yên', async ({ page }) => {
    await page.getByRole('button', { name: 'Dữ liệu mẫu' }).click()
    await page.getByRole('button', { name: 'Xem Chi Tiết' }).click()

    const content = page.locator('.pd-scroll:not(.pd-scroll--stable)')
    await expect(content).toBeVisible()

    // Nội dung modal phải tràn ra thì mới kiểm tra được cuộn
    const overflow = await content.evaluate((el) => el.scrollHeight > el.clientHeight)
    expect(overflow).toBe(true)

    const before = await content.evaluate((el) => el.scrollTop)
    await content.hover()
    await page.mouse.wheel(0, 600)

    await expect
      .poll(async () => content.evaluate((el) => el.scrollTop))
      .toBeGreaterThan(before)

    // Nền (vùng cuộn của app + window) không được dịch chuyển
    expect(await page.locator('.pd-scroll--stable').evaluate((el) => el.scrollTop)).toBe(0)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)

    // Bấm ra nền đóng được modal
    await page.mouse.click(30, 300)
    await expect(content).toBeHidden()
  })
})
