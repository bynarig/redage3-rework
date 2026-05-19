<script setup lang="ts">
import { useProperty } from '@/views/accessories/shared/composables/useProperty'

const { isLoad, isSubLoad, view, propertyList, onSelectItem, setPoint, backToList, houseAction, businessAction } = useProperty()
</script>

<template>
    <div v-if="!isLoad" class="loading-state">
        <div class="spinner" />
        <span>Загрузка...</span>
    </div>

    <div v-else class="property-app">
        <div class="property-header">
            <div class="header-brand">
                <div class="brand-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <polyline points="9,22 9,12 15,12 15,22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div>
                    <div class="brand-title"><span class="brand-accent">Управление </span>имуществом</div>
                    <div class="brand-sub">Недвижимость и бизнес</div>
                </div>
            </div>
        </div>

        <!-- Property list -->
        <template v-if="view === 'List'">
            <div class="property-list">
                <template v-if="propertyList.length > 0">
                    <div
                        v-for="item in propertyList"
                        :key="item.id"
                        class="property-item"
                        @click="onSelectItem(item)"
                    >
                        <div class="property-icon" :class="item.type === 0 ? 'house-icon' : 'biz-icon'">
                            <svg v-if="item.type === 0" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <polyline points="9,22 9,12 15,12 15,22" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="7" width="20" height="14" rx="2" stroke="white" stroke-width="2"/>
                                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="white" stroke-width="2"/>
                            </svg>
                        </div>
                        <div class="property-info">
                            <div class="property-row">
                                <span class="property-type">{{ item.type === 0 ? 'Дом' : 'Бизнес' }}</span>
                                <span v-if="item.isOwner !== undefined" class="property-ownership">
                                    {{ item.isOwner ? 'Личный' : 'Подселенный' }}
                                </span>
                            </div>
                            <div v-if="item.name" class="property-name">{{ item.name }}</div>
                            <div v-if="item.address" class="property-address">{{ item.address }}</div>
                        </div>
                        <svg class="property-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                            <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </template>
                <div v-else class="empty-state">
                    <div class="empty-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="empty-title">Имущества нет</div>
                    <button class="primary-btn" @click="setPoint">Найти риэлтора</button>
                </div>
            </div>
        </template>

        <!-- House management -->
        <template v-else-if="view === 'House'">
            <div class="detail-header">
                <button class="back-btn" @click="backToList">&#8249; Список</button>
                <span class="detail-title">Управление домом</span>
            </div>
            <div v-if="!isSubLoad" class="loading-inline">
                <div class="spinner" />
            </div>
            <div v-else class="action-grid">
                <div class="action-card" @click="houseAction('upgrade')">
                    <div class="action-icon upgrade-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <span class="action-label">Улучшить дом</span>
                </div>
                <div class="action-card" @click="houseAction('residents')">
                    <div class="action-icon residents-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="9" cy="7" r="4" stroke="white" stroke-width="2"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <span class="action-label">Жильцы</span>
                </div>
                <div class="action-card" @click="houseAction('furniture')">
                    <div class="action-icon furniture-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="7" width="20" height="13" rx="2" stroke="white" stroke-width="2"/>
                            <path d="M2 13h20M8 20v-4M16 20v-4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <path d="M6 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="white" stroke-width="2"/>
                        </svg>
                    </div>
                    <span class="action-label">Мебель</span>
                </div>
                <div class="action-card danger-card" @click="houseAction('sell')">
                    <div class="action-icon sell-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="white" stroke-width="2"/>
                            <path d="M12 8v8M9 11l3-3 3 3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <span class="action-label">Продать дом</span>
                </div>
            </div>
        </template>

        <!-- Business management -->
        <template v-else-if="view === 'Business'">
            <div class="detail-header">
                <button class="back-btn" @click="backToList">&#8249; Список</button>
                <span class="detail-title">Управление бизнесом</span>
            </div>
            <div v-if="!isSubLoad" class="loading-inline">
                <div class="spinner" />
            </div>
            <div v-else class="action-grid">
                <div class="action-card" @click="businessAction('orders')">
                    <div class="action-icon orders-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M9 11l3 3L22 4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <span class="action-label">Заказы</span>
                </div>
                <div class="action-card" @click="businessAction('stock')">
                    <div class="action-icon stock-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="white" stroke-width="2"/>
                            <polyline points="3.27,6.96 12,12.01 20.73,6.96" stroke="white" stroke-width="2"/>
                            <line x1="12" y1="22.08" x2="12" y2="12" stroke="white" stroke-width="2"/>
                        </svg>
                    </div>
                    <span class="action-label">Склад</span>
                </div>
                <div class="action-card" @click="businessAction('stats')">
                    <div class="action-icon stats-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <line x1="18" y1="20" x2="18" y2="10" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <line x1="12" y1="20" x2="12" y2="4" stroke="white" stroke-width="2" stroke-linecap="round"/>
                            <line x1="6" y1="20" x2="6" y2="14" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <span class="action-label">Статистика</span>
                </div>
                <div class="action-card" @click="businessAction('topclients')">
                    <div class="action-icon clients-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <span class="action-label">Топ клиентов</span>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.loading-state, .loading-inline {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 12px;
    color: #6e6e73;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
}

