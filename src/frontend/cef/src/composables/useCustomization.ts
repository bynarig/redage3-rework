import { ref, readonly } from 'vue'
import { executeClient } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import {
    AppearanceSchema,
    CustomizationReplySchema,
    type Appearance,
    DEFAULT_APPEARANCE,
} from '@/api/contracts/character'

const appearance = ref<Appearance>({ ...DEFAULT_APPEARANCE })
const loading = ref(false)
const error = ref<string | null>(null)
let pending: ((ok: boolean) => void) | null = null

addListernEvent('redage:customization:reply', (rawReply: unknown) => {
    const parsed = CustomizationReplySchema.safeParse(rawReply)
    loading.value = false
    if (!parsed.success) {
        error.value = 'invalid server reply'
        pending?.(false)
        pending = null
        return
    }
    const reply = parsed.data
    if (reply.ok) {
        error.value = null
        pending?.(true)
    } else {
        error.value = reply.error ?? 'failed to save appearance'
        pending?.(false)
    }
    pending = null
})

export function useCustomization() {
    return {
        appearance: readonly(appearance),
        loading: readonly(loading),
        error: readonly(error),

        /** Patch one or more appearance fields locally (no server roundtrip). */
        patch(partial: Partial<Appearance>): void {
            appearance.value = { ...appearance.value, ...partial }
        },

        /** Replace the whole appearance object (e.g. when initializing from server). */
        set(next: Appearance): void {
            const parsed = AppearanceSchema.safeParse(next)
            if (parsed.success) appearance.value = parsed.data
        },

        preview(): void {
            const parsed = AppearanceSchema.safeParse(appearance.value)
            if (parsed.success) executeClient('redage.customization.preview', JSON.stringify(parsed.data))
        },

        start(): void {
            executeClient('redage.customization.start')
        },

        stop(): void {
            executeClient('redage.customization.stop')
        },

        reset(): void {
            appearance.value = { ...DEFAULT_APPEARANCE }
            error.value = null
        },

        /** Persist current appearance to the server. */
        save(): Promise<boolean> {
            if (pending) return Promise.resolve(false)
            const parsed = AppearanceSchema.safeParse(appearance.value)
            if (!parsed.success) {
                error.value = parsed.error.issues[0]?.message ?? 'invalid appearance'
                return Promise.resolve(false)
            }
            loading.value = true
            error.value = null
            return new Promise<boolean>((resolve) => {
                pending = resolve
                executeClient('redage.customization.save', JSON.stringify(parsed.data))
            })
        },
    }
}
