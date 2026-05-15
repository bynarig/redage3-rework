<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useDevice } from '../../../shared/composables/useDevice'

import MapsIcon from '../../../shared/assets/icons/apps/maps/light.png'
import MessagesIcon from '../../../shared/assets/icons/apps/messages/light.png'
import WeatherIcon from '../../../shared/assets/icons/apps/weather/light.png'
import PhoneIcon from '../../../shared/assets/icons/apps/phone/light.png'
import SettingsIcon from '../../../shared/assets/icons/apps/settings/light.png'
import NewsIcon from '../../../shared/assets/icons/apps/news/light.png'
import ForbesIcon from '../../../shared/assets/icons/apps/forbes/light.png'
import AuctionIcon from '../../../shared/assets/icons/apps/auction/light.png'
import TruckerIcon from '../../../shared/assets/icons/apps/trucker/light.png'
import TaxiIcon from '../../../shared/assets/icons/apps/taxi/light.png'
import GalleryIcon from '../../../shared/assets/icons/apps/photos/light.png'
import PropertyIcon from '../../../shared/assets/icons/apps/estate/light.png'
import RentalIcon from '../../../shared/assets/icons/apps/rental/light.png'
import SupportIcon from '../../../shared/assets/icons/apps/support/light.png'

const device = useDevice()

interface WatchApp {
    id: string
    name: string
    bg: string
    icon: string | null
    emoji: string
    page: string
}

const APPS: WatchApp[] = [
    { id: 'activity', name: 'Activity',  bg: '#1C1C1E',     icon: null,        emoji: '🏃', page: 'activity' },
    { id: 'messages', name: 'Messages',  bg: '#34C759',     icon: MessagesIcon, emoji: '💬', page: 'messages' },
    { id: 'maps',     name: 'Maps',      bg: '#3D8B3F',     icon: MapsIcon,    emoji: '🗺', page: 'maps' },
    { id: 'weather',  name: 'Weather',   bg: '#1A6DBE',     icon: WeatherIcon, emoji: '🌤', page: 'weather' },
    { id: 'phone',    name: 'Phone',     bg: '#28C450',     icon: PhoneIcon,   emoji: '📞', page: 'call' },
    { id: 'radio',    name: 'Radio',     bg: '#FF2D55',     icon: null,        emoji: '📻', page: 'radio' },
    { id: 'taxi',     name: 'Taxi',      bg: '#FFD60A',     icon: TaxiIcon,    emoji: '🚕', page: 'taxi' },
    { id: 'trucker',  name: 'Trucker',   bg: '#636366',     icon: TruckerIcon, emoji: '🚚', page: 'trucker' },
    { id: 'cars',     name: 'Cars',      bg: '#48484A',     icon: null,        emoji: '🚗', page: 'cars' },
    { id: 'mech',     name: 'Mechanic',  bg: '#2C6E8A',     icon: null,        emoji: '🔧', page: 'mech' },
    { id: 'news',     name: 'News',      bg: '#FF3B30',     icon: NewsIcon,    emoji: '📰', page: 'news' },
    { id: 'forbes',   name: 'Forbes',    bg: '#5856D6',     icon: ForbesIcon,  emoji: '💰', page: 'forbes' },
    { id: 'auction',  name: 'Auction',   bg: '#FF9500',     icon: AuctionIcon, emoji: '🔨', page: 'auction' },
    { id: 'property', name: 'Property',  bg: '#007AFF',     icon: PropertyIcon, emoji: '🏠', page: 'property' },
    { id: 'tinder',   name: 'Tinder',    bg: '#FF2D55',     icon: null,        emoji: '❤', page: 'tinder' },
    { id: 'settings', name: 'Settings',  bg: '#8E8E93',     icon: SettingsIcon, emoji: '⚙', page: 'settings' },
    { id: 'gallery',  name: 'Gallery',   bg: 'linear-gradient(135deg,#FF3B30,#FF9500,#FFD60A,#34C759,#007AFF,#5856D6)', icon: GalleryIcon, emoji: '📷', page: 'gallery' },
    { id: 'support',  name: 'Support',   bg: '#5AC8FA',     icon: SupportIcon, emoji: '🆘', page: 'support' },
]

// Honeycomb grid constants
const ICON_D = 44
const GAP = 7
const COL_W = ICON_D + GAP   // 51 — horizontal center-to-center
const ROW_H = COL_W * 0.8660 // 44.2 — vertical center-to-center (sin60°)