.loading-inline {
    padding: 40px;
}

.spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(0,0,0,0.1);
    border-top-color: #007aff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.property-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.property-header {
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
    background: linear-gradient(135deg, #34c759, #30d158);
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

.brand-accent { color: #34c759; }
.brand-sub { font-size: 12px; color: #6e6e73; margin-top: 1px; }

/* Property list */
.property-list {
    flex: 1;
    overflow-y: auto;
    background: #fff;
}

.property-list::-webkit-scrollbar { width: 4px; }
.property-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.property-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    transition: background 0.12s;
    min-height: 64px;
}

.property-item:last-child { border-bottom: none; }
.property-item:hover { background: rgba(0,0,0,0.03); }

.property-icon {
    width: 42px;
    height: 42px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.house-icon { background: #34c759; }
.biz-icon { background: #ff9500; }

.property-info { flex: 1; }

.property-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 3px;
}

.property-type {
    font-size: 13px;
    font-weight: 700;
    color: #1d1d1f;
}

.property-ownership {
    font-size: 11px;
    background: rgba(0,0,0,0.06);
    color: #6e6e73;
    padding: 2px 7px;
    border-radius: 10px;
}

.property-name {
    font-size: 14px;
    font-weight: 500;
    color: #1d1d1f;
}

.property-address {
    font-size: 12px;
    color: #6e6e73;
    margin-top: 1px;
}

.property-chevron { flex-shrink: 0; }

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 60px 20px;
    text-align: center;
}

.empty-icon {
    width: 72px;
    height: 72px;
    background: rgba(0,0,0,0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-title {
    font-size: 17px;
    font-weight: 600;
    color: #1d1d1f;
}

.primary-btn {
    padding: 10px 20px;
    background: #007aff;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
}

.primary-btn:hover { opacity: 0.88; }

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

.action-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 20px;
    overflow-y: auto;
    align-content: start;
}

.action-grid::-webkit-scrollbar { width: 4px; }
.action-grid::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 24px 16px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    cursor: pointer;
    transition: all 0.12s;
}

.action-card:hover {
    background: rgba(0,0,0,0.02);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.action-card.danger-card:hover {
    background: rgba(255,59,48,0.04);
}

.action-icon {
    width: 52px;
    height: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upgrade-icon { background: linear-gradient(135deg, #ff9500, #ff6b00); }
.residents-icon { background: linear-gradient(135deg, #007aff, #5856d6); }
.furniture-icon { background: linear-gradient(135deg, #34c759, #30d158); }
.sell-icon { background: linear-gradient(135deg, #ff3b30, #ff6161); }
.orders-icon { background: linear-gradient(135deg, #007aff, #5856d6); }
.stock-icon { background: linear-gradient(135deg, #ff9500, #ff6b00); }
.stats-icon { background: linear-gradient(135deg, #34c759, #30d158); }
.clients-icon { background: linear-gradient(135deg, #5856d6, #af52de); }

.action-label {
    font-size: 14px;
    font-weight: 600;
    color: #1d1d1f;
    text-align: center;
}

.danger-card .action-label { color: #ff3b30; }
</style>
