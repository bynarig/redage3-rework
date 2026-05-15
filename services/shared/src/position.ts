/**
 * The `characters.pos` column is a serialized string of the form
 *   "{X:0.0,Y:0.0,Z:0.0,H:0.0,D:0}"
 * (legacy C# format — non-JSON quotes). We parse/serialize here so callers
 * see a typed Position, never a raw string.
 *
 * Any unrecognized value defaults to spawn (0,0,72) — close to LS center.
 */
export interface Position {
  x: number;
  y: number;
  z: number;
  heading: number;
  dimension: number;
}

const SPAWN: Position = { x: 0, y: 0, z: 72, heading: 0, dimension: 0 };

export function parsePosition(raw: string | null | undefined): Position {
  if (!raw) return { ...SPAWN };
  // Try JSON first (modern records).
  try {
    const j = JSON.parse(raw) as Record<string, unknown>;
    if (typeof j.x === 'number' && typeof j.y === 'number' && typeof j.z === 'number') {
      return {
        x: j.x,
        y: j.y,
        z: j.z,
        heading: typeof j.heading === 'number' ? j.heading : typeof j.h === 'number' ? j.h : 0,
        dimension: typeof j.dimension === 'number' ? j.dimension : typeof j.d === 'number' ? j.d : 0,
      };
    }
  } catch {
    /* fall through to legacy parser */
  }
  // Legacy C#-style: "{X:1.5,Y:2.5,Z:3.5,H:0,D:0}".
  const out: Position = { ...SPAWN };
  const body = raw.replace(/[{}\s]/g, '');
  for (const part of body.split(',')) {
    const [k, v] = part.split(':');
    if (!k || v === undefined) continue;
    const n = Number(v);
    if (Number.isNaN(n)) continue;
    switch (k.toUpperCase()) {
      case 'X': out.x = n; break;
      case 'Y': out.y = n; break;
      case 'Z': out.z = n; break;
      case 'H': out.heading = n; break;
      case 'D': out.dimension = n; break;
    }
  }
  return out;
}

export function serializePosition(p: Position): string {
  return JSON.stringify({ x: p.x, y: p.y, z: p.z, heading: p.heading, dimension: p.dimension });
}
