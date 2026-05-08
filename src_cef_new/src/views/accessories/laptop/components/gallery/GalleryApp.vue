<script setup lang="ts">
import { useGallery } from '@/views/accessories/shared/composables/useGallery'

const { data, selectedImage, isDeletePopup, formatDate, formatTime, onDelete } = useGallery()
</script>

<template>
    <div class="gallery-app">
        <!-- Grid view -->
        <template v-if="selectedImage === null">
            <div class="gallery-header">
                <span class="gallery-title">Галерея</span>
                <span class="gallery-count">{{ data.length }} фото</span>
            </div>
            <div class="gallery-grid" v-if="data.length > 0">
                <div
                    v-for="item in data"
                    :key="item[0]"
                    class="thumbnail"
                    :style="{ backgroundImage: `url(${item[0]})` }"
                    @click="selectedImage = item"
                />
            </div>
            <div v-else class="empty-state">
                <div class="empty-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6e6e73" stroke-width="1.5"/>
                        <circle cx="8.5" cy="8.5" r="1.5" stroke="#6e6e73" stroke-width="1.5"/>
                        <polyline points="21,15 16,10 5,21" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="empty-title">Нет фотографий</div>
                <div class="empty-sub">Сделайте снимок в игре с помощью камеры</div>
            </div>
        </template>

        <!-- Detail view -->
        <template v-else>
            <div class="detail-header">
                <button class="back-btn" @click="selectedImage = null">&#8249; Галерея</button>
                <div class="detail-meta">
                    <span class="meta-date">{{ formatDate(selectedImage[1]) }}</span>
                    <span class="meta-time">{{ formatTime(selectedImage[1]) }}</span>
                </div>
                <button class="delete-btn" @click="isDeletePopup = true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>

            <div class="detail-body">
                <div
                    class="full-image"
                    :style="{ backgroundImage: `url(${selectedImage[0]})` }"
                />
            </div>

            <div class="filmstrip">
                <div
                    v-for="item in data"
                    :key="item[0]"
                    class="filmstrip-thumb"
                    :class="{ active: item[0] === selectedImage[0] }"
                    :style="{ backgroundImage: `url(${item[0]})` }"
                    @click="selectedImage = item"
                />
            </div>

            <!-- Delete confirmation popup -->
            <div v-if="isDeletePopup" class="delete-popup-overlay">
                <div class="delete-popup">
                    <div class="popup-title">Удалить фото?</div>
                    <div class="popup-sub">Это действие нельзя отменить</div>
                    <div class="popup-actions">
                        <button class="popup-cancel" @click="isDeletePopup = false">Отмена</button>
                        <button class="popup-delete" @click="onDelete(selectedImage![0])">Удалить</button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.gallery-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
    position: relative;
}

.gallery-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    padding: 20px 24px 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    background: #fff;
    flex-shrink: 0;
}

.gallery-title {
    font-size: 20px;
    font-weight: 700;
    color: #1d1d1f;
}

.gallery-count {
    font-size: 13px;
    color: #6e6e73;
}

.gallery-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 3px;
    overflow-y: auto;
    padding: 3px;
}

.gallery-grid::-webkit-scrollbar {
    width: 4px;
}

.gallery-grid::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.15);
    border-radius: 2px;
}

.thumbnail {
    aspect-ratio: 1;
    background-size: cover;
    background-position: center;
    background-color: #e5e5ea;
    cursor: pointer;
    border-radius: 4px;
    transition: opacity 0.15s, transform 0.15s;
}

.thumbnail:hover {
    opacity: 0.88;
    transform: scale(0.97);
}

.empty-state {
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

/* Detail view */
.detail-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
    gap: 12px;
}

.back-btn {
    background: none;
    border: none;
    color: #007aff;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
    white-space: nowrap;
}

.detail-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.meta-date {
    font-size: 13px;
    font-weight: 600;
    color: #1d1d1f;
}

.meta-time {
    font-size: 12px;
    color: #6e6e73;
}

.delete-btn {
    background: none;
    border: none;
    color: #ff3b30;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 6px;
    border-radius: 6px;
    transition: background 0.12s;
}

.delete-btn:hover {
    background: rgba(255, 59, 48, 0.1);
}

.detail-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    overflow: hidden;
    min-height: 0;
}

.full-image {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.filmstrip {
    display: flex;
    gap: 4px;
    padding: 8px 8px;
    background: #1c1c1e;
    overflow-x: auto;
    flex-shrink: 0;
}

.filmstrip::-webkit-scrollbar {
    display: none;
}

.filmstrip-thumb {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    background-size: cover;
    background-position: center;
    background-color: #2c2c2e;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.12s;
    border: 2px solid transparent;
}

.filmstrip-thumb.active {
    border-color: #007aff;
}

.filmstrip-thumb:hover {
    opacity: 0.8;
}

/* Delete popup */
.delete-popup-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.delete-popup {
    background: #fff;
    border-radius: 14px;
    padding: 24px;
    width: 280px;
    text-align: center;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
}

.popup-title {
    font-size: 17px;
    font-weight: 600;
    color: #1d1d1f;
    margin-bottom: 6px;
}

.popup-sub {
    font-size: 13px;
    color: #6e6e73;
    margin-bottom: 20px;
}

.popup-actions {
    display: flex;
    gap: 10px;
}

.popup-cancel {
    flex: 1;
    padding: 10px;
    background: rgba(0,0,0,0.06);
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #007aff;
    cursor: pointer;
    font-family: inherit;
}

.popup-delete {
    flex: 1;
    padding: 10px;
    background: #ff3b30;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    font-family: inherit;
}
</style>
