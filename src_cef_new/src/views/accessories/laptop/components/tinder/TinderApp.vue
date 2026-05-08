<script setup lang="ts">
import { useTinder } from '@/views/accessories/shared/composables/useTinder'

const {
    isLoad, isCreate, view, profile, isEditProfile, editText, editType,
    tinderList, matches, onSaveProfile, onSelectAvatar, onAction, onOpenMessages,
} = useTinder()
</script>

<template>
    <div v-if="!isLoad" class="loading-state">
        <div class="spinner" />
        <span>Загрузка...</span>
    </div>

    <div v-else class="tinder-app">
        <div class="tinder-header">
            <div class="header-nav">
                <button
                    class="nav-btn"
                    :class="{ active: view === 'List' }"
                    @click="view = 'List'"
                    v-if="isCreate"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    </svg>
                    Поиск
                </button>
                <div class="header-brand">
                    <span class="brand-t">t</span>inder
                </div>
                <div class="header-right">
                    <button
                        v-if="isCreate"
                        class="nav-btn"
                        :class="{ active: view === 'Matches' }"
                        @click="view = 'Matches'"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button
                        class="nav-btn"
                        :class="{ active: view === 'Profile' }"
                        @click="view = 'Profile'"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Profile view -->
        <template v-if="view === 'Profile'">
            <div class="profile-content">
                <!-- View existing profile -->
                <template v-if="isCreate && !isEditProfile">
                    <div class="profile-card">
                        <div class="profile-avatar" @click="onSelectAvatar">
                            <div class="avatar-circle">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="8" r="4" stroke="rgba(255,75,85,0.6)" stroke-width="2"/>
                                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,75,85,0.6)" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="avatar-edit-hint">Нажмите для смены аватара</div>
                        </div>
                        <div class="profile-name">Мой профиль</div>
                        <div class="profile-bio">{{ profile.text || 'Описание не добавлено' }}</div>
                        <button class="edit-profile-btn" @click="isEditProfile = true">Редактировать</button>
                    </div>
                </template>

                <!-- Edit profile form -->
                <template v-else>
                    <div class="edit-form">
                        <div class="edit-section-title">Редактирование профиля</div>

                        <div class="avatar-upload" @click="onSelectAvatar">
                            <div class="upload-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#007aff" stroke-width="1.5"/>
                                    <circle cx="8.5" cy="8.5" r="1.5" fill="#007aff"/>
                                    <polyline points="21,15 16,10 5,21" stroke="#007aff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </div>
                            <span>Выбрать фото</span>
                        </div>

                        <div class="form-group">
                            <label class="form-label">О себе</label>
                            <textarea
                                v-model="editText"
                                class="form-textarea"
                                placeholder="Расскажите о себе..."
                                maxlength="150"
                                rows="4"
                            />
                            <div class="char-count">{{ editText?.length ?? 0 }}/150</div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Я ищу</label>
                            <div class="seek-options">
                                <div class="seek-option" :class="{ selected: editType === 0 }" @click="editType = 0">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path v-if="editType === 0" d="M2 7l4 4 6-6" stroke="#007aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Парня
                                </div>
                                <div class="seek-option" :class="{ selected: editType === 1 }" @click="editType = 1">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path v-if="editType === 1" d="M2 7l4 4 6-6" stroke="#007aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Девушку
                                </div>
                                <div class="seek-option" :class="{ selected: editType === 2 }" @click="editType = 2">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path v-if="editType === 2" d="M2 7l4 4 6-6" stroke="#007aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                    Друзей
                                </div>
                            </div>
                        </div>

                        <button class="save-btn" @click="onSaveProfile">Сохранить</button>
                    </div>
                </template>
            </div>
        </template>

        <!-- Swipe view -->
        <template v-else-if="view === 'List'">
            <div class="swipe-content">
                <template v-if="tinderList.length > 0 && tinderList[0]">
                    <div class="candidate-card">
                        <div class="candidate-avatar">
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" stroke="rgba(255,75,85,0.5)" stroke-width="1.5"/>
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,75,85,0.5)" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </div>
                        <div class="candidate-name">{{ tinderList[0]!.name }}</div>
                        <div class="candidate-bio">{{ tinderList[0]!.text || 'Нет описания' }}</div>
                    </div>
                    <div class="swipe-actions">
                        <button class="action-nope" @click="onAction(false)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <button class="action-like" @click="onAction(true)">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </template>
                <div v-else class="empty-state">
                    <div class="empty-heart">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#ff4b55" stroke-width="1.5"/>
                        </svg>
                    </div>
                    <div class="empty-title">Никого нет</div>
                    <div class="empty-sub">Кажется, тут никого нет.. Но скоро кто-то появится!</div>
                </div>
            </div>
        </template>

        <!-- Matches view -->
        <template v-else-if="view === 'Matches'">
            <div class="matches-header">
                <span class="matches-title">Совпадения</span>
            </div>
            <div class="matches-list">
                <template v-if="matches.length > 0">
                    <div
                        v-for="user in matches"
                        :key="user.uuid"
                        class="match-item"
                        @click="onOpenMessages(user.uuid)"
                    >
                        <div class="match-avatar">
                            {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                        <div class="match-info">
                            <div class="match-name">{{ user.name }}</div>
                            <div class="match-sub">Нажмите чтобы написать</div>
                        </div>
                        <svg class="match-chevron" width="7" height="12" viewBox="0 0 7 12" fill="none">
                            <path d="M1 1l5 5-5 5" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </template>
                <div v-else class="empty-state">
                    <div class="empty-heart">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#ff4b55" stroke-width="1.5"/>
                        </svg>
                    </div>
                    <div class="empty-title">Совпадений нет</div>
                    <div class="empty-sub">Продолжайте свайпать!</div>
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
    border-top-color: #ff4b55;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.tinder-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.tinder-header {
    padding: 10px 16px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.header-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.header-brand {
    font-size: 24px;
    font-weight: 300;
    color: #ff4b55;
    letter-spacing: -0.5px;
}

.brand-t {
    font-weight: 700;
}

.nav-btn {
    background: none;
    border: none;
    padding: 6px 8px;
    color: #c7c7cc;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: color 0.12s, background 0.12s;
}

.nav-btn:hover { color: #ff4b55; background: rgba(255,75,85,0.06); }
.nav-btn.active { color: #ff4b55; }

.header-right {
    display: flex;
    align-items: center;
    gap: 4px;
}

/* Profile view */
.profile-content {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.profile-content::-webkit-scrollbar { width: 4px; }
.profile-content::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.profile-card {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    background: #fff;
    border-radius: 16px;
    padding: 28px;
    border: 1px solid rgba(0,0,0,0.08);
}

.avatar-circle {
    width: 96px;
    height: 96px;
    background: rgba(255,75,85,0.08);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar-edit-hint {
    font-size: 11px;
    color: #6e6e73;
    text-align: center;
    margin-top: 4px;
}

.profile-name {
    font-size: 20px;
    font-weight: 700;
    color: #1d1d1f;
}

.profile-bio {
    font-size: 14px;
    color: #6e6e73;
    text-align: center;
    line-height: 1.5;
}

.edit-profile-btn {
    padding: 10px 24px;
    background: rgba(255,75,85,0.1);
    color: #ff4b55;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    margin-top: 4px;
}

/* Edit form */
.edit-form {
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.edit-section-title {
    font-size: 17px;
    font-weight: 700;
    color: #1d1d1f;
    margin-bottom: 4px;
}

.avatar-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px;
    background: rgba(0,122,255,0.04);
    border: 2px dashed rgba(0,122,255,0.3);
    border-radius: 12px;
    cursor: pointer;
    color: #007aff;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.12s;
}

.avatar-upload:hover { background: rgba(0,122,255,0.08); }

.upload-icon {
    width: 40px;
    height: 40px;
    background: rgba(0,122,255,0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-group { display: flex; flex-direction: column; gap: 6px; }

.form-label {
    font-size: 12px;
    font-weight: 600;
    color: #6e6e73;
    text-transform: uppercase;
    letter-spacing: 0.4px;
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
    resize: none;
}

.form-textarea:focus { border-color: #ff4b55; }

.char-count {
    font-size: 11px;
    color: #6e6e73;
    text-align: right;
}

.seek-options {
    display: flex;
    gap: 8px;
}

.seek-option {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px;
    background: rgba(0,0,0,0.04);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #1d1d1f;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.12s;
}

.seek-option.selected {
    background: rgba(0,122,255,0.08);
    border-color: #007aff;
    color: #007aff;
}

.save-btn {
    padding: 12px 24px;
    background: #ff4b55;
    color: #fff;
    border: none;
    border-radius: 20px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
}

.save-btn:hover { opacity: 0.88; }

/* Swipe view */
.swipe-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 24px;
    overflow: hidden;
}

.candidate-card {
    width: 100%;
    max-width: 360px;
    background: #fff;
    border-radius: 20px;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    border: 1px solid rgba(0,0,0,0.06);
}

.candidate-avatar {
    width: 96px;
    height: 96px;
    background: rgba(255,75,85,0.08);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.candidate-name {
    font-size: 22px;
    font-weight: 700;
    color: #1d1d1f;
}

.candidate-bio {
    font-size: 14px;
    color: #6e6e73;
    text-align: center;
    line-height: 1.5;
}

.swipe-actions {
    display: flex;
    gap: 24px;
    align-items: center;
}

.action-nope {
    width: 56px;
    height: 56px;
    background: #fff;
    color: #ff3b30;
    border: 2px solid rgba(255,59,48,0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 2px 8px rgba(255,59,48,0.15);
}

.action-nope:hover {
    background: rgba(255,59,48,0.08);
    border-color: #ff3b30;
}

.action-like {
    width: 68px;
    height: 68px;
    background: linear-gradient(135deg, #ff4b55, #ff6b7a);
    color: #fff;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 4px 16px rgba(255,75,85,0.4);
}

.action-like:hover {
    transform: scale(1.06);
    box-shadow: 0 6px 20px rgba(255,75,85,0.5);
}

/* Matches view */
.matches-header {
    padding: 16px 20px 12px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.matches-title {
    font-size: 20px;
    font-weight: 700;
    color: #1d1d1f;
}

.matches-list {
    flex: 1;
    overflow-y: auto;
    background: #fff;
}

.matches-list::-webkit-scrollbar { width: 4px; }
.matches-list::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 2px; }

.match-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    transition: background 0.12s;
    min-height: 64px;
}

.match-item:last-child { border-bottom: none; }
.match-item:hover { background: rgba(255,75,85,0.03); }

.match-avatar {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #ff4b55, #ff6b7a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
}

.match-info { flex: 1; }
.match-name { font-size: 15px; font-weight: 600; color: #1d1d1f; }
.match-sub { font-size: 12px; color: #6e6e73; margin-top: 2px; }

/* Empty state */
.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px;
    text-align: center;
}

.empty-heart {
    width: 72px;
    height: 72px;
    background: rgba(255,75,85,0.08);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-title { font-size: 17px; font-weight: 600; color: #1d1d1f; }
.empty-sub { font-size: 13px; color: #6e6e73; }
</style>
