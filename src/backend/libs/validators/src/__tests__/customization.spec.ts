import { describe, expect, it } from 'vitest';
import { Appearance, SaveCustomizationWire, DEFAULT_APPEARANCE } from '../customization.js';

describe('Appearance', () => {
  it('accepts the default', () => {
    expect(Appearance.safeParse(DEFAULT_APPEARANCE).success).toBe(true);
  });

  it.each([
    ['negative index', { ...DEFAULT_APPEARANCE, bodyId: -1 }],
    ['over max', { ...DEFAULT_APPEARANCE, makeupId: 999 }],
    ['fractional index', { ...DEFAULT_APPEARANCE, hairId: 1.5 }],
    ['string id', { ...DEFAULT_APPEARANCE, eyesId: '0' }],
    ['missing field', { bodyId: 0, eyesId: 0, lipsId: 0, makeupId: 0 }],
  ])('rejects %s', (_label, input) => {
    expect(Appearance.safeParse(input as never).success).toBe(false);
  });
});

describe('SaveCustomizationWire', () => {
  it('requires characterId and rageId', () => {
    expect(
      SaveCustomizationWire.safeParse({
        rageId: 1,
        characterId: 5,
        appearance: DEFAULT_APPEARANCE,
      }).success,
    ).toBe(true);
  });
});
