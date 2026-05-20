<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { addListernEvent } from '@/api/functions'

interface HudUpdate {
    // top-left
    characterName?: unknown
    level?: unknown
    cash?: unknown
    bank?: unknown
    avatarUrl?: unknown
    initials?: unknown
    // top-right
    serverName?: unknown
    online?: unknown
    voiceActive?: unknown
    voiceAvailable?: unknown
    // bottom-left
    health?: unknown
    armor?: unknown
    stamina?: unknown
    hunger?: unknown
    thirst?: unknown
    // bottom-right
    district?: unknown
    street?: unknown
    coordinates?: unknown
    heading?: unknown
}

defineProps<{ visible: boolean }>()

// ── Top-left: character identity ──────────────────────────────────────────
const characterName = ref('Citizen')
const level = ref(1)
const cash = ref(0)
const bank = ref(0)
const avatarUrl = ref('')
const initials = ref('')

// ── Top-right: server brand ───────────────────────────────────────────────
const serverName = ref('RedAge Role Play')
const online = ref<number | null>(null)
const voiceActive = ref(false)
const voiceAvailable = ref(true)
const timezone = 'Europe/Kyiv'
const now = ref(new Date())

// ── Bottom-left: vitals ───────────────────────────────────────────────────
const health = ref(100)
const armor = ref(0)
const stamina = ref(100)
const hunger = ref(100)
const thirst = ref(100)

// ── Bottom-right: location ────────────────────────────────────────────────
const district = ref('Unknown')
const street = ref('')
const coordinates = ref({ x: 0, y: 0, z: 0 })
const heading = ref(0)

