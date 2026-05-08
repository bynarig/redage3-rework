<script setup lang="ts">
import { useCars } from '@/views/accessories/shared/composables/useCars'

const { isLoad, selectedCar, searchText, functionList, filteredCars, onCarAction, setPointRental } = useCars()
</script>

<template>
    <div v-if="!isLoad" class="loading-state">
        <div class="spinner" />
        <span>Загрузка...</span>
    </div>

    <div v-else class="cars-app">
        <div class="cars-header">
            <div class="header-brand">
                <div class="brand-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="10" width="20" height="8" rx="2" stroke="white" stroke-width="2"/>
                        <path d="M5 10V8a7 7 0 0 1 14 0v2" stroke="white" stroke-width="2"/>
                        <circle cx="7" cy="18" r="2" fill="white"/>
                        <circle cx="17" cy="18" r="2" fill="white"/>
                    </svg>
                </div>
                <div>
                    <div class="brand-title"><span class="brand-accent">Управление </span>транспортом</div>
                    <div class="brand-sub">Ваши автомобили</div>
                </div>
            </div>
        </div>

        <!-- Car detail view -->
        <template v-if="selectedCar !== null">
            <div class="detail-header">
                <button class="back-btn" @click="selectedCar = null">&#8249; Список</button>
                <span class="detail-title">{{ selectedCar.model }}</span>
            </div>
            <div class="car-detail">
                <div class="car-visual">
                    <div class="car-avatar">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="10" width="20" height="8" rx="2" stroke="#007aff" stroke-width="1.5"/>
                            <path d="M5 10V8a7 7 0 0 1 14 0v2" stroke="#007aff" stroke-width="1.5"/>
                            <circle cx="7" cy="18" r="2" fill="#007aff"/>
                            <circle cx="17" cy="18" r="2" fill="#007aff"/>
                        </svg>
                    </div>
                    <div class="car-model">{{ selectedCar.model }}</div>
                    <div class="car-plate">{{ selectedCar.number }}</div>
                </div>
                <div class="action-grid">
                    <div
                        v-for="f in functionList"
                        :key="f.func"
                        class="action-card"
                        @click="onCarAction(selectedCar!, f.func)"
                    >
                        <div class="action-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#007aff" stroke-width="1.5"/>
                                <path d="M12 8v4l3 3" stroke="#007aff" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <span class="action-name">{{ f.name }}</span>
                    </div>
                </div>
            </div>
        </template>

        <!-- Car list view -->
        <template v-else>
            <div class="search-bar">
                <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="#6e6e73" stroke-width="2"/>
                    <path d="M21 21l-4.35-4.35" stroke="#6e6e73" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <input
                    v-model="searchText"
                    class="search-input"
                    type="text"
                    placeholder="Поиск транспорта..."
                />
            </div>
            <div class="car-list">
                <template v-if="filteredCars().length > 0">
                    <div
                        v-for="car in filteredCars()"
                        :key="car.number"
                        class="car-item"
                        @click="selectedCar = car"
                    >
                        <div class="car-item-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="10" width="20" height="8" rx="2" stroke="#007aff" stroke-width="2"/>
                                <path d="M5 10V8a7 7 0 0 1 14 0v2" stroke="#007aff" stroke-width="2"/>
                                <circle cx="7" cy="18" r="2" fill="#007aff"/>
                                <circle cx="17" cy="18" r="2" fill="#007aff"/>
                            </svg>
                        </div>
                        <div class="car-item-info">
                            <div class="car-item-model">{{ car.model }}</div>
                            <div class="car-item-plate">{{ car.number }}</div>
                        </div>
                        <svg class="car-item-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                            <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </template>
                <div v-else class="empty-state">
                    <div class="empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="10" width="20" height="8" rx="2" stroke="#6e6e73" stroke-width="1.5"/>
                            <path d="M5 10V8a7 7 0 0 1 14 0v2" stroke="#6e6e73" stroke-width="1.5"/>
                        </svg>
                    </div>
                    <div class="empty-title">Транспорта нет</div>
                </div>
            </div>
            <div class="footer-action">
                <button class="rental-btn" @click="setPointRental">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    Ближайшая аренда
                </button>
            </div>
        </template>
    </div>
</template>

<style scoped>
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 12px;
    color: #6e6e73;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
}

.spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(0,0,0,0.1);
    border-top-color: #007aff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.cars-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.cars-header {
    padding: 16px 20px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.header-brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-icon {
    width: 42px;
    height: 42px;
    background: linear-gradient(135deg, #007aff, #5856d6);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.brand-title {
    font-size: 17px;
    font-weight: 700;
    color: #1d1d1f;
}

.brand-accent {
    color: #007aff;
}

.brand-sub {
    font-size: 12px;
    color: #6e6e73;
    margin-top: 1px;
}

/* Detail view */
.detail-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
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

.detail-title {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
}

.car-detail {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.car-detail::-webkit-scrollbar {
    width: 4px;
}

.car-detail::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.12);
    border-radius: 2px;
}

.car-visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
}

.car-avatar {
    width: 88px;
    height: 88px;
    background: rgba(0,122,255,0.08);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.car-model {
    font-size: 18px;
    font-weight: 700;
    color: #1d1d1f;
}

.car-plate {
    font-size: 14px;
    color: #6e6e73;
    font-family: monospace;
    background: rgba(0,0,0,0.05);
    padding: 4px 12px;
    border-radius: 6px;
}

.action-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
}

.action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 12px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,0.08);
    cursor: pointer;
    transition: background 0.12s;
}

.action-card:hover {
    background: rgba(0,122,255,0.04);
}

.action-icon {
    width: 36px;
    height: 36px;
    background: rgba(0,122,255,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-name {
    font-size: 12px;
    font-weight: 500;
    color: #1d1d1f;
    text-align: center;
}

/* List view */
.search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.search-icon {
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    border: none;
    background: none;
    font-size: 14px;
    color: #1d1d1f;
    outline: none;
    font-family: inherit;
}

.search-input::placeholder {
    color: #a0a0a5;
}

.car-list {
    flex: 1;
    overflow-y: auto;
    background: #fff;
}

.car-list::-webkit-scrollbar {
    width: 4px;
}

.car-list::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.12);
    border-radius: 2px;
}

.car-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    transition: background 0.12s;
    min-height: 52px;
}

.car-item:last-child {
    border-bottom: none;
}

.car-item:hover {
    background: rgba(0,0,0,0.03);
}

.car-item-icon {
    width: 36px;
    height: 36px;
    background: rgba(0,122,255,0.08);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.car-item-info {
    flex: 1;
}

.car-item-model {
    font-size: 14px;
    font-weight: 600;
    color: #1d1d1f;
}

.car-item-plate {
    font-size: 12px;
    color: #6e6e73;
    margin-top: 2px;
}

.car-item-chevron {
    flex-shrink: 0;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 40px;
    color: #6e6e73;
}

.empty-icon {
    width: 64px;
    height: 64px;
    background: rgba(0,0,0,0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-title {
    font-size: 15px;
    font-weight: 500;
    color: #6e6e73;
}

.footer-action {
    padding: 12px 16px;
    background: #fff;
    border-top: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.rental-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    padding: 11px;
    background: rgba(0,122,255,0.1);
    color: #007aff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.12s;
}

.rental-btn:hover {
    background: rgba(0,122,255,0.18);
}
</style>
