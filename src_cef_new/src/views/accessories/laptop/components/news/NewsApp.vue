<script setup lang="ts">
import { useNews } from '@/views/accessories/shared/composables/useNews'

const { isLoad, newsList, selectedNews, isAddView, addTitle, addText, addType, categories, onAddNews } = useNews()
</script>

<template>
    <div v-if="!isLoad" class="loading-state">
        <div class="spinner" />
        <span>Загрузка...</span>
    </div>

    <div v-else class="news-app">
        <!-- Sidebar: article list -->
        <div class="sidebar">
            <div class="sidebar-header">
                <div class="brand">
                    <span class="brand-name">Weazel</span>
                    <span class="brand-news"> News</span>
                </div>
                <button class="add-btn" @click="isAddView = true; selectedNews = null">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>
            <div class="article-list">
                <template v-if="newsList.length > 0">
                    <div
                        v-for="item in newsList"
                        :key="item.id"
                        class="article-item"
                        :class="{ active: selectedNews?.id === item.id }"
                        @click="selectedNews = item; isAddView = false"
                    >
                        <div class="article-category-dot" />
                        <div class="article-info">
                            <div class="article-title">{{ item.title }}</div>
                            <div class="article-cat">{{ categories[item.type ?? 0] }}</div>
                        </div>
                        <svg class="article-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                            <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </template>
                <div v-else class="sidebar-empty">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6h16M4 10h16M4 14h10" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    <span>Объявлений нет</span>
                </div>
            </div>
        </div>

        <!-- Right content area -->
        <div class="content-area">
            <!-- Add news form -->
            <template v-if="isAddView">
                <div class="content-header">
                    <button class="back-btn" @click="isAddView = false">&#8249; Назад</button>
                    <span class="content-title">Подать объявление</span>
                </div>
                <div class="add-form">
                    <div class="form-group">
                        <label class="form-label">Категория</label>
                        <select v-model="addType" class="form-select">
                            <option v-for="(cat, i) in categories" :key="i" :value="i">{{ cat }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Заголовок</label>
                        <input v-model="addTitle" class="form-input" type="text" placeholder="Введите заголовок..." />
                    </div>
                    <div class="form-group">
                        <label class="form-label">Текст объявления</label>
                        <textarea v-model="addText" class="form-textarea" placeholder="Текст объявления..." rows="6" />
                    </div>
                    <button class="primary-btn" @click="onAddNews">Опубликовать</button>
                </div>
            </template>

            <!-- Article detail -->
            <template v-else-if="selectedNews !== null">
                <div class="content-header">
                    <button class="back-btn" @click="selectedNews = null">&#8249; Назад</button>
                    <span class="content-title">{{ categories[selectedNews.type ?? 0] }}</span>
                </div>
                <div class="article-detail">
                    <div class="article-detail-cat">{{ categories[selectedNews.type ?? 0] }}</div>
                    <h1 class="article-detail-title">{{ selectedNews.title }}</h1>
                    <div v-if="selectedNews.author" class="article-detail-author">Автор: {{ selectedNews.author }}</div>
                    <div class="article-divider" />
                    <div class="article-detail-text">{{ selectedNews.text }}</div>
                </div>
            </template>

            <!-- Empty state -->
            <div v-else class="content-empty">
                <div class="empty-icon">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                        <path d="M4 6h16M4 10h16M4 14h10" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="empty-title">Выберите объявление</div>
                <div class="empty-sub">Или создайте новое нажав +</div>
            </div>
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

@keyframes spin { to { transform: rotate(360deg); } }

.news-app {
    display: flex;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.sidebar {
    width: 280px;
    flex-shrink: 0;
    background: #fff;
    border-right: 1px solid rgba(0,0,0,0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 16px 12px;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.brand {
    font-size: 18px;
    font-weight: 700;
}

.brand-name { color: #1d1d1f; }
.brand-news { color: #ff3b30; }

.add-btn {
    width: 28px;
    height: 28px;
    background: #007aff;
    color: #fff;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.15s;
}

.add-btn:hover { opacity: 0.85; }

.article-list {
    flex: 1;
    overflow-y: auto;
}

.article-list::-webkit-scrollbar { width: 4px; }
.article-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.article-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    cursor: pointer;
    transition: background 0.12s;
    min-height: 52px;
}

.article-item:last-child { border-bottom: none; }
.article-item:hover { background: rgba(0,0,0,0.03); }
.article-item.active { background: rgba(0,122,255,0.06); }

.article-category-dot {
    width: 8px;
    height: 8px;
    background: #ff3b30;
    border-radius: 50%;
    flex-shrink: 0;
}

.article-info { flex: 1; overflow: hidden; }

.article-title {
    font-size: 13px;
    font-weight: 600;
    color: #1d1d1f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.article-cat {
    font-size: 11px;
    color: #6e6e73;
    margin-top: 2px;
}

.sidebar-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 40px 20px;
    color: #6e6e73;
    font-size: 13px;
    text-align: center;
}

/* Content area */
.content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f5f5f7;
}

.content-header {
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

.content-title {
    font-size: 15px;
    font-weight: 600;
    color: #1d1d1f;
}

/* Add form */
.add-form {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.add-form::-webkit-scrollbar { width: 4px; }
.add-form::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-label {
    font-size: 12px;
    font-weight: 600;
    color: #6e6e73;
    text-transform: uppercase;
    letter-spacing: 0.4px;
}

.form-select, .form-input {
    padding: 10px 12px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.12);
    border-radius: 8px;
    font-size: 14px;
    color: #1d1d1f;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
}

.form-select:focus, .form-input:focus {
    border-color: #007aff;
}

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
    min-height: 120px;
    transition: border-color 0.15s;
}

.form-textarea:focus {
    border-color: #007aff;
}

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

/* Article detail */
.article-detail {
    flex: 1;
    overflow-y: auto;
    padding: 24px 28px;
}

.article-detail::-webkit-scrollbar { width: 4px; }
.article-detail::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.article-detail-cat {
    font-size: 12px;
    font-weight: 600;
    color: #ff3b30;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
}

.article-detail-title {
    font-size: 22px;
    font-weight: 700;
    color: #1d1d1f;
    line-height: 1.3;
    margin: 0 0 8px;
}

.article-detail-author {
    font-size: 13px;
    color: #6e6e73;
    margin-bottom: 16px;
}

.article-divider {
    height: 1px;
    background: rgba(0,0,0,0.08);
    margin-bottom: 16px;
}

.article-detail-text {
    font-size: 15px;
    color: #1d1d1f;
    line-height: 1.7;
    white-space: pre-wrap;
}

/* Empty state */
.content-empty {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
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

.empty-sub {
    font-size: 13px;
    color: #6e6e73;
}
</style>
