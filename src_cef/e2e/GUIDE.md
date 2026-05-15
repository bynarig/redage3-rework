# E2E Tests — Playwright Guide

## Running

```bash
# from src_cef_new/
pnpm test:e2e                    # headless Chromium
pnpm test:e2e --headed           # watch the browser
pnpm test:e2e --ui               # Playwright UI mode (best for debugging)
pnpm test:e2e --debug            # step through with DevTools
npx playwright show-report       # open last HTML report
```

The dev server starts automatically. If it's already running on 5173 it will be reused.

---

## File Layout

```
e2e/
  vue.spec.ts    ← smoke tests (app loads, router is wired)
  GUIDE.md       ← this file
  <feature>.spec.ts  ← one file per major user flow
```

---

## 1. Basic Page Test

```ts
import { test, expect } from '@playwright/test'

test('page title is set', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/RedAge/)
})
```

---

## 2. Opening a Popup via window.router

RAGE:MP triggers the UI by calling `window.router.setPopUp(name, data)`.
In E2E tests, call it via `page.evaluate()`:

```ts
test('PopupConfirm renders a confirm button', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.evaluate(() =>
    (window as any).router.setPopUp('PopupConfirm', { text: 'Delete character?' })
  )

  await expect(page.locator('text=Delete character?')).toBeVisible()
  await expect(page.locator('button.confirm')).toBeEnabled()
})
```

---

## 3. Emitting a Mock Event (mp_mock.emit)

The dev server includes `mp-mock.ts` which exposes `window.mp_mock.emit()`.
Use it to simulate game-server → CEF messages:

```ts
test('HUD updates after a player sync event', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')

  await page.evaluate(() =>
    (window as any).mp_mock.emit('client.hud.update', JSON.stringify({ health: 50, armour: 0 }))
  )

  await expect(page.locator('.hud-health')).toHaveText('50')
})
```

---

## 4. Assertions

```ts
// Visibility
await expect(locator).toBeVisible()
await expect(locator).toBeHidden()

// Text
await expect(locator).toHaveText('exact text')
await expect(locator).toContainText('partial')

// Input value
await expect(locator).toHaveValue('hello')

// Count
await expect(page.locator('.item')).toHaveCount(5)

// Attribute
await expect(locator).toHaveAttribute('disabled', '')

// URL
await expect(page).toHaveURL(/\/dashboard/)
```

---

## 5. Interactions

```ts
await page.locator('button.confirm').click()
await page.locator('input[name=amount]').fill('1000')
await page.locator('input[name=amount]').press('Enter')
await page.locator('select').selectOption('RUB')
await page.keyboard.press('Escape')
```

---

## 6. Waiting Strategies

```ts
// Wait for an element to appear (up to timeout)
await page.locator('.popup').waitFor({ state: 'visible' })

// Wait for network requests to settle
await page.waitForLoadState('networkidle')

// Wait for a specific request
const response = await page.waitForResponse('**/api/player')

// Wait for a condition in the page
await page.waitForFunction(() => (window as any).router?.view === 'PlayerAtm')
```

---

## 7. Screenshots and Traces

```ts
// Inline screenshot assertion
await expect(page).toHaveScreenshot('popup-confirm.png')

// Manual snapshot for debugging
await page.screenshot({ path: 'debug.png', fullPage: true })
```

Traces are captured automatically on first retry (configured in `playwright.config.ts`).
View them with `npx playwright show-trace trace.zip`.

---

## 8. Page Object Pattern (for large test suites)

```ts
// e2e/pages/roulette.page.ts
export class RoulettePage {
  constructor(private page: Page) {}

  async open(caseIndex: number) {
    await this.page.evaluate((i) =>
      (window as any).router.setPopUp('PopupRoulette', i), caseIndex
    )
  }

  async spinButton() {
    return this.page.locator('.roulette__spin-btn')
  }

  async waitForResult() {
    await this.page.locator('.popupprise').waitFor({ state: 'visible' })
  }
}

// e2e/roulette.spec.ts
test('spin shows a prize popup', async ({ page }) => {
  const roulette = new RoulettePage(page)
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await roulette.open(0)
  await (await roulette.spinButton()).click()
  await roulette.waitForResult()
})
```
