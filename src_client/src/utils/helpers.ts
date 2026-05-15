// Pure utility functions for client-side scripts.
// No global.* usage — import directly from wherever needed.

/**
 * Bitmask flags for RAGE:MP raycasting filters.
 */
export const RAYCASTING_FLAGS = {
  map: 1,
  vehicles: 2,
  players: 4,
  players2: 8,
  objects: 16,
  vegetation: 256,
} as const

/**
 * Minimal 3D vector shape for math helpers.
 */
export interface Vec3Like { x: number; y: number; z: number }

/** Euclidean distance between two 3D points using multiplication instead of Math.pow. */
export function vdist3(a: Vec3Like, b: Vec3Like): number {
  const dx = a.x - b.x, dy = a.y - b.y, dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

const _antiFloodCache: Record<string, number> = {}

/**
 * Returns true and marks the slot if enough time has elapsed since the last call.
 * @param name Flood gate key.
 * @param time Cooldown window in milliseconds.
 * @returns True when the call is allowed.
 */
export function antiFlood(name: string, time: number): boolean {
  const now = Date.now()
  const last = _antiFloodCache[name]
  if (last !== undefined && last > now) return false
  _antiFloodCache[name] = now + time
  return true
}

/**
 * Resolves after `ms` milliseconds; safe to use inside RAGE:MP event loops.
 * @param ms Delay in milliseconds.
 * @returns Promise that resolves after the delay.
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Escapes a value for safe insertion into HTML strings.
 * @param value Input value to escape.
 * @returns HTML-escaped string.
 */
export function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Requests a model from the streaming system and waits until it is loaded.
 * Accepts either a model name string or a pre-computed hash.
 * Returns false if the model fails to load within ~5 000 ticks.
 * @param model Model name or hash.
 * @returns True when loaded; false on timeout or error.
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
