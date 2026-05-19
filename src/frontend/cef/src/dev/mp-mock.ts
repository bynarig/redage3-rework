// Dev-only mock for all RAGE:MP CEF bridge globals.
// Injected before app mount only when Vite runs in dev mode (import.meta.env.DEV).
// All mp.trigger calls and emitted events are logged to the browser console.
// Use the floating panel (bottom-right) or window.mp_mock.emit() in DevTools to push events in.

declare global {
  interface Window {
    mp: { trigger(event: string, ...args: unknown[]): void }
    rpc: { callClient(event: string, ...args: unknown[]): Promise<unknown> }
    events: MpEvents
    mp_mock: MpEvents
    router: MpRouter
    keys: number[]
    serverDonatMultiplier: number
    notificationAdd(type: string, id: string, text: string, duration: number): void
    FadeScreen(toggled: boolean, speed: number): void
    listernEvent?: (eventName: string, ...args: unknown[]) => void
    functionList?: Record<string, (...args: unknown[]) => void>
  }
  interface Document {
    cloud: string
  }
}

interface MpEvents {
  addEvent(name: string, cb: (...args: unknown[]) => void): void
  removeEvent(name: string, cb: (...args: unknown[]) => void): void
  emit(name: string, ...args: unknown[]): void
}

interface MpRouter {
  setView(page: string, data?: unknown): void
  close(): void
  setPopUp(name?: string, data?: unknown, func?: (...args: unknown[]) => void): void
  setPopUpData(data?: unknown): void
  setViewData(data?: unknown): void
  addViewData(data?: unknown): void
  updateStatic(page?: string): void
  setHud(name?: string): void
}

// ─── Dev view persistence ──────────────────────────────────────────────────────
// sessionStorage survives HMR reloads in the same tab.
// URL hash (#view=PlayerPhone) lets you bookmark or share a specific state.

export const DEV_VIEW_KEY = 'dev:view'
export const DEV_POPUP_KEY = 'dev:popup'

export function devReadView(): string {
  const hash = new URLSearchParams(location.hash.startsWith('#') ? location.hash.slice(1) : '')
  return hash.get('view') ?? sessionStorage.getItem(DEV_VIEW_KEY) ?? ''
}

export function devReadPopup(): string {
  return sessionStorage.getItem(DEV_POPUP_KEY) ?? ''
}

function devSetView(name: string) {
  sessionStorage.setItem(DEV_VIEW_KEY, name)
  sessionStorage.removeItem(DEV_POPUP_KEY)
  history.replaceState(null, '', `#view=${encodeURIComponent(name)}`)
  window.router.setView(name)
}

function devOpenPopup(name: string, data?: unknown) {
  sessionStorage.setItem(DEV_POPUP_KEY, name)
  window.router.setPopUp(name, data)
}

function devClose() {
  sessionStorage.removeItem(DEV_VIEW_KEY)
  sessionStorage.removeItem(DEV_POPUP_KEY)
  history.replaceState(null, '', location.pathname)
  window.router.close()
}

// ─── Event bus mock ────────────────────────────────────────────────────────────
const _listeners: Record<string, Set<(...args: unknown[]) => void>> = {}

const mockEvents: MpEvents = {
  addEvent(name, cb) {
    ;(_listeners[name] ??= new Set()).add(cb)
  },
  removeEvent(name, cb) {
    _listeners[name]?.delete(cb)
  },
  emit(name, ...args) {
    console.log(`%c[mp-mock] ← event: ${name}`, 'color:#00ff88;font-weight:bold', ...args)
    _listeners[name]?.forEach((cb) => cb(...args))
  },
}

window.mp = {
  trigger(event, ...args) {
    console.log(`%c[mp-mock] → mp.trigger: ${event}`, 'color:#ffaa00;font-weight:bold', ...args)
  },
}

// Mock rpc so executeClientAsync / executeClientAsyncToGroup resolve immediately
// with null instead of hanging forever (no real RAGE:MP RPC available in browser).
window.rpc = {
  callClient(event, ...args) {
    console.log(`%c[mp-mock] → rpc.callClient: ${event}`, 'color:#ff88ff;font-weight:bold', ...args)
    return Promise.resolve(null)
  },
}

window.events = mockEvents
window.mp_mock = mockEvents

