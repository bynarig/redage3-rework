<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { executeClientToGroup, executeClientAsyncToGroup } from '@/api/rage'

import MapsIcon from '../../../shared/assets/icons/apps/maps/light.png'
import GalleryIcon from '../../../shared/assets/icons/apps/photos/light.png'
import PropertyIcon from '../../../shared/assets/icons/apps/estate/light.png'
import NewsIcon from '../../../shared/assets/icons/apps/news/light.png'
import TruckerIcon from '../../../shared/assets/icons/apps/trucker/light.png'
import TaxiIcon from '../../../shared/assets/icons/apps/taxi/light.png'
import ForbesIcon from '../../../shared/assets/icons/apps/forbes/light.png'
import AppStoreIcon from '../../../shared/assets/icons/apps/appstore/light.png'
import RentalIcon from '../../../shared/assets/icons/apps/rental/light.png'
import AuctionIcon from '../../../shared/assets/icons/apps/auction/light.png'
import CallIcon from '../../../shared/assets/icons/apps/phone/light.png'
import MessagesIcon from '../../../shared/assets/icons/apps/messages/light.png'
import CameraIcon from '../../../shared/assets/icons/apps/camera/light.png'
import SettingsIcon from '../../../shared/assets/icons/apps/settings/light.png'
import WeatherIcon from '../../../shared/assets/icons/apps/weather/light.png'
import BrowserIcon from '../../../shared/assets/icons/apps/browser/light.png'
import SupportIcon from '../../../shared/assets/icons/apps/support/light.png'

const emit = defineEmits<{
    close: []
    openApp: [link: string | number]
}>()

const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const currentPage = ref(0)

const allApps = [
    { name: 'GPS', icon: MapsIcon, link: 'maps' },
    { name: 'Сообщения', icon: MessagesIcon, link: 'messages' },
    { name: 'Камера', icon: CameraIcon, link: 'camera' },
    { name: 'Галерея', icon: GalleryIcon, link: 'gallery' },
    { name: 'Имущество', icon: PropertyIcon, link: 'property' },
    { name: 'W.News', icon: NewsIcon, link: 'news' },
    { name: 'Развозчик', icon: TruckerIcon, link: 'trucker' },
    { name: 'Такси', icon: TaxiIcon, link: 'taxi' },
    { name: 'Аренда', icon: RentalIcon, link: 'rental' },
    { name: 'Механик', icon: SupportIcon, link: 'mech' },
    { name: 'Forbes', icon: ForbesIcon, link: 'forbes' },
    { name: 'Аукцион', icon: AuctionIcon, link: 'auction' },
    { name: 'Weather', icon: WeatherIcon, link: 'weather' },
    { name: 'Radio', icon: BrowserIcon, link: 'radio' },
    { name: 'Авто', icon: AppStoreIcon, link: 'cars' },
    { name: 'Tinder', icon: AppStoreIcon, link: 'tinder' },
    { name: 'Настройки', icon: SettingsIcon, link: 'settings' },
    { name: 'Подарок', icon: AppStoreIcon, link: 101 as number | string },
]

const APPS_PER_PAGE = 21 // 7 columns × 3 rows

const filteredApps = computed(() => {
    if (!searchQuery.value) return allApps
    const q = searchQuery.value.toLowerCase()
    return allApps.filter(app => app.name.toLowerCase().includes(q))
})

const isSearching = computed(() => searchQuery.value.length > 0)

const pages = computed(() => {
    const apps = filteredApps.value
    const result = []
    for (let i = 0; i < apps.length; i += APPS_PER_PAGE) {
        result.push(apps.slice(i, i + APPS_PER_PAGE))
    }
    return result.length ? result : [[]]
})

const pageCount = computed(() => pages.value.length)

const visibleApps = computed(() => {
    if (isSearching.value) return filteredApps.value
    return pages.value[currentPage.value] ?? []
})

const onAppClick = (link: number | string) => {
    if (link === 'camera') {
        executeClientAsyncToGroup('getGallery').then((result) => {
            if (result && typeof result === 'string') {
                const gallery = JSON.parse(result)
                if (gallery.length >= 25) {
                    emit('openApp', 'gallery')
                    ;(window as any).notificationAdd?.(4, 9, 'На ноутбуке закончилось место', 3000)
                } else {
                    emit('openApp', 'camera')
                }
            } else {
                emit('openApp', 'camera')
            }
        })
    } else {
        emit('openApp', link)
    }
}

const prevPage = () => {
    if (currentPage.value > 0) currentPage.value--
}

const nextPage = () => {
    if (currentPage.value < pageCount.value - 1) currentPage.value++
}

