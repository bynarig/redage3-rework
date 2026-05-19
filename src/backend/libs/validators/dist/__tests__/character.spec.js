import { describe, expect, it } from 'vitest';
import { CreateCharacterInput, CreateCharacterWire, SaveCharacterWire, CharacterDto, } from '../character.js';
import { DEFAULT_APPEARANCE } from '../customization.js';
describe('CreateCharacterInput', () => {
    it('accepts a valid pair of names', () => {
        expect(CreateCharacterInput.safeParse({ firstname: 'Jon', lastname: 'Snow', gender: 'MALE' }).success).toBe(true);
    });
    it('accepts cyrillic names', () => {
        expect(CreateCharacterInput.safeParse({ firstname: 'Иван', lastname: 'Петров', gender: 'MALE' }).success).toBe(true);
    });
    it.each([
        ['too short firstname', { firstname: 'J', lastname: 'Snow', gender: 'MALE' }],
        ['digits in firstname', { firstname: 'J0n', lastname: 'Snow', gender: 'MALE' }],
        ['space in lastname', { firstname: 'Jon', lastname: 'Mc Snow', gender: 'MALE' }],
        ['invalid gender', { firstname: 'Jon', lastname: 'Snow', gender: 'OTHER' }],
    ])('rejects %s', (_label, input) => {
        expect(CreateCharacterInput.safeParse(input).success).toBe(false);
    });
    it('trims surrounding whitespace', () => {
        const out = CreateCharacterInput.parse({ firstname: ' Jon ', lastname: ' Snow ', gender: 'MALE' });
        expect(out.firstname).toBe('Jon');
        expect(out.lastname).toBe('Snow');
    });
});
describe('CreateCharacterWire', () => {
    it('requires the account composite identity fields', () => {
        const ok = CreateCharacterWire.safeParse({
            firstname: 'Jon',
            lastname: 'Snow',
            gender: 'MALE',
            rageId: 1,
            accountId: 99,
            accountLogin: 'jon_doe',
        });
        expect(ok.success).toBe(true);
    });
    it('rejects a wire payload missing accountLogin', () => {
        const bad = CreateCharacterWire.safeParse({
            firstname: 'Jon',
            lastname: 'Snow',
            gender: 'MALE',
            rageId: 1,
            accountId: 99,
        });
        expect(bad.success).toBe(false);
    });
});
describe('SaveCharacterWire', () => {
    it('rejects health outside [0,100]', () => {
        expect(SaveCharacterWire.safeParse({
            characterId: 1,
            position: { x: 0, y: 0, z: 0, heading: 0 },
            health: 150,
            armor: 0,
            dimension: 0,
        }).success).toBe(false);
    });
});
describe('CharacterDto', () => {
    it('accepts a character with null appearance (legacy)', () => {
        expect(CharacterDto.safeParse({
            id: 1,
            name: 'Jon',
            cash: 0,
            bank: 0,
            position: { x: 0, y: 0, z: 0, heading: 0 },
            health: 100,
            armor: 0,
            dimension: 0,
            gender: 'MALE',
            appearance: null,
        }).success).toBe(true);
    });
    it('accepts a character with full appearance', () => {
        expect(CharacterDto.safeParse({
            id: 1,
            name: 'Jon',
            cash: 0,
            bank: 0,
            position: { x: 0, y: 0, z: 0, heading: 0 },
            health: 100,
            armor: 0,
            dimension: 0,
            gender: 'MALE',
            appearance: DEFAULT_APPEARANCE,
        }).success).toBe(true);
    });
});
//# sourceMappingURL=character.spec.js.map