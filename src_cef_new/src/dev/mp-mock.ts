// Dev-only mock for all RAGE:MP CEF bridge globals.
// Injected before app mount only when Vite runs in dev mode (import.meta.env.DEV).
// All mp.trigger calls and emitted events are logged to the browser console.
// Use the floating panel (bottom-right) or window.mp_mock.emit() in DevTools to push events in.

declare global {
  interface Window {
    mp: { trigger(event: string, ...args: unknown[]): void }
    events: MpEvents
    mp_mock: MpEvents
    router: MpRouter
    keys: number[]
    serverDonatMultiplier: number
    notificationAdd(type: string, id: string, text: string, duration: number): void
    FadeScreen(toggled: boolean, speed: number): void
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
  opacity: number
  setPopUp(name?: string): void
  setHud(name?: string): void
}

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

window.events = mockEvents
window.mp_mock = mockEvents

window.router = {
  opacity: 1,
  setPopUp(name) {
    console.log('[mp-mock] setPopUp:', name ?? '(close)')
  },
  setHud(name) {
    console.log('[mp-mock] setHud:', name ?? '(close)')
  },
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
// Lets you emit events into the CEF bridge without touching the console.
// Tip: pass JSON array for args, e.g.  ["someData", 42]

function mountDevPanel() {
  const el = document.createElement('div')
  el.style.cssText = [
    'position:fixed;bottom:12px;right:12px;z-index:2147483647',
    'background:rgba(8,8,8,.92);color:#00ff88;font:11px/1.5 monospace',
    'padding:10px 12px;border:1px solid #00ff88;border-radius:6px',
    'display:flex;flex-direction:column;gap:6px;min-width:230px',
    'backdrop-filter:blur(6px)',
  ].join(';')

  el.innerHTML = `
    <b style="font-size:12px;letter-spacing:.05em">RAGE:MP Dev Mock</b>
    <input id="__mpEvt"  placeholder="event name"         style="${inputStyle()}">
    <input id="__mpArgs" placeholder='args — JSON array (opt)' style="${inputStyle()}">
    <div style="display:flex;gap:6px">
      <button id="__mpEmit"  style="${btnStyle('#00ff88','#000')}">Emit →</button>
      <button id="__mpClear" style="${btnStyle('#333','#00ff88')}">Clear log</button>
    </div>
    <div style="font-size:9px;opacity:.55">
      window.mp_mock.emit(name, ...args)<br>
      Outbound: mp.trigger → console (orange)<br>
      Inbound:  mp_mock.emit → console (green)
    </div>
  `
  document.body.appendChild(el)

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
  return `background:${bg};color:${fg};border:1px solid #00ff88;padding:3px 10px;cursor:pointer;border-radius:3px;font-weight:bold;flex:1`
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountDevPanel)
} else {
  mountDevPanel()
}
