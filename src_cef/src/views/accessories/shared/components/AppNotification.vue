<script setup lang="ts">
import { computed } from 'vue'

export interface NotificationAction {
    label: string
    icon?: string
    destructive?: boolean
}

export interface NotificationItem {
    title: string
    description?: string
    time?: string
    icon?: string
    appName?: string
}

const props = withDefaults(defineProps<{
    title: string
    description?: string
    time?: string
    icon?: string
    appName?: string
    /** 'list'    — single compact row (default)
     *  'stacked' — card-stack group; pass stackItems for peeks
     *  'expanded'— full expanded view with rich content slot and actions */
    variant?: 'list' | 'stacked' | 'expanded'
    /** Extra notifications shown peeking behind in 'stacked' variant */
    stackItems?: NotificationItem[]
    /** Action buttons shown below the expanded card */
    actions?: NotificationAction[]
    dismissible?: boolean
}>(), {
    variant: 'list',
    stackItems: () => [],
    actions: () => [],
    dismissible: true,
})

const emit = defineEmits<{
    dismiss: []
    expand: []
    action: [action: NotificationAction]
}>()

const peekCount = computed(() => Math.min(props.stackItems.length, 2))
</script>

<template>
    <!-- ── LIST (single compact row) ── -->
    <div v-if="variant === 'list'" class="notif notif--list" @click="emit('expand')">
        <div class="notif__icon-wrap" v-if="icon">
            <img :src="icon" class="notif__icon" :alt="appName ?? title" />
        </div>
        <div class="notif__icon-placeholder" v-else>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5"/>
                <circle cx="12" cy="11" r="3" stroke="currentColor" stroke-width="1.5"/>
                <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        </div>

        <div class="notif__body">
            <div class="notif__row-top">
                <span class="notif__app-name" v-if="appName">{{ appName }}</span>
                <span class="notif__title" :class="{ 'notif__title--solo': !appName }">{{ title }}</span>
                <span class="notif__time">{{ time }}</span>
            </div>
            <div class="notif__description" v-if="description">{{ description }}</div>
        </div>

        <button v-if="dismissible" class="notif__dismiss" @click.stop="emit('dismiss')" aria-label="Dismiss">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        </button>
    </div>

    <!-- ── STACKED (card-deck group) ── -->
    <div v-else-if="variant === 'stacked'" class="notif-stack" @click="emit('expand')">
        <!-- Peek cards behind (rendered in reverse so they stack correctly) -->
        <div
            v-for="n in peekCount"
            :key="n"
            class="notif-stack__peek"
            :style="{ '--depth': peekCount - n + 1 }"
        />

        <!-- Front card (main notification) -->
        <div class="notif notif--list notif-stack__front">
            <div class="notif__icon-wrap" v-if="icon">
                <img :src="icon" class="notif__icon" :alt="appName ?? title" />
            </div>
            <div class="notif__icon-placeholder" v-else>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </div>

            <div class="notif__body">
                <div class="notif__row-top">
                    <span class="notif__app-name" v-if="appName">{{ appName }}</span>
                    <span class="notif__title" :class="{ 'notif__title--solo': !appName }">{{ title }}</span>
                    <span class="notif__time">{{ time }}</span>
                </div>
                <div class="notif__description" v-if="description">{{ description }}</div>
            </div>

            <div class="notif-stack__count" v-if="stackItems.length > 0">
                {{ stackItems.length + 1 }}
            </div>
        </div>
    </div>

    <!-- ── EXPANDED ── -->
    <div v-else-if="variant === 'expanded'" class="notif-expanded">
        <!-- Header row (same as list, but slightly larger) -->
        <div class="notif notif--expanded-header">
            <div class="notif__icon-wrap" v-if="icon">
                <img :src="icon" class="notif__icon" :alt="appName ?? title" />
            </div>
            <div class="notif__icon-placeholder" v-else>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="1.5"/>
                </svg>
            </div>

            <div class="notif__body">
                <div class="notif__row-top">
                    <span class="notif__app-name" v-if="appName">{{ appName }}</span>
                    <span class="notif__title" :class="{ 'notif__title--solo': !appName }">{{ title }}</span>
                    <span class="notif__time">{{ time }}</span>
                </div>
                <div class="notif__description" v-if="description">{{ description }}</div>
            </div>

            <button v-if="dismissible" class="notif__dismiss" @click.stop="emit('dismiss')" aria-label="Dismiss">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>

        <!-- Rich content slot -->
        <div class="notif-expanded__content" v-if="$slots.default">
            <slot />
        </div>

        <!-- Action buttons -->
        <div class="notif-expanded__actions" v-if="actions.length > 0">
            <button
                v-for="(action, i) in actions"
                :key="i"
                class="notif-action"
                :class="{ 'notif-action--destructive': action.destructive }"
                @click="emit('action', action)"
            >
                <span v-if="action.icon" class="notif-action__icon" v-html="action.icon" />
                <span class="notif-action__label">{{ action.label }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
/* ────────────────────────── Design tokens ────────────────────────── */
:root {
    --notif-bg: rgba(255, 255, 255, 0.78);
    --notif-border: rgba(255, 255, 255, 0.9);
    --notif-shadow: 0 4px 24px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.55) inset;
    --notif-title: #1d1d1f;
    --notif-sub: #6e6e73;
    --notif-radius: 20px;
    --notif-blur: blur(40px) saturate(200%);
}

/* ────────────────────────── Base card ────────────────────────── */
.notif {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: var(--notif-radius);
    background: var(--notif-bg);
    backdrop-filter: var(--notif-blur);
    -webkit-backdrop-filter: var(--notif-blur);
    border: 0.5px solid var(--notif-border);
    box-shadow: var(--notif-shadow);
    cursor: pointer;
    user-select: none;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    position: relative;
    transition: transform 0.14s ease, filter 0.14s ease;
    overflow: hidden;
    /* Specular highlight (iOS 26 liquid glass) */
    --glass-highlight: linear-gradient(
        160deg,
        rgba(255,255,255,0.55) 0%,
        rgba(255,255,255,0.0) 60%
    );
}

