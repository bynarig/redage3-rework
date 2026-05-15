import { parsePosition, serializePosition } from '@redage/shared';
/**
 * Reads/writes a `characters` row using the generated Prisma client.
 *
 * The legacy schema stores position as a serialized string in `pos`, not
 * as separate columns — see `@redage/shared/position` for parsing.
 * Dimension is also packed into `pos`, so this is the only place that
 * deals with the legacy on-wire format.
 */
export class CharacterRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async load(characterId) {
        const row = await this.prisma.characters.findUnique({
            where: { uuid: characterId },
            select: {
                uuid: true,
                firstname: true,
                lastname: true,
                health: true,
                armor: true,
                money: true,
                bank: true,
                pos: true,
                is_deleted: true,
            },
        });
        if (!row || row.is_deleted)
            return null;
        const pos = parsePosition(row.pos);
        const name = `${row.firstname ?? ''} ${row.lastname ?? ''}`.trim() || `#${row.uuid}`;
        return {
            id: row.uuid,
            name,
            cash: row.money ?? 0,
            bank: row.bank ?? 0,
            position: { x: pos.x, y: pos.y, z: pos.z, heading: pos.heading },
            health: row.health ?? 100,
            armor: row.armor ?? 0,
            dimension: pos.dimension,
        };
    }
    async save(input) {
        const pos = serializePosition({
            x: input.position.x,
            y: input.position.y,
            z: input.position.z,
            heading: input.position.heading,
            dimension: input.dimension,
        });
        await this.prisma.characters.update({
            where: { uuid: input.characterId },
            data: {
                pos,
                health: input.health,
                armor: input.armor,
            },
        });
    }
}
//# sourceMappingURL=character-repo.js.map