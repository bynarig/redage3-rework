<script setup lang="ts">
import { useAuction } from '@/views/accessories/shared/composables/useAuction'

const {
    isLoad, view, list, myLots, categoryId, selectedItem,
    betAmount, createTitle, createText, createPrice,
    categoryNames, formatMoney, onSelectCategory, onSelectItem, onBet, onCreateLot,
} = useAuction()
</script>

<template>
    <div v-if="!isLoad" class="loading-state">
        <div class="spinner" />
        <span>Загрузка...</span>
    </div>

    <div v-else class="auction-app">
        <div class="auction-header">
            <div class="header-brand">
                <div class="brand-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M14 20l7-7-3-3-7 7v3h3z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M13 7l3 3" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M6 6l2 2" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <path d="M3 9a9 9 0 1 0 12 0" stroke="white" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </div>
                <span class="brand-title">Аукцион</span>
            </div>
        </div>

        <!-- Lot detail -->
        <template v-if="selectedItem !== null">
            <div class="detail-header">
                <button class="back-btn" @click="selectedItem = null">&#8249; Назад</button>
                <span class="detail-title">Лот</span>
            </div>
            <div class="lot-detail">
                <div class="lot-card">
                    <div class="lot-title">{{ selectedItem.title }}</div>
                    <div class="lot-text">{{ selectedItem.text }}</div>
                    <div class="lot-prices">
                        <div class="price-row">
                            <span class="price-label">Начальная ставка</span>
                            <span class="price-value start">${{ formatMoney(selectedItem.createPrice) }}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-label">Текущая ставка</span>
                            <span class="price-value current">${{ formatMoney(selectedItem.lastPrice) }}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-label">Участников</span>
                            <span class="price-value">{{ selectedItem.betCount }}</span>
                        </div>
                    </div>
                </div>
                <div class="bet-section">
                    <div class="bet-label">Ваша ставка</div>
                    <input
                        v-model="betAmount"
                        class="bet-input"
                        type="number"
                        placeholder="Введите сумму ($)"
                    />
                    <button class="primary-btn" @click="onBet">Сделать ставку</button>
                </div>
            </div>
        </template>

        <!-- Create lot -->
        <template v-else-if="view === 'Create'">
            <div class="detail-header">
                <button class="back-btn" @click="view = 'Main'">&#8249; Назад</button>
                <span class="detail-title">Выставить лот</span>
            </div>
            <div class="create-form">
                <div class="form-group">
                    <label class="form-label">Название</label>
                    <input v-model="createTitle" class="form-input" type="text" placeholder="Название лота..." />
                </div>
                <div class="form-group">
                    <label class="form-label">Описание</label>
                    <textarea v-model="createText" class="form-textarea" placeholder="Описание лота..." rows="5" />
                </div>
                <div class="form-group">
                    <label class="form-label">Начальная цена ($)</label>
                    <input v-model="createPrice" class="form-input" type="number" placeholder="0" />
                </div>
                <button class="primary-btn" @click="onCreateLot">Опубликовать лот</button>
            </div>
        </template>

        <!-- Lot list by category -->
        <template v-else-if="view === 'List'">
            <div class="detail-header">
                <button class="back-btn" @click="view = 'Main'">&#8249; Категории</button>
                <span class="detail-title">{{ categoryNames[categoryId] }}</span>
            </div>
            <div class="lot-list">
                <template v-if="list.length > 0">
                    <div v-for="item in list" :key="item.id" class="lot-item" @click="onSelectItem(item)">
                        <div class="lot-item-info">
                            <div class="lot-item-title">{{ item.title }}</div>
                            <div class="lot-item-bid">Текущая ставка: ${{ formatMoney(item.lastPrice) }}</div>
                            <div class="lot-item-count">{{ item.betCount }} участников</div>
                        </div>
                        <svg class="lot-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                            <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </template>
                <div v-else class="empty-state">
                    <div class="empty-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#6e6e73" stroke-width="1.5"/>
                            <path d="M12 8v4M12 16h.01" stroke="#6e6e73" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="empty-title">Лотов нет</div>
                </div>
            </div>
        </template>

        <!-- Main: categories + my lots -->
        <template v-else>
            <div class="main-content">
                <!-- My lots -->
                <template v-if="myLots.length > 0">
                    <div class="section-title">Мои лоты</div>
                    <div class="my-lots">
                        <div v-for="lot in myLots" :key="lot.id" class="my-lot-item" @click="onSelectItem(lot)">
                            <div class="my-lot-info">
                                <div class="my-lot-title">{{ lot.title }}</div>
                                <div class="my-lot-count">{{ lot.betCount }} ставок</div>
                            </div>
                            <svg class="lot-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                                <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                </template>

                <div class="section-title">Категории</div>
                <div class="category-grid">
                    <div
                        v-for="(name, index) in categoryNames"
                        :key="index"
                        class="category-card"
                        @click="onSelectCategory(index)"
                    >
                        <div class="category-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="9" cy="9" r="6" stroke="#007aff" stroke-width="1.5"/>
                                <path d="M15 15l6 6" stroke="#007aff" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <span class="category-name">{{ name }}</span>
                    </div>
                </div>

                <button class="create-lot-btn" @click="view = 'Create'">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                    Выставить лот
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

