<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

const props = withDefaults(defineProps<{
    title?: string
    subtitle?: string
    type?: NotificationType
    duration?: number
    icon?: string
    dismissible?: boolean
}>(), {
    type: 'info',
    duration: 0,
    dismissible: false,
})

const emit = defineEmits<{ dismiss: [] }>()

const dismissed = ref(false)
let dismissTimer: ReturnType<typeof setTimeout> | null = null

const typeConfig = computed(() => {
    const map: Record<NotificationType, { color: string; tint: string; defaultIcon: string }> = {
        success:     { color: 'var(--ui-success)',     tint: 'var(--ui-success-tint)',     defaultIcon: 'check' },
        error:       { color: 'var(--ui-destructive)', tint: 'var(--ui-destructive-tint)', defaultIcon: 'x' },
        warning:     { color: 'var(--ui-warning)',     tint: 'var(--ui-warning-tint)',     defaultIcon: 'warn' },
        info:        { color: 'var(--ui-accent)',      tint: 'var(--ui-accent-tint)',      defaultIcon: 'info' },
    }
    return map[props.type]
})

function dismiss() {
    dismissed.value = true
    if (dismissTimer) clearTimeout(dismissTimer)
    emit('dismiss')
}

onMounted(() => {
    if (props.duration > 0) {
        dismissTimer = setTimeout(dismiss, props.duration)
    }
})

onBeforeUnmount(() => {
    if (dismissTimer) clearTimeout(dismissTimer)
})
</script>

<template>
    <Transition name="notif-fly">
        <div
            v-if="!dismissed"
            class="notif"
            :style="{ '--notif-color': typeConfig.color, '--notif-tint': typeConfig.tint }"
            role="alert"
            :aria-live="type === 'error' ? 'assertive' : 'polite'"
        >
            <div class="notif__body">
                <!-- Icon area -->
                <div class="notif__icon-wrap">
                    <span v-if="icon" :class="['notif__icon-custom', icon]" aria-hidden="true" />
                    <template v-else>
                        <!-- success -->
                        <svg v-if="type === 'success'" viewBox="0 0 20 20" fill="none" class="notif__icon-svg" aria-hidden="true">
                            <path d="M4 10.5l4.5 4.5L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <!-- error -->
                        <svg v-else-if="type === 'error'" viewBox="0 0 20 20" fill="none" class="notif__icon-svg" aria-hidden="true">
                            <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <!-- warning -->
                        <svg v-else-if="type === 'warning'" viewBox="0 0 20 20" fill="none" class="notif__icon-svg" aria-hidden="true">
                            <path d="M10 7v5M10 14.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <!-- info -->
                        <svg v-else viewBox="0 0 20 20" fill="none" class="notif__icon-svg" aria-hidden="true">
                            <path d="M10 9v6M10 6.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </template>
                </div>

                <!-- Text area -->
                <div class="notif__text">
                    <div v-if="title" class="notif__title">{{ title }}</div>
                    <div v-if="subtitle" class="notif__subtitle">{{ subtitle }}</div>
                </div>

                <!-- Dismiss button -->
                <button
                    v-if="dismissible"
                    type="button"
                    class="notif__close"
                    aria-label="Dismiss"
                    @click="dismiss"
                >
                    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                </button>
            </div>

            <!-- Countdown bar -->
            <div
                v-if="duration > 0"
                class="notif__countdown"
                :style="{ '--notif-duration': `${duration}ms` }"
            >
                <div class="notif__countdown-fill" />
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.notif {
    position: absolute;
    top: 0.625vw;
    right: 3.96vw;
    width: 18.23vw;
    min-width: 280px;
    max-width: 380px;
    background: rgba(20, 20, 22, 0.88);
    -webkit-backdrop-filter: blur(20px) saturate(200%);
    backdrop-filter: blur(20px) saturate(200%);
    border-radius: 0.52vw;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-left: 3px solid var(--notif-color);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.55), 0 0 0 0.5px rgba(255, 255, 255, 0.05);
    overflow: hidden;
    z-index: 999;
}

.notif__body {
    display: flex;
    align-items: center;
    padding: 0.73vw 0.83vw;
    min-height: 4.17vw;
}

/* Icon */
.notif__icon-wrap {
    flex-shrink: 0;
    width: 2.71vw;
    min-width: 40px;
    height: 2.71vw;
    min-height: 40px;
    border-radius: 0.31vw;
    background: var(--notif-tint);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--notif-color);
    margin-right: 0.73vw;
}

.notif__icon-svg {
    width: 55%;
    height: 55%;
}

.notif__icon-custom {
    font-size: 1.04vw;
}

/* Text */
.notif__text {
    flex: 1;
    min-width: 0;
    overflow: hidden;
}

.notif__title {
    font-family: var(--ui-font);
    font-weight: var(--ui-fw-semibold);
    font-size: 0.88vw;
    min-font-size: 12px;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.notif__subtitle {
    font-family: var(--ui-font);
    font-weight: var(--ui-fw-normal);
    font-size: 0.78vw;
    min-font-size: 11px;
    color: rgba(235, 235, 245, 0.65);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Close button */
.notif__close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: none;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.4);
    margin-left: 8px;
    border-radius: 4px;
    transition: color var(--ui-dur-fast), background var(--ui-dur-fast);
    -webkit-tap-highlight-color: transparent;
}

.notif__close svg {
    width: 10px;
    height: 10px;
}

.notif__close:hover {
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.08);
}

/* Countdown bar */
.notif__countdown {
    height: 3px;
    background: var(--notif-tint);
}

.notif__countdown-fill {
    width: 100%;
    height: 100%;
    background: var(--notif-color);
    animation: notif-countdown var(--notif-duration) linear forwards;
    transform-origin: left center;
}

@keyframes notif-countdown {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
}

/* Fly-in transition */
.notif-fly-enter-active {
    animation: notif-fly-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.notif-fly-leave-active {
    animation: notif-fly-out 0.28s ease-in forwards;
}

@keyframes notif-fly-in {
    from {
        transform: translateY(-110%) scale(0.96);
        opacity: 0;
    }
    to {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}

@keyframes notif-fly-out {
    from {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    to {
        transform: translateY(-40%) scale(0.95);
        opacity: 0;
    }
}
</style>
