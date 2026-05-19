<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCharacter } from '@/composables/useCharacter'
import { useRouterStore } from '@/stores/router'
import {
    validateCreateCharacter,
    hasCharacterErrors,
    type CharacterFormErrors,
} from '@/validators/character.validator'

const character = useCharacter()
const router = useRouterStore()

const firstname = ref('')
const lastname = ref('')
const gender = ref<'MALE' | 'FEMALE'>('MALE')
const localError = ref<string | null>(null)

const errors = computed<CharacterFormErrors>(() =>
    validateCreateCharacter({ firstname: firstname.value, lastname: lastname.value, gender: gender.value }),
)
const canSubmit = computed(() => !character.loading.value && !hasCharacterErrors(errors.value))

async function submit() {
    localError.value = null
    if (hasCharacterErrors(errors.value)) {
        localError.value = Object.values(errors.value).find(Boolean) ?? 'invalid input'
        return
    }
    const newId = await character.create(firstname.value.trim(), lastname.value.trim(), gender.value)
    if (!newId) {
        // useCharacter.error.value will hold the server message
        return
    }

    // New character exists. Load it (spawn) then route to the customization
    // wizard since `appearance` will be null.
    const ok = await character.select(newId)
    if (ok) {
        router.setView('PlayerCustomization', { firstTime: true })
    }
}

function back() {
    router.setView('PlayerAuthentication')
}
</script>

<template>
    <main class="player-creation">
        <section class="player-creation__panel">
            <header>
                <h1>New character</h1>
                <p>Pick a name and gender. Appearance comes next.</p>
            </header>

            <label>
                First name
                <input v-model="firstname" maxlength="50" type="text" />
                <small v-if="errors.firstname" class="player-creation__field-error">{{ errors.firstname }}</small>
            </label>

            <label>
                Last name
                <input v-model="lastname" maxlength="50" type="text" />
                <small v-if="errors.lastname" class="player-creation__field-error">{{ errors.lastname }}</small>
            </label>

            <fieldset class="player-creation__gender">
                <legend>Gender</legend>
                <label>
                    <input v-model="gender" type="radio" value="MALE" />
                    Male
                </label>
                <label>
                    <input v-model="gender" type="radio" value="FEMALE" />
                    Female
                </label>
            </fieldset>

            <p v-if="localError || character.error.value" class="player-creation__error">
                {{ localError || character.error.value }}
            </p>

            <div class="player-creation__actions">
                <button type="button" class="player-creation__back" @click="back">Back</button>
                <button type="button" class="player-creation__submit" :disabled="!canSubmit" @click="submit">
                    {{ character.loading.value ? 'Creating…' : 'Create' }}
                </button>
            </div>
        </section>
    </main>
</template>

<style scoped>
.player-creation {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.55);
    font-family: 'Geist Variable', system-ui, sans-serif;
    color: #f1f5f9;
}
.player-creation__panel {
    width: 420px;
    background: #0f172a;
    border: 1px solid #1e293b;
    border-radius: 16px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.55);
}
.player-creation__panel header h1 {
    margin: 0 0 4px;
    font-size: 22px;
}
.player-creation__panel header p {
    margin: 0;
    font-size: 13px;
    color: #94a3b8;
}
.player-creation__panel label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 13px;
    color: #cbd5e1;
}
.player-creation__panel input[type='text'] {
    background: #1e293b;
    border: 1px solid #334155;
    border-radius: 8px;
    color: #f1f5f9;
    padding: 10px 12px;
    font-size: 14px;
    outline: none;
}
.player-creation__panel input[type='text']:focus {
    border-color: #6366f1;
}
.player-creation__gender {
    border: 1px solid #1e293b;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    gap: 16px;
    color: #cbd5e1;
}
.player-creation__gender legend {
    padding: 0 6px;
    font-size: 12px;
    color: #94a3b8;
}
.player-creation__gender label {
    flex-direction: row;
    align-items: center;
    gap: 6px;
    cursor: pointer;
}
.player-creation__field-error {
    color: #f87171;
    font-size: 11px;
}
.player-creation__error {
    color: #f87171;
    font-size: 12px;
    margin: 0;
}
.player-creation__actions {
    display: flex;
    gap: 12px;
}
.player-creation__back,
.player-creation__submit {
    flex: 1;
    padding: 10px 16px;
    border-radius: 8px;
    border: none;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}
.player-creation__back {
    background: #1e293b;
    color: #cbd5e1;
}
.player-creation__submit {
    background: #6366f1;
    color: white;
}
.player-creation__submit:disabled {
    background: #334155;
    color: #64748b;
    cursor: not-allowed;
}
</style>
