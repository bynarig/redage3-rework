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
export declare function parsePosition(raw: string | null | undefined): Position;
export declare function serializePosition(p: Position): string;
//# sourceMappingURL=position.d.ts.map