// Guard: App.vue wires the real router during <script setup> (before this module
// is dynamically imported inside onMounted). If the real implementation is already
// in place, don't replace it — otherwise dev panel buttons would only log.
if (typeof window.router?.setView !== 'function') {
  window.router = {
    setView(page, data) {
      console.log('[mp-mock] setView:', page, data ?? '')
    },
    close() {
      console.log('[mp-mock] close')
    },
    setPopUp(name, data, func) {
      console.log('[mp-mock] setPopUp:', name ?? '(close)', data ?? '', func ?? '')
    },
    setPopUpData(data) {
      console.log('[mp-mock] setPopUpData:', data)
    },
    setViewData(data) {
      console.log('[mp-mock] setViewData:', data)
    },
    addViewData(data) {
      console.log('[mp-mock] addViewData:', data)
    },
    updateStatic(page) {
      console.log('[mp-mock] updateStatic:', page ?? '(none)')
    },
    setHud(name) {
      console.log('[mp-mock] setHud:', name ?? '(close)')
    },
  }
}

window.keys = new Array(256).fill(0)
window.serverDonatMultiplier = 1
document.cloud = ''

window.notificationAdd = (type, id, text, duration) => {
  console.log('[mp-mock] notification:', { type, id, text, duration })
}

window.FadeScreen = (toggled, speed) => {
  console.log('[mp-mock] FadeScreen:', { toggled, speed })
}

// ─── Floating dev panel ────────────────────────────────────────────────────────
// Buttons jump directly to a view or popup.
// Event emitter fires arbitrary events into the CEF bridge.
// All state persists across HMR via sessionStorage + URL hash.

const VIEWS = [
  { label: '📱 Phone',  name: 'PlayerPhone' },
  { label: '💻 Laptop', name: 'PlayerLaptop' },
  { label: '📋 Tablet', name: 'PlayerTablet' },
  { label: '⌚ Watch',  name: 'PlayerWatch' },
] as const

const POPUPS: { label: string; name: string; data?: unknown }[] = [
  { label: 'Confirm',  name: 'PopupConfirm',  data: { title: 'Dev: Confirm', text: 'Это тестовое сообщение подтверждения.' } },
  { label: 'Input',    name: 'PopupInput',    data: { title: 'Dev: Input', plholder: 'Введите текст...', length: 100 } },
  { label: 'Death',    name: 'PopupDeath',    data: { title: 'Dev: Смерть', text: 'Тестовое сообщение смерти.' } },
  { label: 'Circle',   name: 'CircleMenu',    data: [{ func: 'test1', index: 0, name: 'Действие 1' }, { func: 'test2', index: 1, name: 'Действие 2' }, { func: 'test3', index: 2, name: 'Действие 3' }] },
  { label: 'Select',   name: 'PopupSelect',   data: { title: 'Dev: Выбор', elements: [['Вариант A', 'optA'], ['Вариант B', 'optB'], ['Вариант C', 'optC']] } },
  { label: 'Roulette', name: 'PopupRoulette', data: 3 },
  { label: 'Donate',   name: 'PopupDonate' },
  { label: 'Upgrade',  name: 'PopupUpgrade' },
  { label: 'War',      name: 'PopupWar' },
]