.notif::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--glass-highlight);
    border-radius: inherit;
    pointer-events: none;
}

.notif:active {
    transform: scale(0.975);
    filter: brightness(0.97);
}

/* ────────────────────────── Icon ────────────────────────── */
.notif__icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

.notif__icon {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.notif__icon-placeholder {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(120, 120, 128, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #6e6e73;
}

/* ────────────────────────── Body ────────────────────────── */
.notif__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.notif__row-top {
    display: flex;
    align-items: baseline;
    gap: 4px;
}

.notif__app-name {
    font-size: 11px;
    font-weight: 600;
    color: var(--notif-sub);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    flex-shrink: 0;
}

.notif__title {
    font-size: 13px;
    font-weight: 600;
    color: var(--notif-title);
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notif__title--solo {
    font-size: 14px;
}

.notif__time {
    font-size: 11px;
    color: var(--notif-sub);
    flex-shrink: 0;
    margin-left: auto;
}

.notif__description {
    font-size: 13px;
    color: var(--notif-sub);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
}

/* ────────────────────────── Dismiss button ────────────────────────── */
.notif__dismiss {
    flex-shrink: 0;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(120, 120, 128, 0.22);
    border: none;
    color: var(--notif-sub);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: background 0.15s, transform 0.12s;
}

.notif__dismiss:hover {
    background: rgba(120, 120, 128, 0.35);
}

.notif__dismiss:active {
    transform: scale(0.88);
}

/* ════════════════════════════════════════════════
   STACKED variant
════════════════════════════════════════════════ */
.notif-stack {
    position: relative;
    cursor: pointer;
}

/* Peek cards: rendered as styled pseudo-elements via depth variable */
.notif-stack__peek {
    position: absolute;
    left: calc(var(--depth) * 4px);
    right: calc(var(--depth) * 4px);
    bottom: calc(var(--depth) * -8px);
    height: 100%;
    background: var(--notif-bg);
    backdrop-filter: var(--notif-blur);
    -webkit-backdrop-filter: var(--notif-blur);
    border: 0.5px solid var(--notif-border);
    box-shadow: var(--notif-shadow);
    border-radius: var(--notif-radius);
    opacity: calc(1 - var(--depth) * 0.15);
    transform: scale(calc(1 - var(--depth) * 0.03));
    transform-origin: bottom center;
    pointer-events: none;
}

.notif-stack__front {
    position: relative;
    z-index: 3;
}

.notif-stack__count {
    flex-shrink: 0;
    background: rgba(120, 120, 128, 0.22);
    color: var(--notif-sub);
    font-size: 11px;
    font-weight: 700;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ════════════════════════════════════════════════
   EXPANDED variant
════════════════════════════════════════════════ */
.notif-expanded {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
}

.notif--expanded-header {
    cursor: default;
}

.notif-expanded__content {
    border-radius: var(--notif-radius);
    background: var(--notif-bg);
    backdrop-filter: var(--notif-blur);
    -webkit-backdrop-filter: var(--notif-blur);
    border: 0.5px solid var(--notif-border);
    box-shadow: var(--notif-shadow);
    overflow: hidden;
    min-height: 120px;
}

.notif-expanded__actions {
    border-radius: var(--notif-radius);
    background: var(--notif-bg);
    backdrop-filter: var(--notif-blur);
    -webkit-backdrop-filter: var(--notif-blur);
    border: 0.5px solid var(--notif-border);
    box-shadow: var(--notif-shadow);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.notif-action {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    background: transparent;
    border: none;
    border-top: 0.5px solid rgba(120, 120, 128, 0.15);
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-family: inherit;
    font-size: 15px;
    font-weight: 500;
    color: var(--notif-title);
    transition: background 0.1s;
}

.notif-action:first-child {
    border-top: none;
}

.notif-action:active {
    background: rgba(120, 120, 128, 0.12);
}

.notif-action--destructive {
    color: #ff3b30;
}

.notif-action__icon {
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    flex-shrink: 0;
}

.notif-action__label {
    flex: 1;
}

/* ════════════════════════════════════════════════
   DARK MODE
════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
    .notif,
    .notif-stack__peek,
    .notif-expanded__content,
    .notif-expanded__actions {
        --notif-bg: rgba(28, 28, 30, 0.82);
        --notif-border: rgba(255, 255, 255, 0.08);
        --notif-shadow: 0 4px 28px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.06) inset;
        --notif-title: #f5f5f7;
        --notif-sub: rgba(235, 235, 245, 0.6);
        --glass-highlight: linear-gradient(
            160deg,
            rgba(255,255,255,0.07) 0%,
            rgba(255,255,255,0.0) 60%
        );
    }

    .notif__icon-placeholder {
        background: rgba(120, 120, 128, 0.32);
        color: rgba(235, 235, 245, 0.5);
    }

    .notif__dismiss {
        background: rgba(120, 120, 128, 0.3);
        color: rgba(235, 235, 245, 0.5);
    }

    .notif__dismiss:hover {
        background: rgba(120, 120, 128, 0.45);
    }

    .notif-stack__count {
        background: rgba(120, 120, 128, 0.3);
        color: rgba(235, 235, 245, 0.6);
    }

    .notif-action {
        color: #f5f5f7;
        border-color: rgba(255,255,255,0.06);
    }

    .notif-action--destructive {
        color: #ff453a;
    }

    .notif-action:active {
        background: rgba(255,255,255,0.06);
    }
}
</style>
