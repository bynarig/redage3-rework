<script setup lang="ts">
import PhoneMap from '../../../phone/components/gps/PhoneMap.vue'
import { useTrucker } from '@/views/accessories/shared/composables/useTrucker'

const {
    isLoad, isSelect, selectTrucker, listData,
    position, elementWidth, elementHeight, mainElement, otherElement,
    closeMenu, onTakeOrder, onCancelOrder, onShowOnMap,
} = useTrucker()
</script>

<template>
    <div v-if="!isLoad" class="loading-state">
        <div class="spinner" />
        <span>Загрузка...</span>
    </div>

    <div v-else class="trucker-app" ref="mainElement">
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
                <span class="badge-accent">Red</span>Age Trucker
            </div>
        </div>

        <div class="panel-area" ref="otherElement">
            <!-- Active order selected -->
            <template v-if="isSelect">
                <div class="panel-header">
                    <span class="panel-title">Активный маршрут</span>
                    <button class="close-btn" @click="closeMenu">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <div class="active-order-banner">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="#ff9500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="#ff9500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <line x1="6" y1="1" x2="6" y2="4" stroke="#ff9500" stroke-width="2" stroke-linecap="round"/>
                        <line x1="10" y1="1" x2="10" y2="4" stroke="#ff9500" stroke-width="2" stroke-linecap="round"/>
                        <line x1="14" y1="1" x2="14" y2="4" stroke="#ff9500" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <span>Заказ: <strong>{{ selectTrucker.name }}</strong></span>
                </div>
                <div class="panel-body">
                    <div class="location-row">
                        <div class="location-dot" />
                        <div class="location-info">
                            <div class="location-value">{{ selectTrucker.aStreet }}</div>
                            <div class="location-label">{{ selectTrucker.aArea }}</div>
                        </div>
                    </div>
                    <div class="route-built">Маршрут построен в GPS-навигаторе</div>
                    <button class="secondary-btn" @click="onShowOnMap">Показать на карте</button>
                    <button class="secondary-btn danger" @click="onCancelOrder">Отменить маршрут</button>
                </div>
            </template>

            <!-- Order list -->
            <template v-else>
                <div class="panel-header">
                    <span class="panel-title">Активные маршруты</span>
                    <button class="close-btn" @click="closeMenu">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
                <div class="panel-body">
                    <template v-if="listData.length > 0">
                        <div class="order-card" v-for="order in listData" :key="order.id">
                            <div class="order-meta">
                                <div class="order-area">{{ order.area }}</div>
                                <div class="order-dist">{{ order.dist }} м до точки</div>
                                <div class="order-name">Груз: <strong>{{ order.name }}</strong></div>
                            </div>
                            <button class="take-btn" @click="onTakeOrder(order.id)">Взять</button>
                        </div>
                    </template>
                    <div v-else class="empty-orders">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                            <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                        <span>Активных маршрутов нет</span>
                        <span class="empty-sub">Скоро что-то появится...</span>
                    </div>
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
    border-top-color: #ff9500;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.trucker-app {
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

.badge-accent { color: #ff9500; }

.panel-area {
    background: #fff;
    border-top: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
    max-height: 55%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.panel-area::-webkit-scrollbar { width: 4px; }
.panel-area::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.panel-title { font-size: 16px; font-weight: 600; color: #1d1d1f; }

.close-btn {
    width: 28px;
    height: 28px;
    background: rgba(0,0,0,0.06);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #6e6e73;
    transition: background 0.12s;
}

.close-btn:hover { background: rgba(0,0,0,0.1); }

.active-order-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: rgba(255,149,0,0.06);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    font-size: 13px;
    color: #1d1d1f;
}

.panel-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
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
    background: #ff9500;
    border-radius: 50%;
    flex-shrink: 0;
}

.location-label { font-size: 11px; color: #6e6e73; margin-top: 2px; }
.location-value { font-size: 13px; font-weight: 500; color: #1d1d1f; }
.location-info { flex: 1; }

.route-built { font-size: 13px; color: #34c759; font-weight: 500; }

.order-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 10px;
}

.order-meta { flex: 1; }
.order-area { font-size: 14px; font-weight: 600; color: #1d1d1f; }
.order-dist { font-size: 12px; color: #ff9500; margin-top: 2px; }
.order-name { font-size: 12px; color: #6e6e73; margin-top: 2px; }

.take-btn {
    padding: 8px 16px;
    background: #ff9500;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
    white-space: nowrap;
}

.take-btn:hover { opacity: 0.88; }

.empty-orders {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 24px;
    color: #6e6e73;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
}

.empty-sub { font-size: 12px; font-weight: 400; }

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

.secondary-btn:hover { background: rgba(0,0,0,0.1); }
.secondary-btn.danger { color: #ff3b30; }
</style>
