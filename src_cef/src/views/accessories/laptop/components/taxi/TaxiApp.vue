<script setup lang="ts">
import PhoneMap from '../../../phone/components/gps/PhoneMap.vue'
import { useTaxi } from '@/views/accessories/shared/composables/useTaxi'

const {
    isLoad, selectView, position, elementWidth, elementHeight,
    streetName, areaName, clientOrder, driverListData, driverSelect, isDriverSelect,
    mainElement, otherElement,
    closeMenu, onOrder, onCancelOrder, onTakeOrder, onDriverCancelOrder, onShowOnMap, onSelectView,
} = useTaxi()
</script>

<template>
    <div v-if="!isLoad" class="loading-state">
        <div class="spinner" />
        <span>Загрузка...</span>
    </div>

    <div v-else class="taxi-app" ref="mainElement">
        <div class="map-area">
            <PhoneMap
                v-if="position && elementHeight"
                :position="[position.x, position.y]"
                :element-width="elementWidth"
                :element-height="elementHeight"
            />
            <div v-else class="map-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#6e6e73" stroke-width="1.5"/>
                </svg>
                <span>Определение позиции...</span>
            </div>
            <div class="app-badge">
                <span class="badge-red">Red</span>Age Taxi
            </div>
        </div>

        <div class="panel-area" ref="otherElement">
            <!-- Mode selection -->
            <template v-if="selectView === 'List'">
                <div class="panel-header">
                    <span class="panel-title">Выберите режим</span>
                </div>
                <div class="panel-body">
                    <p class="panel-desc">В этом приложении вы можете заказать такси либо начать работать таксистом.</p>
                    <div class="mode-card" @click="onSelectView('Client')">
                        <div class="mode-icon client-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2"/>
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="mode-info">
                            <div class="mode-title">Клиент</div>
                            <div class="mode-sub">Вы хотите заказать такси</div>
                        </div>
                        <svg class="mode-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                            <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="mode-card" @click="onSelectView('Driver')">
                        <div class="mode-icon driver-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="10" width="20" height="8" rx="2" stroke="white" stroke-width="2"/>
                                <path d="M5 10V8a7 7 0 0 1 14 0v2" stroke="white" stroke-width="2"/>
                                <circle cx="7" cy="18" r="2" fill="white"/>
                                <circle cx="17" cy="18" r="2" fill="white"/>
                            </svg>
                        </div>
                        <div class="mode-info">
                            <div class="mode-title">Водитель</div>
                            <div class="mode-sub">Вы хотите работать в такси</div>
                        </div>
                        <svg class="mode-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                            <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </template>

            <!-- Client view -->
            <template v-else-if="selectView === 'Client'">
                <div class="panel-header">
                    <button class="back-btn" @click="onSelectView('List')">&#8249; Назад</button>
                    <span class="panel-title">Вызов такси</span>
                </div>
                <div v-if="clientOrder.driver" class="driver-active-banner">
                    <div class="driver-info">
                        <span class="driver-label">Водитель:</span>
                        <span class="driver-name">{{ clientOrder.driver }}</span>
                    </div>
                    <span class="driver-number">{{ clientOrder.number }}</span>
                </div>
                <div class="panel-body">
                    <div class="location-row">
                        <div class="location-dot" />
                        <div class="location-info">
                            <div class="location-label">Место прибытия</div>
                            <div class="location-value">{{ streetName }} — {{ areaName }}</div>
                        </div>
                    </div>
                    <template v-if="clientOrder.isOrder">
                        <div class="order-status">
                            <div class="order-status-dot" />
                            Заказ сделан — ожидайте водителя
                        </div>
                        <button class="secondary-btn danger" @click="onCancelOrder">Отменить заказ</button>
                    </template>
                    <template v-else>
                        <button class="primary-btn" @click="onOrder">Заказать такси</button>
                    </template>
                    <button class="secondary-btn" @click="closeMenu">Закрыть</button>
                </div>
            </template>

            <!-- Driver view -->
            <template v-else-if="selectView === 'Driver'">
                <div class="panel-header">
                    <button class="back-btn" @click="onSelectView('List')">&#8249; Назад</button>
                    <span class="panel-title">Активные заказы</span>
                </div>
                <div v-if="isDriverSelect" class="driver-active-banner">
                    <div class="driver-info">
                        <span class="driver-label">Клиент:</span>
                        <span class="driver-name">{{ driverSelect.name }}</span>
                    </div>
                </div>
                <div class="panel-body">
                    <template v-if="isDriverSelect">
                        <div class="location-row">
                            <div class="location-dot" />
                            <div class="location-info">
                                <div class="location-value">{{ driverSelect.aStreet }}</div>
                                <div class="location-label">{{ driverSelect.aArea }}</div>
                            </div>
                        </div>
                        <div class="route-built">Маршрут построен в GPS-навигаторе</div>
                        <button class="secondary-btn" @click="onShowOnMap">Показать на карте</button>
                        <button class="secondary-btn danger" @click="onDriverCancelOrder">Отменить заказ</button>
                    </template>
                    <template v-else>
                        <template v-if="driverListData.length > 0">
                            <div class="order-card" v-for="order in driverListData" :key="order.id">
                                <div class="order-meta">
                                    <div class="order-area">{{ order.area }}</div>
                                    <div class="order-dist">{{ order.dist }} м</div>
                                    <div class="order-client">Клиент: <strong>{{ order.name }}</strong></div>
                                </div>
                                <button class="primary-btn sm" @click="onTakeOrder(order.id)">Взять</button>
                            </div>
                        </template>
                        <div v-else class="empty-orders">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#6e6e73" stroke-width="1.5"/>
                                <path d="M12 8v4M12 16h.01" stroke="#6e6e73" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <span>Активных заказов нет</span>
                        </div>
                    </template>
                </div>
            </template>
        </div>
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

