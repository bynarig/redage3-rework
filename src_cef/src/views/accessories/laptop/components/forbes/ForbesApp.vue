<script setup lang="ts">
import { useForbes } from '@/views/accessories/shared/composables/useForbes'

const { isLoad, richList, selectedIndex, selectedItem, formatMoney, onSelectIndex } = useForbes()
</script>

<template>
    <div v-if="!isLoad" class="loading-state">
        <div class="spinner" />
        <span>Загрузка...</span>
    </div>

    <div v-else class="forbes-app">
        <div class="forbes-header">
            <div class="header-brand">
                <div class="brand-icon">F</div>
                <div>
                    <div class="brand-title">Forbes</div>
                    <div class="brand-sub">Los Santos Rich List</div>
                </div>
            </div>
        </div>

        <!-- Rich list -->
        <template v-if="selectedIndex === null || selectedItem === null">
            <div class="rich-list">
                <div
                    v-for="(item, index) in richList"
                    :key="index"
                    class="rich-item"
                    @click="onSelectIndex(index)"
                >
                    <div class="rank" :class="{ gold: index === 0, silver: index === 1, bronze: index === 2 }">
                        {{ index + 1 }}
                    </div>
                    <div class="person-info">
                        <div class="person-name">{{ item.Name }}</div>
                        <div class="person-wealth">Состояние</div>
                        <div class="person-money">${{ formatMoney(item.Money) }}</div>
                    </div>
                    <svg class="item-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                        <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div v-if="richList.length === 0" class="empty-state">
                    <div class="empty-icon">F</div>
                    <div class="empty-title">Список пуст</div>
                </div>
            </div>
        </template>

        <!-- Person detail -->
        <template v-else>
            <div class="detail-header">
                <button class="back-btn" @click="onSelectIndex(null)">&#8249; Список</button>
                <span class="detail-title">Профиль</span>
            </div>
            <div class="person-detail">
                <div class="person-card">
                    <div class="person-avatar">
                        {{ selectedItem.Name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="person-card-name">{{ selectedItem.Name }}</div>
                    <div class="person-card-money">${{ formatMoney(selectedItem.Money) }}</div>
                    <div class="person-stats">
                        <div class="stat-item">
                            <div class="stat-label">Место</div>
                            <div class="stat-value">#{{ (selectedIndex ?? 0) + 1 }}</div>
                        </div>
                        <div class="stat-divider" />
                        <div class="stat-item">
                            <div class="stat-label">Уровень</div>
                            <div class="stat-value">{{ selectedItem.Lvl }}</div>
                        </div>
                    </div>
                </div>

                <template v-if="selectedItem.IsShowForbes">
                    <template v-if="(selectedItem.houses?.length ?? 0) > 0 || (selectedItem.biz?.length ?? 0) > 0">
                        <div class="asset-section">
                            <div class="asset-section-title">Недвижимость</div>
                            <div class="asset-list">
                                <div v-for="h in selectedItem.houses" :key="h.Name" class="asset-item">
                                    <div class="asset-icon house-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <span class="asset-name">{{ h.Name }}</span>
                                    <span class="asset-price">${{ formatMoney(h.Money) }}</span>
                                </div>
                                <div v-for="b in selectedItem.biz" :key="b.Name" class="asset-item">
                                    <div class="asset-icon biz-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <rect x="2" y="7" width="20" height="14" rx="2" stroke="white" stroke-width="2"/>
                                        </svg>
                                    </div>
                                    <span class="asset-name">{{ b.Name }}</span>
                                    <span class="asset-price">${{ formatMoney(b.Money) }}</span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-if="(selectedItem.vehicles?.length ?? 0) > 0">
                        <div class="asset-section">
                            <div class="asset-section-title">Транспорт</div>
                            <div class="asset-list">
                                <div v-for="v in selectedItem.vehicles" :key="v.Name" class="asset-item">
                                    <div class="asset-icon car-icon">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <rect x="2" y="10" width="20" height="8" rx="2" stroke="white" stroke-width="2"/>
                                        </svg>
                                    </div>
                                    <span class="asset-name">{{ v.Name }}</span>
                                    <span class="asset-price">${{ formatMoney(v.Money) }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </template>

                <div v-else class="private-notice">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="11" width="18" height="11" rx="2" stroke="#6e6e73" stroke-width="1.5"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <div class="private-text">Пользователь скрыл информацию об имуществе</div>
                </div>
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
    border-top-color: #c8a84b;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.forbes-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.forbes-header {
    padding: 16px 20px;
    background: #1d1d1f;
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
    background: #c8a84b;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    font-weight: 900;
    color: #fff;
    font-style: italic;
}

.brand-title {
    font-size: 20px;
    font-weight: 700;
    color: #c8a84b;
    font-style: italic;
}

.brand-sub {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
    margin-top: 1px;
}

/* Rich list */
.rich-list {
    flex: 1;
    overflow-y: auto;
    background: #fff;
}

.rich-list::-webkit-scrollbar { width: 4px; }
.rich-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.rich-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    transition: background 0.12s;
    min-height: 64px;
}

.rich-item:last-child { border-bottom: none; }
.rich-item:hover { background: rgba(200, 168, 75, 0.04); }

.rank {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(0,0,0,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    color: #6e6e73;
    flex-shrink: 0;
}

.rank.gold { background: #c8a84b; color: #fff; }
.rank.silver { background: #9e9e9e; color: #fff; }
.rank.bronze { background: #cd7f32; color: #fff; }

.person-info { flex: 1; }

.person-name {
    font-size: 15px;
    font-weight: 600;
    color: #1d1d1f;
}

.person-wealth {
    font-size: 11px;
    color: #6e6e73;
    margin-top: 1px;
}

.person-money {
    font-size: 13px;
    font-weight: 700;
    color: #c8a84b;
    margin-top: 1px;
}

.item-chevron { flex-shrink: 0; }

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 60px;
}

.empty-icon {
    width: 72px;
    height: 72px;
    background: rgba(200,168,75,0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: 900;
    color: #c8a84b;
    font-style: italic;
}

.empty-title { font-size: 17px; font-weight: 600; color: #1d1d1f; }

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

.detail-title { font-size: 16px; font-weight: 600; color: #1d1d1f; }

.person-detail {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.person-detail::-webkit-scrollbar { width: 4px; }
.person-detail::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.person-card {
    background: linear-gradient(135deg, #1d1d1f, #2c2c2e);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.person-avatar {
    width: 64px;
    height: 64px;
    background: #c8a84b;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
}

.person-card-name {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
}

.person-card-money {
    font-size: 22px;
    font-weight: 700;
    color: #c8a84b;
}

.person-stats {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 8px;
}

.stat-item {
    text-align: center;
}

.stat-label { font-size: 11px; color: rgba(255,255,255,0.5); }
.stat-value { font-size: 16px; font-weight: 700; color: #fff; margin-top: 2px; }

.stat-divider {
    width: 1px;
    height: 32px;
    background: rgba(255,255,255,0.15);
}

.asset-section {
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.08);
}

.asset-section-title {
    padding: 12px 16px 8px;
    font-size: 12px;
    font-weight: 600;
    color: #6e6e73;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
}

.asset-list {}

.asset-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.asset-item:last-child { border-bottom: none; }

.asset-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.house-icon { background: #34c759; }
.biz-icon { background: #ff9500; }
.car-icon { background: #007aff; }

.asset-name { flex: 1; font-size: 13px; color: #1d1d1f; }
.asset-price { font-size: 13px; font-weight: 600; color: #c8a84b; }

.private-notice {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 24px;
    background: rgba(0,0,0,0.03);
    border-radius: 12px;
    text-align: center;
}

.private-text { font-size: 13px; color: #6e6e73; line-height: 1.5; }
</style>