onMounted(() => {
    nextTick(() => searchInput.value?.focus())
})
</script>

<template>
    <div class="mac-launchpad" @click.self="emit('close')" @keyup.esc="emit('close')">
        <!-- Search Bar -->
        <div class="launchpad-search">
            <div class="search-box" :class="{ 'is-focused': searchQuery.length > 0 }">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round" class="search-icon">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Поиск"
                    ref="searchInput"
                    @keyup.esc="searchQuery ? (searchQuery = '') : emit('close')"
                />
                <button v-if="searchQuery" class="search-clear" @click.stop="searchQuery = ''">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- App Grid -->
        <div class="launchpad-grid-wrapper" @click.self="emit('close')">
            <TransitionGroup name="app-grid" tag="div" class="launchpad-grid">
                <div
                    v-for="app in visibleApps"
                    :key="String(app.link)"
                    class="launchpad-app"
                    @click.stop="onAppClick(app.link)"
                >
                    <div class="app-icon-wrap">
                        <img :src="app.icon" :alt="app.name" draggable="false" />
                    </div>
                    <span class="app-name">{{ app.name }}</span>
                </div>
            </TransitionGroup>
        </div>

        <!-- Page Dots -->
        <div v-if="!isSearching && pageCount > 1" class="page-dots">
            <button
                v-for="(_, i) in pageCount"
                :key="i"
                class="dot"
                :class="{ active: i === currentPage }"
                @click.stop="currentPage = i"
            />
        </div>

        <!-- Page arrows (only if multiple pages) -->
        <div v-if="!isSearching && pageCount > 1" class="page-arrows">
            <button class="arrow-btn" :disabled="currentPage === 0" @click.stop="prevPage">‹</button>
            <button class="arrow-btn" :disabled="currentPage === pageCount - 1" @click.stop="nextPage">›</button>
        </div>
    </div>
</template>

<style scoped>
.mac-launchpad {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(50px) saturate(180%);
    -webkit-backdrop-filter: blur(50px) saturate(180%);
    z-index: 90;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 3%;
    padding-bottom: 100px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", Helvetica, Arial, sans-serif;
    color: white;
    user-select: none;
}

/* Search */
.launchpad-search {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 5%;
    flex-shrink: 0;
}

.search-box {
    position: relative;
    width: 220px;
    height: 28px;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 14px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.2s;
    gap: 6px;
}

.search-box.is-focused,
.search-box:focus-within {
    width: 280px;
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.3);
}

.search-icon {
    opacity: 0.65;
    flex-shrink: 0;
}

.search-box input {
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 13px;
    width: 100%;
    font-family: inherit;
}

.search-box input::placeholder {
    color: rgba(255, 255, 255, 0.55);
}

.search-clear {
    background: rgba(255, 255, 255, 0.3);
    border: none;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    flex-shrink: 0;
    padding: 0;
}

/* Grid */
.launchpad-grid-wrapper {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
}

.launchpad-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 3% 2%;
    width: 78%;
    max-width: 900px;
    align-items: start;
    justify-items: center;
}

.launchpad-app {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    width: 80px;
}

.app-icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: 14px;
    overflow: hidden;
    transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                filter 0.15s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.app-icon-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.launchpad-app:hover .app-icon-wrap {
    transform: scale(1.12);
    filter: brightness(1.05);
}

.launchpad-app:active .app-icon-wrap {
    transform: scale(0.88);
    filter: brightness(0.82);
}

.app-name {
    font-size: 11px;
    font-weight: 500;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    text-align: center;
    letter-spacing: 0.1px;
    line-height: 1.2;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Page dots */
.page-dots {
    display: flex;
    gap: 6px;
    padding: 12px 0;
    flex-shrink: 0;
}

.dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background 0.2s, transform 0.2s;
}

.dot.active {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.15);
}

/* Page arrows */
.page-arrows {
    position: absolute;
    top: 50%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 2%;
    transform: translateY(-50%);
    pointer-events: none;
}

.arrow-btn {
    pointer-events: all;
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    font-size: 20px;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transition: background 0.2s;
}

.arrow-btn:hover {
    background: rgba(255, 255, 255, 0.22);
}

.arrow-btn:disabled {
    opacity: 0.25;
    cursor: default;
}

/* App grid animations */
.app-grid-enter-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.app-grid-leave-active {
    transition: opacity 0.15s ease;
    position: absolute;
}
.app-grid-enter-from {
    opacity: 0;
    transform: scale(0.85);
}
.app-grid-leave-to {
    opacity: 0;
}
</style>
