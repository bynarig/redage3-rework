<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useCharacter } from '@/composables/useCharacter'
import { useRouterStore } from '@/stores/router'
import { validateLogin, validateRegister, hasErrors, type FieldErrors } from '@/validators/account.validator'

import './player-authentication.scss'

type Mode = 'login' | 'register'

const auth = useAuth()
const character = useCharacter()
const router = useRouterStore()

const mode = ref<Mode>('login')
const loginName = ref('')
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')
const localError = ref<string | null>(null)

const fieldErrors = computed<FieldErrors>(() => {
    if (mode.value === 'login') {
        return validateLogin({ login: loginName.value, password: password.value })
    }
    return validateRegister({
        login: loginName.value,
        email: email.value,
        password: password.value,
        passwordRepeat: passwordRepeat.value,
    })
})

const canSubmit = computed(() => !auth.loading.value && !hasErrors(fieldErrors.value))

const accountCharacters = computed(() => auth.account.value?.characters.filter((id) => id > 0) ?? [])

function setMode(nextMode: Mode) {
    mode.value = nextMode
    localError.value = null
}

async function submit() {
    localError.value = null
    const errors = fieldErrors.value
    if (hasErrors(errors)) {
        localError.value = Object.values(errors).find(Boolean) ?? 'invalid input'
        return
    }
    if (mode.value === 'login') {
        await auth.login(loginName.value.trim(), password.value)
        return
    }
    await auth.register(loginName.value.trim(), email.value.trim(), password.value)
}

async function selectCharacter(characterId: number) {
    const ok = await character.select(characterId)
    if (!ok || !character.character.value) return

    // If the loaded character has no persisted appearance, drop them
    // straight into the customization wizard before they spawn.
    if (character.character.value.appearance === null) {
        router.setView('PlayerCustomization', { firstTime: true })
    } else {
        // Spawn — gateway already applied position/health/appearance.
        // Hide the auth UI and switch to the HUD.
        router.setHud('PlayerHud')
    }
}

function openCreation() {
    router.setView('PlayerCreation')
}
</script>

<template>
    <main class="player-auth">
        <section class="player-auth__panel">
            <div class="player-auth__brand">
                <span class="player-auth__mark">RA</span>
                <div>
                    <h1>RedAge</h1>
                    <p>Roleplay Rework</p>
                </div>
            </div>

            <div v-if="!auth.account.value" class="player-auth__form">
                <div class="player-auth__tabs">
                    <button :class="{ active: mode === 'login' }" type="button" @click="setMode('login')">Login</button>
                    <button :class="{ active: mode === 'register' }" type="button" @click="setMode('register')">
                        Register
                    </button>
                </div>

                <label>
                    Login
                    <input v-model="loginName" autocomplete="username" maxlength="50" type="text" />
                    <small v-if="fieldErrors.login" class="player-auth__field-error">{{ fieldErrors.login }}</small>
                </label>

                <label v-if="mode === 'register'">
                    Email
                    <input v-model="email" autocomplete="email" maxlength="254" type="email" />
                    <small v-if="fieldErrors.email" class="player-auth__field-error">{{ fieldErrors.email }}</small>
                </label>

                <label>
                    Password
                    <input v-model="password" autocomplete="current-password" maxlength="256" type="password" />
                    <small v-if="fieldErrors.password" class="player-auth__field-error">{{ fieldErrors.password }}</small>
                </label>

                <label v-if="mode === 'register'">
                    Repeat password
                    <input v-model="passwordRepeat" autocomplete="new-password" maxlength="256" type="password" />
                    <small v-if="fieldErrors.passwordRepeat" class="player-auth__field-error">{{ fieldErrors.passwordRepeat }}</small>
                </label>

                <p v-if="localError || auth.error.value" class="player-auth__error">
                    {{ localError || auth.error.value }}
                </p>

                <button class="player-auth__submit" :disabled="!canSubmit" type="button" @click="submit">
                    {{ auth.loading.value ? 'Please wait' : mode === 'login' ? 'Enter city' : 'Create account' }}
                </button>
            </div>

            <div v-else class="player-auth__account">
                <p class="player-auth__eyebrow">Authorized</p>
                <h2>{{ auth.account.value.login }}</h2>
                <div class="player-auth__stats">
                    <span>VIP {{ auth.account.value.vipLevel }}</span>
                    <span>{{ auth.account.value.donutCurrency }} DC</span>
                </div>

                <div v-if="accountCharacters.length" class="player-auth__characters">
                    <button
                        v-for="characterId in accountCharacters"
                        :key="characterId"
                        :disabled="character.loading.value"
                        type="button"
                        @click="selectCharacter(characterId)"
                    >
                        Character #{{ characterId }}
                    </button>
                </div>

                <p v-else class="player-auth__empty">No characters yet</p>

                <button
                    class="player-auth__submit"
                    :disabled="character.loading.value"
                    type="button"
                    @click="openCreation"
                >
                    Create new character
                </button>

                <p v-if="character.error.value" class="player-auth__error">{{ character.error.value }}</p>
            </div>
        </section>
    </main>
</template>
