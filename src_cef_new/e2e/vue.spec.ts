import { test, expect } from '@playwright/test'

test('app loads without JS errors', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (err) => errors.push(err.message))

  await page.goto('/')
  await page.waitForLoadState('networkidle')

  expect(errors).toHaveLength(0)
})

test('window.router is exposed after mount', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  const hasRouter = await page.evaluate(() => typeof (window as any).router?.setPopUp === 'function')
  expect(hasRouter).toBe(true)
})

test('setPopUp shows a popup component', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.evaluate(() => (window as any).router.setPopUp('PopupConfirm', {}))
  // PopusContainer becomes visible when a popup is active
  await expect(page.locator('#popuscontainer, [data-popup]').first()).toBeVisible({ timeout: 2000 })
})