// Row pattern: 4-3-4-3-4 = 18 apps
// Even rows (0,2,4): 4 icons, no offset
// Odd rows (1,3): 3 icons, offset by half COL_W
const ROWS = [
    { count: 4, offset: 0 },
    { count: 3, offset: COL_W / 2 },
    { count: 4, offset: 0 },
    { count: 3, offset: COL_W / 2 },
    { count: 4, offset: 0 },
]

interface AppPosition { app: WatchApp; x: number; y: number; idx: number }

const positions: AppPosition[] = []
let idx = 0
for (let row = 0; row < ROWS.length; row++) {
    const rowDef = ROWS[row]!
    for (let col = 0; col < rowDef.count && idx < APPS.length; col++) {
        const app = APPS[idx]!
        positions.push({
            app,
            x: col * COL_W + rowDef.offset,
            y: row * ROW_H,
            idx,
        })
        idx++
    }
}

// Grid natural size
const GRID_W = 3 * COL_W + ICON_D // 197px
const GRID_H = 4 * ROW_H + ICON_D  // ~220.8px

// Screen dimensions (match watch.scss: 70.3% of 320 × ratio 410/502)
const SCREEN_W = 225
const SCREEN_H = 275

// Center the grid on screen initially
const INIT_X = (SCREEN_W - GRID_W) / 2   // ~14px
const INIT_Y = (SCREEN_H - GRID_H) / 2   // ~27px

const panX = ref(INIT_X)
const panY = ref(INIT_Y)

// Scale effect — icons near screen center appear slightly larger
const iconStyles = computed(() => positions.map(p => {
    const cx = p.x + ICON_D / 2 + panX.value
    const cy = p.y + ICON_D / 2 + panY.value
    const dx = cx - SCREEN_W / 2
    const dy = cy - SCREEN_H / 2
    const dist = Math.sqrt(dx * dx + dy * dy)
    const scale = 1.0 - 0.22 * Math.min(dist / 120, 1)
    return {
        left: p.x + 'px',
        top: p.y + 'px',
        transform: `scale(${scale.toFixed(3)})`,
        opacity: Math.max(0.45, scale).toFixed(3),
        '--delay': `${p.idx * 28}ms`,
    }
}))

// Pan gesture with momentum
let isDragging = false
let startClientX = 0
let startClientY = 0
let startPanX = 0
let startPanY = 0
let dragDist = 0
let velX = 0
let velY = 0
let lastMoveX = 0
let lastMoveY = 0
let animFrame = 0

const clampPan = (x: number, y: number) => {
    const minX = SCREEN_W - GRID_W - ICON_D
    const maxX = ICON_D
    const minY = SCREEN_H - GRID_H - ICON_D
    const maxY = ICON_D
    return {
        x: Math.min(maxX, Math.max(minX, x)),
        y: Math.min(maxY, Math.max(minY, y)),
    }
}

const onPointerDown = (e: PointerEvent) => {
    cancelAnimationFrame(animFrame)
    isDragging = true
    dragDist = 0
    velX = 0; velY = 0
    startClientX = e.clientX
    startClientY = e.clientY
    startPanX = panX.value
    startPanY = panY.value
    lastMoveX = e.clientX
    lastMoveY = e.clientY
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
    if (!isDragging) return
    const dx = e.clientX - lastMoveX
    const dy = e.clientY - lastMoveY
    velX = dx * 0.6 + velX * 0.4
    velY = dy * 0.6 + velY * 0.4
    lastMoveX = e.clientX
    lastMoveY = e.clientY
    const totalDx = e.clientX - startClientX
    const totalDy = e.clientY - startClientY
    dragDist = Math.sqrt(totalDx * totalDx + totalDy * totalDy)
    const clamped = clampPan(startPanX + totalDx, startPanY + totalDy)
    panX.value = clamped.x
    panY.value = clamped.y
}

const onPointerUp = () => {
    if (!isDragging) return
    isDragging = false
    const decay = () => {
        velX *= 0.88; velY *= 0.88
        if (Math.abs(velX) < 0.3 && Math.abs(velY) < 0.3) return
        const clamped = clampPan(panX.value + velX, panY.value + velY)
        panX.value = clamped.x
        panY.value = clamped.y
        animFrame = requestAnimationFrame(decay)
    }
    animFrame = requestAnimationFrame(decay)
}

