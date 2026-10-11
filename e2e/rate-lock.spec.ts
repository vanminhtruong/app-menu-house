import { test, expect } from '@playwright/test'

// Nút khoá nằm bên phải ô đơn giá: bấm vào -> input mờ + không sửa được; bấm lại -> rõ như cũ.
test.describe('Khoá đơn giá điện & nước', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear())
    await page.goto('/')
    await page.locator('#electricity-rate').waitFor({ state: 'visible', timeout: 20000 })
  })

  const cases = [
    { name: 'điện', inputId: 'electricity-rate', testId: 'electricity-rate-lock', rate: 4000 },
    { name: 'nước', inputId: 'water-rate', testId: 'water-rate-lock', rate: 30000 },
  ] as const

  for (const c of cases) {
    test(`${c.name}: khoá thì input disable + mờ, mở khoá thì rõ lại`, async ({ page }) => {
      const input = page.locator('#' + c.inputId)
      const btn = page.locator(`[data-testid="${c.testId}"]`)

      // Mặc định: đang mở, chỉnh được
      await expect(input).toHaveValue(String(c.rate))
      await expect(input).toBeEnabled()
      await expect(btn).toHaveAttribute('aria-checked', 'false')

      // Bấm khoá
      await btn.click()
      await expect(btn).toHaveAttribute('aria-checked', 'true')
      await expect(input).toBeDisabled()
      await expect
        .poll(() => input.evaluate((el) => Number(getComputedStyle(el).opacity)))
        .toBe(0.5)
      await expect
        .poll(() => input.evaluate((el) => getComputedStyle(el).filter))
        .toContain('grayscale')

      // Đang khoá thì không gõ được
      await input.click({ force: true })
      await page.keyboard.type('999')
      await expect(input).toHaveValue(String(c.rate))

      // Mở khoá lại
      await btn.click()
      await expect(btn).toHaveAttribute('aria-checked', 'false')
      await expect(input).toBeEnabled()
      await expect
        .poll(() => input.evaluate((el) => Number(getComputedStyle(el).opacity)))
        .toBe(1)
      await expect
        .poll(() => input.evaluate((el) => getComputedStyle(el).filter))
        .toBe('none')
    })
  }
})
