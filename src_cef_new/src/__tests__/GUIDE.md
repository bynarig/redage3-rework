# CEF (Vue 3) — Testing Guide

## Stack

| Tool | Role |
|------|------|
| **Vitest** | Unit/integration test runner |
| **@vue/test-utils** | Mount Vue components in jsdom |
| **Pinia** | Real stores (use `createPinia()` per test) |
| **ts-mockito** | Mockito-style class/interface mocking |
| **Playwright** | End-to-end browser tests (`e2e/`) |

## Running Tests

```bash
# from src_cef_new/
pnpm test:unit           # single run
pnpm test:unit --watch   # watch mode
pnpm test:e2e            # Playwright (starts dev server automatically)
```

Or from root:
```bash
pnpm test                # runs Vitest across all workspaces
```

---

## File Layout

```
src/
  __tests__/
    unit/
      router-store.spec.ts   ← Pinia store tests
      api-rage.spec.ts       ← api/* + ts-mockito examples
    App.spec.ts              ← smoke test for App.vue
    GUIDE.md                 ← this file
e2e/
  vue.spec.ts                ← Playwright example
  GUIDE.md                   ← Playwright guide
```

---

## 1. Pinia Store Tests

Always create a fresh Pinia in `beforeEach` to isolate state between tests.

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRouterStore } from '@/stores/router'

describe('useRouterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('sets a view and clears popup', () => {
    const store = useRouterStore()
    store.setPopUp('PopupConfirm')
    store.setView('PlayerAuthentication')

    expect(store.view).toBe('PlayerAuthentication')
    expect(store.popup).toBe('')
  })
})
```

---

## 2. Vue Component Tests

```ts
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import MyComponent from '@/components/MyComponent.vue'

it('renders the label prop', () => {
  const wrapper = mount(MyComponent, {
    props: { label: 'Click me' },
    global: { plugins: [createPinia()] },
  })

  expect(wrapper.text()).toContain('Click me')
})

it('emits an event on button click', async () => {
  const wrapper = mount(MyComponent, { global: { plugins: [createPinia()] } })
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted('submit')).toHaveLength(1)
})

it('updates after a prop change', async () => {
  const wrapper = mount(MyComponent, { props: { count: 1 }, global: { plugins: [createPinia()] } })
  await wrapper.setProps({ count: 5 })
  expect(wrapper.find('.count').text()).toBe('5')
})
```

### Useful @vue/test-utils APIs

| Method | What it does |
|--------|-------------|
| `mount(Component, opts)` | Full mount with children |
| `shallowMount(Component, opts)` | Stub all child components |
| `wrapper.find(selector)` | First matching element |
| `wrapper.findAll(selector)` | All matching elements |
| `wrapper.trigger('click')` | Trigger a DOM event (returns Promise) |
| `wrapper.setValue('text')` | Set input value + trigger input/change |
| `wrapper.setProps(obj)` | Update props (returns Promise) |
| `wrapper.emitted('event')` | Array of emitted event payloads |
| `wrapper.vm` | Access the component instance |
| `wrapper.html()` | Rendered HTML string |
| `wrapper.unmount()` | Cleanup — call in afterEach if needed |

---

## 3. Mocking with `vi.fn()` and `vi.mock()`

```ts
import { vi } from 'vitest'

// Stub a module — must be at the TOP of the file (hoisted by Vitest)
vi.mock('@/api/rage', () => ({
  executeClient: vi.fn(),
  executeClientAsync: vi.fn().mockResolvedValue(null),
}))

import { executeClient } from '@/api/rage'

it('calls executeClient when the button is clicked', async () => {
  const wrapper = mount(MyPopup, { global: { plugins: [createPinia()] } })
  await wrapper.find('.confirm-btn').trigger('click')
  expect(executeClient).toHaveBeenCalledWith('client.confirm', expect.any(Number))
})
```

---

## 4. Mocking with ts-mockito (class/interface mocks)

```ts
import { mock, when, instance, verify, anything } from 'ts-mockito'

interface TranslationService {
  translate(...keys: string[]): string
}

it('renders translated text', () => {
  const mockedI18n = mock<TranslationService>()
  when(mockedI18n.translate('popups', 'confirm')).thenReturn('Подтвердить')

  const i18n = instance(mockedI18n)
  expect(i18n.translate('popups', 'confirm')).toBe('Подтвердить')

  verify(mockedI18n.translate('popups', 'confirm')).once()
})
```

### ts-mockito cheat-sheet

| API | What it does |
|-----|-------------|
| `mock<T>()` | Create mock — real methods are NOT called |
| `instance(m)` | Get the object to inject into code under test |
| `when(m.fn(...)).thenReturn(v)` | Stub return value |
| `when(m.fn(...)).thenResolve(v)` | Stub async return value |
| `when(m.fn(...)).thenThrow(err)` | Stub thrown error |
| `verify(m.fn(...)).once()` | Assert called exactly once |
| `verify(m.fn(...)).never()` | Assert never called |
| `verify(m.fn(...)).times(n)` | Assert called n times |
| `capture(m.fn).last()` | Get last call arguments as a tuple |
| `anything()` | Wildcard matcher |
| `anyString()` / `anyNumber()` | Typed wildcard matchers |

---

## 5. Testing RAGE:MP window Bridge

Code that calls `window.mp.trigger` or `window.router.*` can be tested by
setting up a mock on the window object directly.

```ts
import { vi, beforeEach } from 'vitest'

beforeEach(() => {
  ;(window as any).mp = { trigger: vi.fn() }
  ;(window as any).router = { setPopUp: vi.fn(), setHud: vi.fn() }
})

it('calls window.router.setPopUp when popup opens', async () => {
  const wrapper = mount(MyComponent, { global: { plugins: [createPinia()] } })
  await wrapper.find('.close-btn').trigger('click')
  expect((window as any).router.setPopUp).toHaveBeenCalledWith('')
})
```

---

## 6. Async Component Tests

```ts
it('shows a spinner while loading', async () => {
  const wrapper = mount(AsyncList, { global: { plugins: [createPinia()] } })
  expect(wrapper.find('.spinner').exists()).toBe(true)

  await flushPromises()  // from @vue/test-utils — drains all promises
  expect(wrapper.find('.spinner').exists()).toBe(false)
  expect(wrapper.findAll('.list-item')).toHaveLength(3)
})
```

---

## 7. What NOT to Test

- Vue's own reactivity — trust the framework
- CSS classes or inline styles unless they encode business logic
- Implementation details like internal `ref` values — test via the DOM or emitted events
- `window.router` wiring in `App.vue` — covered by E2E
