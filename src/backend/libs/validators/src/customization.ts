import { z } from 'zod';

/**
 * Each value is an index into the corresponding `barber_<Gender>_<Slot>.json`
 * file shipped with the CEF bundle. `255` is kept as an allowed sentinel because
 * the legacy customization data uses it for "no overlay" on some appearance
 * layers.
 *
 * Persisted to `customization.appearance` as JSON (varchar(1000)).
 */
const CHOICE_MAX = 255;

export const Appearance = z.object({
  hairId: z.number().int().min(0).max(CHOICE_MAX),
  beardId: z.number().int().min(0).max(CHOICE_MAX),
  eyebrowsId: z.number().int().min(0).max(CHOICE_MAX),
  bodyId: z.number().int().min(0).max(CHOICE_MAX),
  eyesId: z.number().int().min(0).max(CHOICE_MAX),
  lipsId: z.number().int().min(0).max(CHOICE_MAX),
  paletteId: z.number().int().min(0).max(CHOICE_MAX),
  makeupId: z.number().int().min(0).max(CHOICE_MAX),
});
export type Appearance = z.infer<typeof Appearance>;

export const SaveCustomizationWire = z.object({
  rageId: z.number().int().nonnegative(),
  characterId: z.number().int().positive(),
  appearance: Appearance,
});
export type SaveCustomizationWire = z.infer<typeof SaveCustomizationWire>;

export const DEFAULT_APPEARANCE: Appearance = {
  hairId: 0,
  beardId: 0,
  eyebrowsId: 0,
  bodyId: 0,
  eyesId: 0,
  lipsId: 0,
  paletteId: 0,
  makeupId: 0,
};
