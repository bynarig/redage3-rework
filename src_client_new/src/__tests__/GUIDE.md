# Client Scripts — Testing Guide

## Stack

| Tool | Role |
|------|------|
| **Vitest** | Test runner + assertions |
| **ts-mockito** | Mockito-style class/interface mocking |
| `vi.fn()` / `vi.mock()` | Lightweight function & module mocking (built-in) |

## Running Tests

```bash
pnpm test              # single run
pnpm test:watch        # watch mode (re-runs on save)
pnpm test:coverage     # coverage report in ./coverage/
```

---

## File Layout

```
src/
  __tests__/
    setup/
      mp-globals.ts   ← stubs for window.mp.* — auto-loaded before every test
    unit/
      helpers.spec.ts ← example: pure-function tests
    GUIDE.md          ← this file
  modules/
    player/
      player.spec.ts  ← co-locate tests next to the module they cover
```

Both locations work. Co-locating (`module.spec.ts` next to `module.ts`) is
preferred for new code; `__tests__/unit/` is for shared or cross-cutting tests.

---

## 1. Pure-Function Tests (no mocks needed)

```ts
import { describe, it, expect } from 'vitest'
import { escapeHtml } from '@/src/utils/helpers'

describe('escapeHtml', () => {
  it('escapes < and >', () => {
    expect(escapeHtml('<b>hi</b>')).toBe('&lt;b&gt;hi&lt;&#x2F;b&gt;')
  })
})
```

Rules:
- One `describe` per module/class
- One behaviour per `it` — keep assertions focused
- Use `it.each` for tables of inputs/outputs

---

## 2. Mocking with `vi.fn()` (inline function stubs)

Use this when you need to replace a specific function call and inspect it.

```ts
import { vi, expect } from 'vitest'

const callback = vi.fn()
callback('hello')

expect(callback).toHaveBeenCalledOnce()
expect(callback).toHaveBeenCalledWith('hello')
expect(callback).toHaveReturnedWith(undefined)

// Reset between tests
vi.clearAllMocks()        // clears call history
vi.resetAllMocks()        // also resets implementations
vi.restoreAllMocks()      // also restores vi.spyOn originals
```

---

## 3. Mocking with `vi.mock()` (replace a whole module)

```ts
import { vi, describe, it, expect } from 'vitest'

// Must be at the top level — Vitest hoists this call.
vi.mock('@/src/utils/helpers', () => ({
  antiFlood: vi.fn(() => true),
  escapeHtml: vi.fn((v) => v),
}))

import { antiFlood } from '@/src/utils/helpers'

describe('module that uses antiFlood', () => {
  it('calls antiFlood with the right key', () => {
    antiFlood('my-key', 500)
    expect(antiFlood).toHaveBeenCalledWith('my-key', 500)
  })
})
```

---

## 4. Mocking RAGE:MP globals (`mp.*`)

The `setup/mp-globals.ts` file runs before every test and installs a minimal
stub on `globalThis.mp`. Import `mpStub` to configure return values per test.

```ts
import { beforeEach, vi } from 'vitest'
import { mpStub } from '../setup/mp-globals'

beforeEach(() => {
  vi.clearAllMocks()
})

it('triggers a client event', () => {
  myModule.doSomething()                       // internally calls mp.trigger(...)
  expect(mpStub.trigger).toHaveBeenCalledWith('client.someEvent', 42)
})
```

To stub a return value for a single test:

```ts
mpStub.game.streaming.hasModelLoaded.mockReturnValue(false)
mpStub.game.streaming.hasModelLoaded.mockReturnValueOnce(true)  // only first call
mpStub.game.streaming.hasModelLoaded.mockImplementation((hash) => hash === 123)
```

---

## 5. Mocking with ts-mockito (Mockito-style)

Best for code that depends on a **class instance** or **interface**. Provides
stricter type checking than `vi.fn()`.

```ts
import { mock, when, instance, verify, anything, capture } from 'ts-mockito'

interface WeaponService {
  give(playerId: number, weaponHash: number, ammo: number): void
  hasWeapon(playerId: number, weaponHash: number): boolean
}

describe('something that uses WeaponService', () => {
  it('gives the player a weapon', () => {
    // 1. Create the mock
    const mockedService = mock<WeaponService>()

    // 2. Stub a method
    when(mockedService.hasWeapon(1, anything())).thenReturn(false)
    when(mockedService.give(anything(), anything(), anything())).thenReturn(undefined)

    // 3. Get the usable instance and inject it
    const service = instance(mockedService)
    service.give(1, 0xDFADE9, 250)

    // 4. Verify interactions
    verify(mockedService.give(1, 0xDFADE9, 250)).once()
    verify(mockedService.hasWeapon(anything(), anything())).never()
  })

  it('captures call arguments for detailed assertions', () => {
    const mockedService = mock<WeaponService>()
    const service = instance(mockedService)

    service.give(7, 0x1B06D571, 100)

    const [playerId, hash, ammo] = capture(mockedService.give).last()
    expect(playerId).toBe(7)
    expect(ammo).toBe(100)
  })
})
```

### ts-mockito cheat-sheet

| API | What it does |
|-----|-------------|
| `mock<T>()` | Create a mock — does NOT run real code |
| `instance(m)` | Get the object to pass to production code |
| `when(m.method(...)).thenReturn(v)` | Stub a return value |
| `when(m.method(...)).thenThrow(err)` | Stub a thrown error |
| `when(m.method(...)).thenCall(fn)` | Stub with a function |
| `verify(m.method(...)).once()` | Assert called exactly once |
| `verify(m.method(...)).times(n)` | Assert called n times |
| `verify(m.method(...)).never()` | Assert never called |
| `verify(m.method(...)).atLeast(n)` | Assert called at least n times |
| `capture(m.method).last()` | Get the last call's arguments |
| `anything()` | Matches any argument |
| `anyString()` / `anyNumber()` | Type-specific matchers |
| `deepEqual(obj)` | Deep equality matcher |

---

## 6. Testing Async Code

```ts
import { describe, it, expect, vi } from 'vitest'

// Option A: async/await
it('resolves with the expected value', async () => {
  const result = await someAsyncFn()
  expect(result).toBe(42)
})

// Option B: fake timers for code that uses setTimeout/setInterval
it('runs after delay', async () => {
  vi.useFakeTimers()
  const p = funcThatWaits(1000)
  vi.advanceTimersByTime(1000)
  await expect(p).resolves.toBe('done')
  vi.useRealTimers()
})

// Option C: assert on rejection
it('rejects on invalid input', async () => {
  await expect(funcThatRejects()).rejects.toThrow('bad input')
})
```

---

## 7. ES2017 Constraint Reminder

Client scripts target ES2017. Do **not** use optional chaining (`?.`) or
nullish coalescing (`??`) in production code. Tests themselves can use modern
syntax since Vitest transpiles them with its own pipeline.

---

## 8. What NOT to Test

- Pure framework wiring (mp.events.add calls in module init)
- Implementation details — test observable behaviour, not internal state
- One-liner getters with no logic
