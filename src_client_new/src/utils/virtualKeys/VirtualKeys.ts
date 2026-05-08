import { VIRTUAL_KEYS, VirtualKeyCode } from './keyToCode'
import { CODE_TO_KEY, VirtualKeyName } from './codeToKey'

/**
 * Helpers for converting between virtual key names and numeric codes.
 */
export class VirtualKeys {
    /** Returns the numeric VK code for a key name, e.g. `'VK_SPACE'` → `32`. */
    static toCode(key: VirtualKeyName): VirtualKeyCode {
        return VIRTUAL_KEYS[key as keyof typeof VIRTUAL_KEYS] as VirtualKeyCode
    }

    /** Returns the key name for a numeric VK code, e.g. `32` → `'VK_SPACE'`. */
    static toKey(code: VirtualKeyCode): VirtualKeyName {
        return CODE_TO_KEY[code as keyof typeof CODE_TO_KEY]
    }

    /** Returns true if the key with the given name is currently held down. */
    static isDown(key: VirtualKeyName): boolean {
        return mp.keys.isDown(VirtualKeys.toCode(key))
    }
}

export type { VirtualKeyCode, VirtualKeyName }
