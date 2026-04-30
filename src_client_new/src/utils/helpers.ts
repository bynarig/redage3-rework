// Pure utility functions for client-side scripts.
// No global.* usage — import directly from wherever needed.

export const RAYCASTING_FLAGS = {
  map: 1,
  vehicles: 2,
  players: 4,
  players2: 8,
  objects: 16,
  vegetation: 256,
} as const

const _antiFloodCache: Record<string, number> = {}

/** Returns true and marks the slot if enough time has elapsed since the last call. */
export function antiFlood(name: string, time: number): boolean {
  const now = Date.now()
  const last = _antiFloodCache[name]
  if (last !== undefined && last > now) return false
  _antiFloodCache[name] = now + time
  return true
}

/** Resolves after `ms` milliseconds; safe to use inside RAGE:MP event loops. */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const HTML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#x60;',
  '=': '&#x3D;',
  '/': '&#x2F;',
}

/** Escapes a value for safe insertion into HTML strings. */
export function escapeHtml(value: unknown): string {
  return String(value).replace(/[&<>"'`=/]/g, (ch) => HTML_ESCAPE_MAP[ch] || ch)
}

/**
 * Requests a model from the streaming system and waits until it is loaded.
 * Accepts either a model name string or a pre-computed hash.
 * Returns false if the model fails to load within ~5 000 ticks.
 */
export async function loadModel(model: string | number): Promise<boolean> {
  try {
    const hash = typeof model === 'string' ? mp.game.joaat(model) : model
    if (mp.game.streaming.hasModelLoaded(hash)) return true
    mp.game.streaming.requestModel(hash)
    let ticks = 0
    while (!mp.game.streaming.hasModelLoaded(hash)) {
      if (ticks++ > 5000) return false
      await wait(0)
    }
    return true
  } catch {
    return false
  }
}