const onIconClick = (app: WatchApp) => {
    if (dragDist > 6) return
    device.setPage(app.page as any)
}

const goBack = (e: MouseEvent) => {
    e.stopPropagation()
    device.setPage('mainmenu')
}

onUnmounted(() => cancelAnimationFrame(animFrame))
</script>

<template>
    <div class="awh-root">
        <!-- Crown / back button -->
        <div class="awh-crown" @click="goBack">
            <div class="awh-crown-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
                    <path d="M5 7l2.5-2.5L10 7" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    <path d="M7.5 4.5V10" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" stroke-linecap="round" fill="none"/>
                </svg>
            </div>
        </div>

        <!-- Grid viewport — captures drag events -->
        <div
            class="awh-viewport"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerUp"
            @pointercancel="onPointerUp"
        >
            <!-- Movable grid container -->
            <div
                class="awh-grid"
                :style="{ transform: `translate(${panX}px, ${panY}px)` }"
            >
                <div
                    v-for="(pos, i) in positions"
                    :key="pos.app.id"
                    class="awh-icon-wrap"
                    :style="iconStyles[i]"
                    @click.stop="onIconClick(pos.app)"
                >
                    <div
                        class="awh-icon"
                        :style="{ background: pos.app.bg }"
                        :class="{ 'awh-icon--taxi': pos.app.id === 'taxi' }"
                    >
                        <img
                            v-if="pos.app.icon"
                            :src="pos.app.icon"
                            :alt="pos.app.name"
                            class="awh-icon-img"
                            :class="{ 'awh-icon-img--dark': pos.app.id === 'taxi' }"
                        />
                        <span v-else class="awh-icon-emoji">{{ pos.app.emoji }}</span>
                    </div>
                    <span class="awh-label">{{ pos.app.name }}</span>
                </div>
            </div>
        </div>

        <!-- Top fade vignette -->
        <div class="awh-vignette-top"></div>
        <div class="awh-vignette-bottom"></div>
    </div>
</template>

<style scoped>
.awh-root {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
    overflow: hidden;
}

/* ── Crown / Back ── */
.awh-crown {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    cursor: pointer;
    padding: 6px;
    -webkit-tap-highlight-color: transparent;
}
.awh-crown-icon {
    opacity: 0.6;
    transition: opacity 0.15s;
}
.awh-crown:active .awh-crown-icon {
    opacity: 1;
}

/* ── Grid viewport ── */
.awh-viewport {
    position: absolute;
    inset: 0;
    cursor: grab;
    touch-action: none;
}
.awh-viewport:active {
    cursor: grabbing;
}

/* ── Grid layer ── */
.awh-grid {
    position: absolute;
    top: 0;
    left: 0;
    will-change: transform;
}

/* ── Individual icon wrapper ── */
.awh-icon-wrap {
    position: absolute;
    width: 44px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform-origin: center center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                opacity 0.12s ease;
}

.awh-icon-wrap:active .awh-icon {
    transform: scale(0.87);
    filter: brightness(1.15);
}

/* ── Icon circle ── */
.awh-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    transition: transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1),
                filter 0.12s ease;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.06) inset;
    animation-name: awh-pop;
    animation-duration: 0.45s;
    animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    animation-delay: var(--delay, 0ms);
    animation-fill-mode: both;
}

.awh-icon-img {
    width: 68%;
    height: 68%;
    object-fit: contain;
    pointer-events: none;
}
.awh-icon-img--dark {
    filter: brightness(0) invert(0);
}

.awh-icon-emoji {
    font-size: 22px;
    line-height: 1;
    pointer-events: none;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));
}

/* ── App label ── */
.awh-label {
    margin-top: 4px;
    font-size: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    font-weight: 500;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.02em;
    text-align: center;
    max-width: 52px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
    text-shadow: 0 1px 3px rgba(0,0,0,0.8);
}

/* ── Vignette fades ── */
.awh-vignette-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 44px;
    background: linear-gradient(to bottom, #000 0%, transparent 100%);
    pointer-events: none;
    z-index: 10;
}
.awh-vignette-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 44px;
    background: linear-gradient(to top, #000 0%, transparent 100%);
    pointer-events: none;
    z-index: 10;
}

/* ── Entry animation ── */
@keyframes awh-pop {
    0%   { opacity: 0; transform: scale(0.3); }
    60%  { opacity: 1; transform: scale(1.08); }
    100% { opacity: 1; transform: scale(1); }
}
</style>