function mountDevPanel() {
  const el = document.createElement('div')
  el.style.cssText = [
    'position:fixed;bottom:12px;right:12px;z-index:2147483647',
    'background:rgba(8,8,8,.92);color:#00ff88;font:11px/1.5 monospace',
    'padding:10px 12px;border:1px solid #00ff88;border-radius:6px',
    'display:flex;flex-direction:column;gap:6px;min-width:260px',
    'backdrop-filter:blur(6px)',
  ].join(';')

  const iconBtn = 'background:none;border:none;color:#00ff88;font:13px monospace;cursor:pointer;padding:0 2px;line-height:1'

  const viewButtons = VIEWS.map(
    (v) => `<button class="__mpView" data-name="${v.name}" style="${btnStyle('#1a1a2e', '#00ff88')}">${v.label}</button>`
  ).join('')

  const popupButtons = POPUPS.map(
    (p, i) => `<button class="__mpPopup" data-name="${p.name}" data-idx="${i}" style="${btnStyle('#1a1a2e', '#88aaff')}">${p.label}</button>`
  ).join('')

  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:4px">
      <b style="font-size:12px;letter-spacing:.05em;flex:1">RAGE:MP Dev Mock</b>
      <button id="__mpLeft"     style="${iconBtn}" title="Move left">◀</button>
      <button id="__mpRight"    style="${iconBtn}" title="Move right">▶</button>
      <button id="__mpMinimise" style="${iconBtn}" title="Minimise">—</button>
    </div>
    <div id="__mpBody" style="display:flex;flex-direction:column;gap:6px">
      <div style="font-size:9px;opacity:.6;margin-bottom:2px">VIEWS</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">${viewButtons}</div>
      <div style="font-size:9px;opacity:.6;margin-top:4px;margin-bottom:2px">POPUPS</div>
      <div style="display:flex;gap:4px;flex-wrap:wrap">${popupButtons}</div>
      <button id="__closeView" style="${btnStyle('#1a1a2e', '#ff8888')};width:100%;margin-top:2px">✕ Close all</button>
      <hr style="border:none;border-top:1px solid #333;margin:2px 0">
      <div style="font-size:9px;opacity:.6;margin-bottom:2px">EMIT EVENT</div>
      <input id="__mpEvt"  placeholder="event name"               style="${inputStyle()}">
      <input id="__mpArgs" placeholder='args — JSON array (opt)'  style="${inputStyle()}">
      <div style="display:flex;gap:6px">
        <button id="__mpEmit"  style="${btnStyle('#00ff88', '#000')}">Emit →</button>
        <button id="__mpClear" style="${btnStyle('#333', '#00ff88')}">Clear log</button>
      </div>
      <div id="__mpHint" style="font-size:9px;opacity:.55">
        window.mp_mock.emit(name, ...args)<br>
        window.listernEvent(name, ...args)<br>
        Outbound: mp.trigger → console (orange)<br>
        Inbound: mp_mock.emit → console (green)
      </div>
    </div>
  `
  document.body.appendChild(el)

  // ── Minimise ────────────────────────────────────────────────────────────────
  const body = document.getElementById('__mpBody')!
  const minBtn = document.getElementById('__mpMinimise')!
  let minimised = false
  minBtn.addEventListener('click', () => {
    minimised = !minimised
    body.style.display = minimised ? 'none' : 'flex'
    minBtn.textContent = minimised ? '＋' : '—'
  })

  // ── Move left / right ───────────────────────────────────────────────────────
  let onLeft = false
  const setside = (left: boolean) => {
    onLeft = left
    el.style.right = left ? 'auto' : '12px'
    el.style.left  = left ? '12px' : 'auto'
  }
  document.getElementById('__mpLeft')!.addEventListener('click',  () => setside(true))
  document.getElementById('__mpRight')!.addEventListener('click', () => setside(false))

  // ── View buttons ─────────────────────────────────────────────────────────────
  el.querySelectorAll<HTMLElement>('.__mpView').forEach((btn) => {
    btn.addEventListener('click', () => devSetView(btn.dataset.name!))
  })

  // ── Popup buttons ────────────────────────────────────────────────────────────
  el.querySelectorAll<HTMLElement>('.__mpPopup').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx)
      devOpenPopup(btn.dataset.name!, POPUPS[idx]?.data)
    })
  })

  // ── Close ────────────────────────────────────────────────────────────────────
  document.getElementById('__closeView')!.addEventListener('click', devClose)

  // ── Event emitter ────────────────────────────────────────────────────────────
  document.getElementById('__mpEmit')!.addEventListener('click', () => {
    const name = (document.getElementById('__mpEvt') as HTMLInputElement).value.trim()
    if (!name) return
    const raw = (document.getElementById('__mpArgs') as HTMLInputElement).value.trim()
    let args: unknown[] = []
    try {
      if (raw) {
        const parsed = JSON.parse(raw)
        args = Array.isArray(parsed) ? parsed : [parsed]
      }
    } catch {
      args = [raw]
    }
    mockEvents.emit(name, ...args)
  })

  document.getElementById('__mpClear')!.addEventListener('click', () => console.clear())
}

function inputStyle() {
  return 'background:#111;color:#00ff88;border:1px solid #00ff88;padding:3px 6px;outline:none;border-radius:3px;width:100%;box-sizing:border-box'
}
function btnStyle(bg: string, fg: string) {
  return `background:${bg};color:${fg};border:1px solid #333;padding:3px 8px;cursor:pointer;border-radius:3px;font-weight:bold;font:bold 10px monospace`
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountDevPanel)
} else {
  mountDevPanel()
}
