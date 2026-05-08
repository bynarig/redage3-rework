<script setup lang="ts">
import { executeClient } from '@/api/rage'
import PhoneMap from '../../../phone/components/gps/PhoneMap.vue'
import { useGps } from '@/views/accessories/shared/composables/useGps'

const {
    position, streetName, areaName, selectedCategory, selectedList,
    elementWidth, elementHeight, mainElement, otherElement,
    categoriesList, catIconMap, onDefaultPoint, closeMenu, updateHeightMap,
} = useGps()
</script>

<template>
    <div class="gps-app" ref="mainElement">
        <div class="map-area">
            <PhoneMap
                v-if="position && elementHeight"
                :position="[position.x, position.y]"
                :element-width="elementWidth"
                :element-height="elementHeight"
            />
            <div v-else class="map-placeholder">
                <div class="map-placeholder-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#6e6e73" stroke-width="1.5"/>
                        <circle cx="12" cy="9" r="2.5" stroke="#6e6e73" stroke-width="1.5"/>
                    </svg>
                </div>
                <span>Определение позиции...</span>
            </div>

            <div class="location-badge">
                <div class="location-dot"></div>
                <div class="location-text">
                    <div class="street-name">{{ streetName || 'Загрузка...' }}</div>
                    <div class="area-name">{{ areaName }}</div>
                </div>
            </div>
        </div>

        <div class="panel-area" ref="otherElement">
            <div class="quick-shortcuts">
                <button class="shortcut-btn" @click="onDefaultPoint('house')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Дом
                </button>
                <button class="shortcut-btn" @click="onDefaultPoint('biz')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Бизнес
                </button>
                <button class="shortcut-btn" @click="onDefaultPoint('frac')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Фракция
                </button>
                <button class="shortcut-btn" @click="onDefaultPoint('org')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                        <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    Организация
                </button>
            </div>

            <div class="panel-content">
                <!-- Category grid -->
                <div v-if="selectedCategory === null && selectedList === null" class="category-section">
                    <div class="section-header">
                        <span class="section-title">Категории</span>
                    </div>
                    <div class="category-grid">
                        <div
                            v-for="(cat, idx) in categoriesList"
                            :key="cat.name"
                            class="category-item"
                            @click="selectedCategory = idx; updateHeightMap()"
                        >
                            <div class="cat-icon-wrap">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#007aff" stroke-width="1.5"/>
                                </svg>
                            </div>
                            <span class="cat-name">{{ cat.name }}</span>
                        </div>
                    </div>
                </div>

                <!-- Subcategory list -->
                <div v-else-if="selectedCategory !== null && selectedList === null" class="subcategory-section">
                    <div class="section-header">
                        <button class="back-btn" @click="selectedCategory = null; updateHeightMap()">
                            &#8249; Категории
                        </button>
                        <span class="section-title">{{ categoriesList[selectedCategory]?.name }}</span>
                    </div>
                    <div class="list-items">
                        <div
                            v-for="item in categoriesList[selectedCategory]?.content ?? []"
                            :key="item"
                            class="list-item"
                            @click="selectedList = item; updateHeightMap()"
                        >
                            <div class="list-item-dot">
                                <svg width="8" height="8" viewBox="0 0 8 8" fill="#007aff">
                                    <circle cx="4" cy="4" r="4"/>
                                </svg>
                            </div>
                            <span class="list-item-text">{{ item }}</span>
                            <svg class="list-item-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                                <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </div>

                <!-- Location detail -->
                <div v-else class="location-detail">
                    <div class="section-header">
                        <button class="back-btn" @click="selectedList = null; updateHeightMap()">
                            &#8249; Назад
                        </button>
                        <span class="section-title">{{ selectedList }}</span>
                    </div>
                    <div class="detail-body">
                        <div class="detail-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#007aff" stroke-width="1.5"/>
                                <circle cx="12" cy="9" r="2.5" fill="#007aff"/>
                            </svg>
                        </div>
                        <div class="detail-name">{{ selectedList }}</div>
                        <button class="primary-btn" @click="executeClient('gps.pointDefault', selectedList!)">
                            Построить маршрут
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.gps-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.map-area {
    flex: 1;
    position: relative;
    background: #dde8d4;
    overflow: hidden;
    min-height: 0;
}

.map-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #6e6e73;
    font-size: 14px;
}

.map-placeholder-icon {
    width: 64px;
    height: 64px;
    background: rgba(0,0,0,0.06);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.location-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(8px);
    border-radius: 10px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}

.location-dot {
    width: 8px;
    height: 8px;
    background: #007aff;
    border-radius: 50%;
    flex-shrink: 0;
}

.street-name {
    font-size: 13px;
    font-weight: 600;
    color: #1d1d1f;
}

.area-name {
    font-size: 11px;
    color: #6e6e73;
}

.panel-area {
    flex-shrink: 0;
    background: #ffffff;
    border-top: 1px solid rgba(0,0,0,0.08);
    max-height: 45%;
    overflow-y: auto;
}

.panel-area::-webkit-scrollbar {
    width: 4px;
}

.panel-area::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.15);
    border-radius: 2px;
}

.quick-shortcuts {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    overflow-x: auto;
}

.quick-shortcuts::-webkit-scrollbar {
    display: none;
}

.shortcut-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: rgba(0, 122, 255, 0.1);
    color: #007aff;
    border: none;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s;
}

.shortcut-btn:hover {
    background: rgba(0, 122, 255, 0.18);
}

.panel-content {
    padding: 0;
}

.section-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px 8px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.section-title {
    font-size: 15px;
    font-weight: 600;
    color: #1d1d1f;
}

.back-btn {
    background: none;
    border: none;
    color: #007aff;
    font-size: 14px;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
    padding: 12px 16px;
}

.category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    background: rgba(0,0,0,0.03);
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s;
}

.category-item:hover {
    background: rgba(0,0,0,0.06);
}

.cat-icon-wrap {
    width: 36px;
    height: 36px;
    background: rgba(0,122,255,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cat-name {
    font-size: 11px;
    font-weight: 500;
    color: #1d1d1f;
    text-align: center;
    line-height: 1.3;
}

.list-items {
    padding: 4px 0;
}

.list-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    transition: background 0.12s;
}

.list-item:last-child {
    border-bottom: none;
}

.list-item:hover {
    background: rgba(0,0,0,0.04);
}

.list-item-dot {
    flex-shrink: 0;
}

.list-item-text {
    flex: 1;
    font-size: 14px;
    color: #1d1d1f;
}

.list-item-chevron {
    flex-shrink: 0;
}

.detail-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px 16px;
}

.detail-icon {
    width: 56px;
    height: 56px;
    background: rgba(0,122,255,0.1);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.detail-name {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
    text-align: center;
}

.primary-btn {
    padding: 10px 24px;
    background: #007aff;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
}

.primary-btn:hover {
    opacity: 0.88;
}
</style>
