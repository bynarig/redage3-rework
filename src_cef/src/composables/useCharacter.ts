import { ref, readonly } from 'vue'
import { executeClient } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { CharacterReplySchema, type CharacterDto } from '@/api/contracts/character'

const character = ref<CharacterDto | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let pending: ((ok: boolean) => void) | null = null

addListernEvent('redage:character:reply', (rawReply: unknown) => {
    const parsed = CharacterReplySchema.safeParse(rawReply)
    loading.value = false
    if (!parsed.success) {
        error.value = 'invalid server reply'
        pending?.(false)
        pending = null
        return
    }
    const reply = parsed.data
    if (reply.ok && reply.character) {
        character.value = reply.character
        error.value = null
        pending?.(true)
    } else {
        error.value = reply.error ?? 'failed to load character'
        pending?.(false)
    }
    pending = null
})

export function useCharacter() {
    return {
        character: readonly(character),
        loading: readonly(loading),
        error: readonly(error),
        select(characterId: number): Promise<boolean> {
            if (pending) return Promise.resolve(false)
            loading.value = true
            error.value = null
            return new Promise<boolean>((resolve) => {
                pending = resolve
                executeClient('redage.character.select', characterId)
            })
        },
    }
}
