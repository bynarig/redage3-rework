import { ref, readonly } from 'vue'
import { executeClient } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import {
    CharacterReplySchema,
    CreateCharacterReplySchema,
    type CharacterDto,
    type Gender,
} from '@/api/contracts/character'

const character = ref<CharacterDto | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Two separate pending slots so a create call doesn't get tangled with a
// select call. Each only allows one in-flight operation; UIs should disable
// submit while loading.
let selectPending: ((ok: boolean) => void) | null = null
let createPending: ((id: number | null) => void) | null = null

addListernEvent('redage:character:reply', (rawReply: unknown) => {
    const parsed = CharacterReplySchema.safeParse(rawReply)
    loading.value = false
    if (!parsed.success) {
        error.value = 'invalid server reply'
        selectPending?.(false)
        selectPending = null
        return
    }
    const reply = parsed.data
    if (reply.ok && reply.character) {
        character.value = reply.character
        error.value = null
        selectPending?.(true)
    } else {
        error.value = reply.error ?? 'failed to load character'
        selectPending?.(false)
    }
    selectPending = null
})

addListernEvent('redage:character:create:reply', (rawReply: unknown) => {
    const parsed = CreateCharacterReplySchema.safeParse(rawReply)
    loading.value = false
    if (!parsed.success) {
        error.value = 'invalid server reply'
        createPending?.(null)
        createPending = null
        return
    }
    const reply = parsed.data
    if (reply.ok && typeof reply.characterId === 'number') {
        error.value = null
        createPending?.(reply.characterId)
    } else {
        error.value = reply.error ?? 'failed to create character'
        createPending?.(null)
    }
    createPending = null
})

export function useCharacter() {
    return {
        character: readonly(character),
        loading: readonly(loading),
        error: readonly(error),

        select(characterId: number): Promise<boolean> {
            if (selectPending || createPending) return Promise.resolve(false)
            loading.value = true
            error.value = null
            return new Promise<boolean>((resolve) => {
                selectPending = resolve
                executeClient('redage.character.select', characterId)
            })
        },

        /** Returns the new character's id, or null on failure. */
        create(firstname: string, lastname: string, gender: Gender): Promise<number | null> {
            if (selectPending || createPending) return Promise.resolve(null)
            loading.value = true
            error.value = null
            return new Promise<number | null>((resolve) => {
                createPending = resolve
                executeClient('redage.character.create', firstname, lastname, gender)
            })
        },
    }
}
