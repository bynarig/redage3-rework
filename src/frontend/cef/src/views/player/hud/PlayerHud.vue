<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { addListernEvent } from '@/api/functions'

interface HudUpdate {
    serverName?: unknown
    online?: unknown
    voiceActive?: unknown
    voiceAvailable?: unknown
}

const props = defineProps<{ visible: boolean }>()

const serverName = ref('RedAge Role Play')
const online = ref<number | null>(null)
const voiceActive = ref(false)
const voiceAvailable = ref(true)
const now = ref(new Date())

const kyivTime = computed(() =>
    new Intl.DateTimeFormat('uk-UA', {
        timeZone: 'Europe/Kyiv',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    }).format(now.value)
)

const onlineLabel = computed(() => (online.value === null ? '--' : String(online.value)))
const voiceLabel = computed(() => {
    if (!voiceAvailable.value) return 'Mic unavailable'
    return voiceActive.value ? 'Mic active' : 'Mic ready'
})

const voiceClass = computed(() => ({
    'player-hud__voice--active': voiceAvailable.value && voiceActive.value,
    'player-hud__voice--idle': voiceAvailable.value && !voiceActive.value,
    'player-hud__voice--off': !voiceAvailable.value,
}))

function readNumber(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : null
}

function updateHud(payload: HudUpdate = {}) {
    if (typeof payload.serverName === 'string' && payload.serverName.trim()) {
        serverName.value = payload.serverName.trim()
    }

    const nextOnline = readNumber(payload.online)
    if (nextOnline !== null) online.value = nextOnline

    if (typeof payload.voiceActive === 'boolean') voiceActive.value = payload.voiceActive
    if (typeof payload.voiceAvailable === 'boolean') voiceAvailable.value = payload.voiceAvailable
}

function setServerName(value: string) {
    updateHud({ serverName: value })
}

function setOnline(value: number) {
    updateHud({ online: value })
}

function setVoiceActive(value: boolean) {
    updateHud({ voiceActive: value })
}

addListernEvent('redage:hud:update', (payload: unknown) => {
    if (payload !== null && typeof payload === 'object') updateHud(payload as HudUpdate)
})

;(window as any).hudStore = {
    ...((window as any).hudStore ?? {}),
    update: updateHud,
    setServerName,
    setOnline,
    setVoiceActive,
}

let timer: number | null = null

onMounted(() => {
    timer = window.setInterval(() => {
        now.value = new Date()
    }, 1000)
})

onBeforeUnmount(() => {
    if (timer !== null) window.clearInterval(timer)
})
</script>

<template>
    <aside v-if="props.visible" class="player-hud" aria-label="Server status HUD">
        <section class="player-hud__brand">
            <span class="player-hud__server">{{ serverName }}</span>
            <span class="player-hud__time">{{ kyivTime }} Kyiv</span>
        </section>

        <section class="player-hud__metrics">
            <div class="player-hud__metric">
                <span class="player-hud__label">Online</span>
                <strong>{{ onlineLabel }}</strong>
            </div>

            <div class="player-hud__metric player-hud__voice" :class="voiceClass">
                <span class="player-hud__mic" aria-hidden="true"></span>
                <span class="player-hud__label">{{ voiceLabel }}</span>
            </div>
        </section>
    </aside>
</template>

<style scoped>
.player-hud {
    position: fixed;
    top: 20px;
    right: 24px;
    z-index: 20;
    min-width: 260px;
    color: #f8fafc;
    font-family: 'Geist Variable', 'Segoe UI', sans-serif;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
    pointer-events: none;
}

.player-hud__brand {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    padding: 10px 12px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    background: linear-gradient(90deg, rgba(12, 18, 28, 0.86), rgba(12, 18, 28, 0.56));
    backdrop-filter: blur(8px);
}

.player-hud__server {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
}

.player-hud__time {
    color: #fbbf24;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
}

.player-hud__metrics {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 0 0 8px 8px;
    overflow: hidden;
    background: rgba(8, 12, 20, 0.72);
    backdrop-filter: blur(8px);
}

.player-hud__metric {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 8px 10px;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.player-hud__metric:last-child {
    border-right: none;
}

.player-hud__label {
    color: #cbd5e1;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0;
    white-space: nowrap;
}

.player-hud__metric strong {
    font-size: 18px;
    line-height: 1;
}

.player-hud__voice {
    justify-content: flex-start;
}

.player-hud__mic {
    position: relative;
    width: 12px;
    height: 18px;
    border: 2px solid currentColor;
    border-radius: 8px;
}

.player-hud__mic::before {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -7px;
    width: 10px;
    height: 5px;
    border-bottom: 2px solid currentColor;
    border-left: 2px solid currentColor;
    border-right: 2px solid currentColor;
    border-radius: 0 0 8px 8px;
    transform: translateX(-50%);
}

.player-hud__mic::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -11px;
    width: 2px;
    height: 5px;
    background: currentColor;
    transform: translateX(-50%);
}

.player-hud__voice--active {
    color: #22c55e;
}

.player-hud__voice--idle {
    color: #fbbf24;
}

.player-hud__voice--off {
    color: #ef4444;
}
</style>
