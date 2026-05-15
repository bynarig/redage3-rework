<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useCharacter } from '@/composables/useCharacter'

import './player-authentication.scss'

type Mode = 'login' | 'register'

const auth = useAuth()
const character = useCharacter()

const mode = ref<Mode>('login')
const loginName = ref('')
const email = ref('')
const password = ref('')
const passwordRepeat = ref('')
const localError = ref<string | null>(null)

const canSubmit = computed(() => {
    if (auth.loading.value) return false
    if (loginName.value.trim().length < 3) return false
    if (password.value.length < 6) return false
    if (mode.value === 'register') {
        return email.value.includes('@') && password.value === passwordRepeat.value
    }
    return true
})

const accountCharacters = computed(() => auth.account.value?.characters.filter((id) => id > 0) ?? [])

function setMode(nextMode: Mode) {
    mode.value = nextMode
    localError.value = null
}

async function submit() {
    localError.value = null
    if (mode.value === 'register' && password.value !== passwordRepeat.value) {
        localError.value = 'passwords do not match'
        return
    }

    if (mode.value === 'login') {
        await auth.login(loginName.value.trim(), password.value)
        return
    }

    await auth.register(loginName.value.trim(), email.value.trim(), password.value)
}

async function selectCharacter(characterId: number) {
    await character.select(characterId)
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
                </label>

                <label v-if="mode === 'register'">
                    Email
                    <input v-model="email" autocomplete="email" maxlength="100" type="email" />
                </label>

                <label>
                    Password
                    <input v-model="password" autocomplete="current-password" maxlength="256" type="password" />
                </label>

                <label v-if="mode === 'register'">
                    Repeat password
                    <input v-model="passwordRepeat" autocomplete="new-password" maxlength="256" type="password" />
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

                <p v-else class="player-auth__empty">No characters</p>
                <p v-if="character.error.value" class="player-auth__error">{{ character.error.value }}</p>
            </div>
        </section>
    </main>
</template>