@keyframes spin { to { transform: rotate(360deg); } }

.auction-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.auction-header {
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
    background: linear-gradient(135deg, #5856d6, #af52de);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.brand-title {
    font-size: 20px;
    font-weight: 700;
    color: #1d1d1f;
}

/* Detail header */
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

/* Lot detail */
.lot-detail {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.lot-detail::-webkit-scrollbar { width: 4px; }
.lot-detail::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.lot-card {
    background: #fff;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.lot-title {
    font-size: 18px;
    font-weight: 700;
    color: #1d1d1f;
}

.lot-text {
    font-size: 14px;
    color: #6e6e73;
    line-height: 1.6;
}

.lot-prices {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 12px;
    border-top: 1px solid rgba(0,0,0,0.06);
}

.price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.price-label { font-size: 13px; color: #6e6e73; }
.price-value { font-size: 14px; font-weight: 600; color: #1d1d1f; }
.price-value.current { color: #007aff; font-size: 16px; }
.price-value.start { color: #6e6e73; }

.bet-section {
    background: #fff;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.bet-label { font-size: 14px; font-weight: 600; color: #1d1d1f; }

.bet-input {
    padding: 10px 12px;
    background: rgba(0,0,0,0.04);
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
    font-size: 14px;
    color: #1d1d1f;
    font-family: inherit;
    outline: none;
}

.bet-input:focus { border-color: #007aff; background: #fff; }

/* Create form */
.create-form {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.create-form::-webkit-scrollbar { width: 4px; }
.create-form::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-label {
    font-size: 12px;
    font-weight: 600;
    color: #6e6e73;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

.form-input {
    padding: 10px 12px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 8px;
    font-size: 14px;
    color: #1d1d1f;
    font-family: inherit;
    outline: none;
}

.form-input:focus { border-color: #007aff; }

.form-textarea {
    padding: 10px 12px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 8px;
    font-size: 14px;
    color: #1d1d1f;
    font-family: inherit;
    outline: none;
    resize: vertical;
    min-height: 100px;
}

.form-textarea:focus { border-color: #007aff; }

.primary-btn {
    padding: 12px 24px;
    background: #007aff;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
}

.primary-btn:hover { opacity: 0.88; }

/* Lot list */
.lot-list {
    flex: 1;
    overflow-y: auto;
    background: #fff;
}

.lot-list::-webkit-scrollbar { width: 4px; }
.lot-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.lot-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    transition: background 0.12s;
    min-height: 64px;
}

.lot-item:last-child { border-bottom: none; }
.lot-item:hover { background: rgba(0,0,0,0.03); }

.lot-item-info { flex: 1; }
.lot-item-title { font-size: 14px; font-weight: 600; color: #1d1d1f; }
.lot-item-bid { font-size: 13px; color: #007aff; font-weight: 500; margin-top: 2px; }
.lot-item-count { font-size: 12px; color: #6e6e73; margin-top: 1px; }

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
    background: rgba(0,0,0,0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-title { font-size: 17px; font-weight: 600; color: #1d1d1f; }

/* Main view */
.main-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.main-content::-webkit-scrollbar { width: 4px; }
.main-content::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.section-title {
    font-size: 13px;
    font-weight: 600;
    color: #6e6e73;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    padding: 4px 0;
}

.my-lots {
    background: #fff;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    overflow: hidden;
}

.my-lot-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    cursor: pointer;
    transition: background 0.12s;
}

.my-lot-item:last-child { border-bottom: none; }
.my-lot-item:hover { background: rgba(0,0,0,0.03); }

.my-lot-info { flex: 1; }
.my-lot-title { font-size: 14px; font-weight: 600; color: #1d1d1f; }
.my-lot-count { font-size: 12px; color: #6e6e73; margin-top: 2px; }

.lot-chevron { flex-shrink: 0; }

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
}

.category-card {
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

.category-card:hover { background: rgba(0,0,0,0.02); }

.category-icon {
    width: 36px;
    height: 36px;
    background: rgba(0,122,255,0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.category-name {
    font-size: 12px;
    font-weight: 500;
    color: #1d1d1f;
    text-align: center;
    line-height: 1.3;
}

.create-lot-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 12px;
    background: rgba(88,86,214,0.1);
    color: #5856d6;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.12s;
}

.create-lot-btn:hover { background: rgba(88,86,214,0.18); }
</style>