// ── Top-left helpers ──────────────────────────────────────────────────────
const formatMoney = (v: number) =>
    '$' + Math.trunc(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

const avatarInitial = computed(
    () => initials.value || characterName.value.slice(0, 1).toUpperCase(),
)

// ── Top-right derived ─────────────────────────────────────────────────────
const formattedTime = computed(() =>
    new Intl.DateTimeFormat('uk-UA', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(now.value),
)

const onlineLabel = computed(() => (online.value === null ? '--' : String(online.value)))

const voiceLabel = computed(() => {
    if (!voiceAvailable.value) return 'Mic unavailable'
    return voiceActive.value ? 'Mic active' : 'Mic ready'
})

const voiceClass = computed(() => ({
    'hud-top-right__voice--active': voiceAvailable.value && voiceActive.value,
    'hud-top-right__voice--idle': voiceAvailable.value && !voiceActive.value,
    'hud-top-right__voice--off': !voiceAvailable.value,
}))

// ── Bottom-left derived ───────────────────────────────────────────────────
const clamp = (v: number) => Math.max(0, Math.min(100, v))

const bars = computed(() => [
    { key: 'health' as const, label: 'HP', value: clamp(health.value), color: '#f43f5e' },
    { key: 'armor' as const, label: 'AR', value: clamp(armor.value), color: '#38bdf8' },
    { key: 'stamina' as const, label: 'ST', value: clamp(stamina.value), color: '#a3e635' },
])

const chips = computed(() => [
    { key: 'hunger' as const, label: 'Hunger', value: clamp(hunger.value), color: '#f59e0b' },
    { key: 'thirst' as const, label: 'Thirst', value: clamp(thirst.value), color: '#0ea5e9' },
])

// ── Bottom-right derived ──────────────────────────────────────────────────
const cardinal = computed(() => {
    const h = ((heading.value % 360) + 360) % 360
    if (h >= 337.5 || h < 22.5) return 'N'
    if (h < 67.5) return 'NE'
    if (h < 112.5) return 'E'
    if (h < 157.5) return 'SE'
    if (h < 202.5) return 'S'
    if (h < 247.5) return 'SW'
    if (h < 292.5) return 'W'
    return 'NW'
})

const headingRotation = computed(() => `rotate(${heading.value}deg)`)

const formatCoord = (n: number) => n.toFixed(1).padStart(7, ' ')

function readNumber(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function readString(value: unknown): string | null {
    return typeof value === 'string' ? value : null
}

function readBool(value: unknown): boolean | null {
    return typeof value === 'boolean' ? value : null
}

function updateHud(payload: HudUpdate = {}) {
    const s = readString(payload.characterName); if (s && s.trim()) characterName.value = s.trim()
    const lv = readNumber(payload.level); if (lv !== null && lv >= 0) level.value = Math.floor(lv)
    const c = readNumber(payload.cash); if (c !== null) cash.value = c
    const b = readNumber(payload.bank); if (b !== null) bank.value = b
    const av = readString(payload.avatarUrl); if (av !== null) avatarUrl.value = av
    const ini = readString(payload.initials); if (ini !== null) initials.value = ini

    const sn = readString(payload.serverName); if (sn && sn.trim()) serverName.value = sn.trim()
    const o = readNumber(payload.online); if (o !== null && o >= 0) online.value = Math.floor(o)
    const va = readBool(payload.voiceActive); if (va !== null) voiceActive.value = va
    const vAv = readBool(payload.voiceAvailable); if (vAv !== null) voiceAvailable.value = vAv

    const hp = readNumber(payload.health); if (hp !== null) health.value = hp
    const ar = readNumber(payload.armor); if (ar !== null) armor.value = ar
    const st = readNumber(payload.stamina); if (st !== null) stamina.value = st
    const hu = readNumber(payload.hunger); if (hu !== null) hunger.value = hu
    const th = readNumber(payload.thirst); if (th !== null) thirst.value = th

    const dis = readString(payload.district); if (dis !== null) district.value = dis
    const str = readString(payload.street); if (str !== null) street.value = str
    if (payload.coordinates && typeof payload.coordinates === 'object') {
        const c2 = payload.coordinates as { x?: unknown; y?: unknown; z?: unknown }
        const x = readNumber(c2.x); const y = readNumber(c2.y); const z = readNumber(c2.z)
        coordinates.value = {
            x: x ?? coordinates.value.x,
            y: y ?? coordinates.value.y,
            z: z ?? coordinates.value.z,
        }
    }
    const hd = readNumber(payload.heading); if (hd !== null) heading.value = hd
}

// ── Back-compat shorthand setters (preserve the original public API) ──────
function setServerName(value: string) { updateHud({ serverName: value }) }
function setOnline(value: number) { updateHud({ online: value }) }
function setVoiceActive(value: boolean) { updateHud({ voiceActive: value }) }

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

let clockTimer: number | null = null

onMounted(() => {
    clockTimer = window.setInterval(() => {
        now.value = new Date()
    }, 1000)
})

onBeforeUnmount(() => {
    if (clockTimer !== null) window.clearInterval(clockTimer)

    // Drop the public hooks so a re-mount installs fresh refs.
    const store = (window as any).hudStore
    if (store?.update === updateHud) {
        delete store.update
        delete store.setServerName
        delete store.setOnline
        delete store.setVoiceActive
    }
})
</script>

<template>
    <div v-if="visible" class="player-hud" aria-label="Player HUD">
        <!-- ── Top-left: character identity ──────────────────────────── -->
        <aside class="hud-top-left" aria-label="Character identity">
            <div class="hud-top-left__avatar" :class="{ 'has-image': !!avatarUrl }">
                <img v-if="avatarUrl" :src="avatarUrl" alt="" />
                <span v-else class="hud-top-left__initials">{{ avatarInitial }}</span>
            </div>

            <div class="hud-top-left__body">
                <header class="hud-top-left__row">
                    <span class="hud-top-left__name">{{ characterName }}</span>
                    <span class="hud-top-left__level">LVL {{ level }}</span>
                </header>

                <footer class="hud-top-left__row hud-top-left__row--muted">
                    <span class="hud-top-left__money">{{ formatMoney(cash) }}</span>
                    <span class="hud-top-left__sep">·</span>
                    <span class="hud-top-left__bank">Bank {{ formatMoney(bank) }}</span>
                </footer>
            </div>
        </aside>

        <!-- ── Top-right: server status ──────────────────────────────── -->
        <aside class="hud-top-right" aria-label="Server status">
            <section class="hud-top-right__brand">
                <span class="hud-top-right__server">{{ serverName }}</span>
                <span class="hud-top-right__time">{{ formattedTime }}</span>
            </section>

            <section class="hud-top-right__metrics">
                <div class="hud-top-right__metric">
                    <span class="hud-top-right__label">Online</span>
                    <strong>{{ onlineLabel }}</strong>
                </div>

                <div class="hud-top-right__metric hud-top-right__voice" :class="voiceClass">
                    <span class="hud-top-right__mic" aria-hidden="true"></span>
                    <span class="hud-top-right__label">{{ voiceLabel }}</span>
                </div>
            </section>
        </aside>

        <!-- ── Bottom-left: vitals ───────────────────────────────────── -->
        <aside class="hud-bottom-left" aria-label="Vitals">
            <div class="hud-bottom-left__bars">
                <div
                    v-for="bar in bars"
                    :key="bar.key"
                    class="hud-bottom-left__bar"
                >
                    <span class="hud-bottom-left__bar-label">{{ bar.label }}</span>
                    <div class="hud-bottom-left__bar-track">
                        <div
                            class="hud-bottom-left__bar-fill"
                            :style="{
                                width: `${bar.value}%`,
                                background: `linear-gradient(90deg, ${bar.color}, ${bar.color}cc)`,
                                boxShadow: `0 0 12px ${bar.color}55`,
                            }"
                        />
                    </div>
                    <span class="hud-bottom-left__bar-value">{{ Math.round(bar.value) }}</span>
                </div>
            </div>

            <div class="hud-bottom-left__chips">
                <div
                    v-for="chip in chips"
                    :key="chip.key"
                    class="hud-bottom-left__chip"
                    :class="{ 'is-low': chip.value < 25 }"
                >
                    <span
                        class="hud-bottom-left__chip-dot"
                        :style="{ background: chip.color }"
                    />
                    <span class="hud-bottom-left__chip-label">{{ chip.label }}</span>
                    <span class="hud-bottom-left__chip-value">{{ Math.round(chip.value) }}%</span>
                </div>
            </div>
        </aside>

        <!-- ── Bottom-right: location ────────────────────────────────── -->
        <aside class="hud-bottom-right" aria-label="Location">
            <div class="hud-bottom-right__compass">
                <div class="hud-bottom-right__dial" :style="{ transform: headingRotation }">
                    <span class="hud-bottom-right__needle" aria-hidden="true" />
                    <span class="hud-bottom-right__mark hud-bottom-right__mark--n">N</span>
                    <span class="hud-bottom-right__mark hud-bottom-right__mark--e">E</span>
                    <span class="hud-bottom-right__mark hud-bottom-right__mark--s">S</span>
                    <span class="hud-bottom-right__mark hud-bottom-right__mark--w">W</span>
                </div>
                <span class="hud-bottom-right__cardinal">{{ cardinal }}</span>
            </div>

            <div class="hud-bottom-right__location">
                <div class="hud-bottom-right__district">{{ district }}</div>
                <div v-if="street" class="hud-bottom-right__street">{{ street }}</div>
                <div class="hud-bottom-right__coords">
                    <span>X {{ formatCoord(coordinates.x) }}</span>
                    <span>Y {{ formatCoord(coordinates.y) }}</span>
                    <span>Z {{ formatCoord(coordinates.z) }}</span>
                </div>
            </div>
        </aside>
    </div>
</template>

<style scoped>
/* ── Top-left ─────────────────────────────────────────────────────── */
.hud-top-left {
    position: fixed;
    top: 20px;
    left: 24px;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 14px 8px 8px;
    color: #f8fafc;
    font-family: 'Geist Variable', 'Geist', 'Segoe UI', sans-serif;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 12px;
    background: linear-gradient(90deg, rgba(12, 18, 28, 0.78), rgba(12, 18, 28, 0.42));
    backdrop-filter: blur(10px) saturate(160%);
    -webkit-backdrop-filter: blur(10px) saturate(160%);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.hud-top-left__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff75a2, #f7b240 60%, #6ed5ff);
    border: 1px solid rgba(255, 255, 255, 0.32);
    overflow: hidden;
    flex-shrink: 0;
}

.hud-top-left__avatar.has-image {
    background: rgba(0, 0, 0, 0.4);
}

.hud-top-left__avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.hud-top-left__initials {
    font-size: 15px;
    font-weight: 700;
    color: #0b0d18;
    letter-spacing: 0.02em;
}

.hud-top-left__body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.hud-top-left__row {
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
}

.hud-top-left__name {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

.hud-top-left__level {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 2px 6px;
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.12);
    border: 1px solid rgba(251, 191, 36, 0.4);
    border-radius: 999px;
}

.hud-top-left__row--muted {
    color: #cbd5e1;
    font-size: 11px;
    font-weight: 600;
}

.hud-top-left__money {
    color: #4ade80;
}

.hud-top-left__bank {
    color: #cbd5e1;
}

.hud-top-left__sep {
    opacity: 0.5;
}

/* ── Top-right ────────────────────────────────────────────────────── */
.hud-top-right {
    position: fixed;
    top: 20px;
    right: 24px;
    z-index: 20;
    min-width: 260px;
    color: #f8fafc;
    font-family: 'Geist Variable', 'Geist', 'Segoe UI', sans-serif;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
    pointer-events: none;
}

.hud-top-right__brand {
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
    -webkit-backdrop-filter: blur(8px);
}

.hud-top-right__server {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
}

.hud-top-right__time {
    color: #fbbf24;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
}

.hud-top-right__metrics {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 0 0 8px 8px;
    overflow: hidden;
    background: rgba(8, 12, 20, 0.72);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.hud-top-right__metric {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 8px 10px;
    border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.hud-top-right__metric:last-child {
    border-right: none;
}

.hud-top-right__label {
    color: #cbd5e1;
    font-size: 11px;
    font-weight: 700;
    white-space: nowrap;
}

.hud-top-right__metric strong {
    font-size: 18px;
    line-height: 1;
}

.hud-top-right__voice {
    justify-content: flex-start;
}

.hud-top-right__mic {
    position: relative;
    width: 12px;
    height: 18px;
    border: 2px solid currentColor;
    border-radius: 8px;
}

.hud-top-right__mic::before {
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

.hud-top-right__mic::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -11px;
    width: 2px;
    height: 5px;
    background: currentColor;
    transform: translateX(-50%);
}

.hud-top-right__voice--active {
    color: #22c55e;
}

.hud-top-right__voice--idle {
    color: #fbbf24;
}

.hud-top-right__voice--off {
    color: #ef4444;
}

/* ── Bottom-left ──────────────────────────────────────────────────── */
.hud-bottom-left {
    position: fixed;
    bottom: 20px;
    left: 24px;
    z-index: 20;
    min-width: 220px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    color: #f8fafc;
    font-family: 'Geist Variable', 'Geist', 'Segoe UI', sans-serif;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(8, 12, 20, 0.72), rgba(8, 12, 20, 0.52));
    backdrop-filter: blur(10px) saturate(160%);
    -webkit-backdrop-filter: blur(10px) saturate(160%);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.hud-bottom-left__bars {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.hud-bottom-left__bar {
    display: grid;
    grid-template-columns: 22px 1fr 28px;
    align-items: center;
    gap: 8px;
}

.hud-bottom-left__bar-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #cbd5e1;
}

.hud-bottom-left__bar-track {
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
    position: relative;
}

.hud-bottom-left__bar-fill {
    height: 100%;
    border-radius: inherit;
    transition: width 280ms cubic-bezier(0.4, 0, 0.2, 1);
}

.hud-bottom-left__bar-value {
    font-size: 11px;
    font-weight: 700;
    text-align: right;
    color: #e2e8f0;
    font-variant-numeric: tabular-nums;
}

.hud-bottom-left__chips {
    display: flex;
    gap: 10px;
    padding-top: 6px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.hud-bottom-left__chip {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10.5px;
    font-weight: 600;
    color: #cbd5e1;
}

.hud-bottom-left__chip.is-low {
    color: #fca5a5;
    animation: hud-pulse 1.6s ease-in-out infinite;
}

.hud-bottom-left__chip-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    box-shadow: 0 0 6px currentColor;
}

.hud-bottom-left__chip-label {
    letter-spacing: 0.04em;
}

.hud-bottom-left__chip-value {
    font-variant-numeric: tabular-nums;
    font-weight: 700;
    color: #f8fafc;
}

@keyframes hud-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.55; }
}

/* ── Bottom-right ─────────────────────────────────────────────────── */
.hud-bottom-right {
    position: fixed;
    bottom: 20px;
    right: 24px;
    z-index: 20;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px 10px 12px;
    color: #f8fafc;
    font-family: 'Geist Variable', 'Geist', 'Segoe UI', sans-serif;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
    pointer-events: none;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 10px;
    background: linear-gradient(180deg, rgba(8, 12, 20, 0.72), rgba(8, 12, 20, 0.52));
    backdrop-filter: blur(10px) saturate(160%);
    -webkit-backdrop-filter: blur(10px) saturate(160%);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

.hud-bottom-right__compass {
    position: relative;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%);
    border: 1px solid rgba(255, 255, 255, 0.18);
    flex-shrink: 0;
}

.hud-bottom-right__dial {
    position: absolute;
    inset: 0;
    transition: transform 220ms ease-out;
}

.hud-bottom-right__needle {
    position: absolute;
    left: 50%;
    top: 6px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 12px solid #f43f5e;
    transform: translateX(-50%);
    filter: drop-shadow(0 0 4px #f43f5e88);
}

.hud-bottom-right__mark {
    position: absolute;
    font-size: 8px;
    font-weight: 700;
    color: rgba(248, 250, 252, 0.55);
    letter-spacing: 0.02em;
}

.hud-bottom-right__mark--n {
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    color: #f8fafc;
}

.hud-bottom-right__mark--e {
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
}

.hud-bottom-right__mark--s {
    bottom: 2px;
    left: 50%;
    transform: translateX(-50%);
}

.hud-bottom-right__mark--w {
    left: 3px;
    top: 50%;
    transform: translateY(-50%);
}

.hud-bottom-right__cardinal {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #f8fafc;
    pointer-events: none;
    z-index: 2;
}

.hud-bottom-right__location {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.hud-bottom-right__district {
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.02em;
}

.hud-bottom-right__street {
    font-size: 11px;
    font-weight: 600;
    color: #cbd5e1;
}

.hud-bottom-right__coords {
    display: flex;
    gap: 8px;
    font-family: 'Geist Mono', 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #94a3b8;
    font-variant-numeric: tabular-nums;
}
</style>