.taxi-app {
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
    gap: 10px;
    color: #6e6e73;
    font-size: 13px;
}

.app-badge {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(8px);
    border-radius: 20px;
    padding: 6px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #1d1d1f;
    box-shadow: 0 2px 10px rgba(0,0,0,0.12);
}

.badge-red {
    color: #ff3b30;
}

.panel-area {
    background: #fff;
    border-top: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
    max-height: 55%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.panel-area::-webkit-scrollbar {
    width: 4px;
}

.panel-area::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.12);
    border-radius: 2px;
}

.panel-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
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

.panel-title {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
}

.panel-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.panel-desc {
    font-size: 13px;
    color: #6e6e73;
    margin: 0;
    line-height: 1.5;
}

.mode-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.12s;
}

.mode-card:hover {
    background: rgba(0,0,0,0.03);
}

.mode-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.client-icon { background: #007aff; }
.driver-icon { background: #ff9500; }

.mode-info {
    flex: 1;
}

.mode-title {
    font-size: 15px;
    font-weight: 600;
    color: #1d1d1f;
}

.mode-sub {
    font-size: 12px;
    color: #6e6e73;
    margin-top: 2px;
}

.driver-active-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: rgba(0,122,255,0.06);
    border-bottom: 1px solid rgba(0,0,0,0.08);
}

.driver-info {
    display: flex;
    align-items: center;
    gap: 6px;
}

.driver-label {
    font-size: 12px;
    color: #6e6e73;
}

.driver-name {
    font-size: 14px;
    font-weight: 600;
    color: #1d1d1f;
}

.driver-number {
    font-size: 13px;
    color: #007aff;
}

.location-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: rgba(0,0,0,0.03);
    border-radius: 8px;
}

.location-dot {
    width: 10px;
    height: 10px;
    background: #007aff;
    border-radius: 50%;
    flex-shrink: 0;
}

.location-label {
    font-size: 11px;
    color: #6e6e73;
    margin-bottom: 2px;
}

.location-value {
    font-size: 13px;
    font-weight: 500;
    color: #1d1d1f;
}

.order-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #34c759;
    font-weight: 500;
}

.order-status-dot {
    width: 8px;
    height: 8px;
    background: #34c759;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

.route-built {
    font-size: 13px;
    color: #34c759;
    font-weight: 500;
    padding: 8px 0;
}

.order-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 10px;
}

.order-meta {
    flex: 1;
}

.order-area {
    font-size: 14px;
    font-weight: 600;
    color: #1d1d1f;
}

.order-dist {
    font-size: 12px;
    color: #007aff;
    margin-top: 2px;
}

.order-client {
    font-size: 12px;
    color: #6e6e73;
    margin-top: 2px;
}

.empty-orders {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    color: #6e6e73;
    font-size: 13px;
}

.primary-btn {
    padding: 11px 20px;
    background: #007aff;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
    text-align: center;
}

.primary-btn.sm {
    padding: 8px 16px;
    font-size: 13px;
    white-space: nowrap;
}

.primary-btn:hover { opacity: 0.88; }

.secondary-btn {
    padding: 11px 20px;
    background: rgba(0,0,0,0.06);
    color: #007aff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.12s;
    text-align: center;
}

.secondary-btn:hover {
    background: rgba(0,0,0,0.1);
}

.secondary-btn.danger {
    color: #ff3b30;
}
</style>
