<script setup lang="ts">
import { useSettings } from '@/views/accessories/shared/composables/useSettings'
import type { SettingsSubView } from '@/views/accessories/shared/composables/useSettings'

const {
    selectedView, isAir, forbesVisible, wallpapers, selectWallpaper,
    selectRingtoneIndex, selectSmsIndex, ringtoneSounds, smsSounds,
    updateAirStatus, updateForbesVisible, onSelectRingtone, onSelectSms, onOpenView,
} = useSettings()

const sidebarItems = [
    { id: 'Wallpaper', label: 'Обои', icon: 'wallpaper' },
    { id: 'SoundList', label: 'Рингтоны', icon: 'sound' },
    { id: 'SmsList', label: 'Уведомления', icon: 'sms' },
]
</script>

<template>
    <div class="settings-app">
        <div class="sidebar">
            <div class="sidebar-header">
                <span class="sidebar-title">Настройки</span>
            </div>

            <div class="sidebar-list">
                <!-- Toggles -->
                <div class="setting-row toggle-row">
                    <div class="setting-icon air-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12.5a7 7 0 0 1 14 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <path d="M2 16.5a11 11 0 0 1 20 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <path d="M8 8.5a4 4 0 0 1 8 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <span class="setting-label">Авиарежим</span>
                    <div class="toggle-wrap" @click="updateAirStatus">
                        <div class="toggle" :class="{ on: isAir }">
                            <div class="toggle-thumb" />
                        </div>
                    </div>
                </div>

                <div class="setting-row toggle-row">
                    <div class="setting-icon forbes-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2"/>
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <span class="setting-label">Forbes приватность</span>
                    <div class="toggle-wrap" @click="updateForbesVisible">
                        <div class="toggle" :class="{ on: !forbesVisible }">
                            <div class="toggle-thumb" />
                        </div>
                    </div>
                </div>

                <div class="sidebar-separator" />

                <!-- Nav items -->
                <div
                    v-for="item in sidebarItems"
                    :key="item.id"
                    class="setting-row nav-row"
                    :class="{ active: selectedView === item.id }"
                    @click="onOpenView(item.id as SettingsSubView)"
                >
                    <div class="setting-icon nav-icon">
                        <template v-if="item.icon === 'wallpaper'">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" stroke-width="2"/>
                                <path d="M3 15l5-5 4 4 3-3 6 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </template>
                        <template v-else-if="item.icon === 'sound'">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" stroke="white" stroke-width="2" stroke-linejoin="round"/>
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </template>
                        <template v-else>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" stroke-width="2" stroke-linecap="round"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </template>
                    </div>
                    <span class="setting-label">{{ item.label }}</span>
                    <svg class="nav-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                        <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>

        <div class="content-area">
            <!-- Main / default -->
            <div v-if="selectedView === null" class="content-empty">
                <div class="content-empty-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="3" stroke="#6e6e73" stroke-width="2"/>
                        <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#6e6e73" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="content-empty-text">Выберите раздел настроек</div>
            </div>

            <!-- Wallpaper -->
            <template v-else-if="selectedView === 'Wallpaper'">
                <div class="content-header">
                    <button class="back-btn" @click="onOpenView(null)">&#8249; Назад</button>
                    <span class="content-title">Обои</span>
                </div>
                <div class="wallpaper-grid">
                    <div
                        v-for="url in wallpapers"
                        :key="url"
                        class="wallpaper-thumb"
                        :class="{ selected: selectWallpaper === url }"
                        :style="{ backgroundImage: `url(${url})` }"
                        @click="selectWallpaper = url"
                    >
                        <div v-if="selectWallpaper === url" class="wallpaper-check">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7l4 4 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Ringtones -->
            <template v-else-if="selectedView === 'SoundList'">
                <div class="content-header">
                    <button class="back-btn" @click="onOpenView(null)">&#8249; Назад</button>
                    <span class="content-title">Рингтоны</span>
                </div>
                <div class="sound-list">
                    <div
                        v-for="(item, index) in ringtoneSounds"
                        :key="item.url"
                        class="sound-item"
                        @click="onSelectRingtone(item.url, index)"
                    >
                        <div class="sound-check">
                            <svg v-if="selectRingtoneIndex === index" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7l4 4 6-6" stroke="#007aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span class="sound-name">{{ item.name }}</span>
                        <svg class="sound-play" width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <polygon points="5,3 19,12 5,21" stroke="#007aff" stroke-width="2" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </template>

            <!-- SMS sounds -->
            <template v-else-if="selectedView === 'SmsList'">
                <div class="content-header">
                    <button class="back-btn" @click="onOpenView(null)">&#8249; Назад</button>
                    <span class="content-title">Уведомления</span>
                </div>
                <div class="sound-list">
                    <div
                        v-for="(item, index) in smsSounds"
                        :key="item.url"
                        class="sound-item"
                        @click="onSelectSms(item.url, index)"
                    >
                        <div class="sound-check">
                            <svg v-if="selectSmsIndex === index" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7l4 4 6-6" stroke="#007aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <span class="sound-name">{{ item.name }}</span>
                        <svg class="sound-play" width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <polygon points="5,3 19,12 5,21" stroke="#007aff" stroke-width="2" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.settings-app {
    display: flex;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.sidebar {
    width: 260px;
    flex-shrink: 0;
    background: #fff;
    border-right: 1px solid rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.sidebar-header {
    padding: 20px 16px 12px;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.sidebar-title {
    font-size: 20px;
    font-weight: 700;
    color: #1d1d1f;
}

.sidebar-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
}

.setting-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 16px;
    min-height: 48px;
    cursor: pointer;
    transition: background 0.12s;
}

.setting-row:hover {
    background: rgba(0,0,0,0.04);
}

.setting-row.active {
    background: rgba(0, 122, 255, 0.08);
}

.setting-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.air-icon { background: #5856d6; }
.forbes-icon { background: #34c759; }
.nav-icon { background: #007aff; }

.setting-label {
    flex: 1;
    font-size: 14px;
    color: #1d1d1f;
}

.toggle-wrap {
    flex-shrink: 0;
}

.toggle {
    width: 36px;
    height: 20px;
    background: rgba(0,0,0,0.15);
    border-radius: 10px;
    position: relative;
    transition: background 0.2s;
    cursor: pointer;
}

.toggle.on {
    background: #34c759;
}

.toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    transition: transform 0.2s;
}

.toggle.on .toggle-thumb {
    transform: translateX(16px);
}

.nav-chevron {
    flex-shrink: 0;
}

.sidebar-separator {
    height: 1px;
    background: rgba(0,0,0,0.08);
    margin: 8px 0;
}

/* Content area */
.content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f5f5f7;
}

.content-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #6e6e73;
}

.content-empty-icon {
    width: 72px;
    height: 72px;
    background: rgba(0,0,0,0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content-empty-text {
    font-size: 14px;
    color: #6e6e73;
}

.content-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.back-btn {
    background: none;
    border: none;
    color: #007aff;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
}

.content-title {
    font-size: 17px;
    font-weight: 600;
    color: #1d1d1f;
}

/* Wallpapers */
.wallpaper-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    padding: 16px;
    overflow-y: auto;
    flex: 1;
}

.wallpaper-grid::-webkit-scrollbar {
    width: 4px;
}

.wallpaper-grid::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.15);
    border-radius: 2px;
}

.wallpaper-thumb {
    aspect-ratio: 16/10;
    background-size: cover;
    background-position: center;
    background-color: #e5e5ea;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    border: 2px solid transparent;
    transition: border-color 0.15s;
}

.wallpaper-thumb.selected {
    border-color: #007aff;
}

.wallpaper-check {
    position: absolute;
    bottom: 6px;
    right: 6px;
    width: 22px;
    height: 22px;
    background: #007aff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Sound list */
.sound-list {
    flex: 1;
    overflow-y: auto;
    background: #fff;
}

.sound-list::-webkit-scrollbar {
    width: 4px;
}

.sound-list::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.15);
    border-radius: 2px;
}

.sound-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    transition: background 0.12s;
}

.sound-item:last-child {
    border-bottom: none;
}

.sound-item:hover {
    background: rgba(0,0,0,0.03);
}

.sound-check {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.sound-name {
    flex: 1;
    font-size: 14px;
    color: #1d1d1f;
}

.sound-play {
    flex-shrink: 0;
}
</style>
