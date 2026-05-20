<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

const props = withDefaults(defineProps<{
    title?: string
    description?: string
    fullscreen?: boolean
    dismissible?: boolean
    preventClose?: boolean
    overlay?: boolean
    class?: string
}>(), {
    fullscreen: false,
    dismissible: true,
    preventClose: false,
    overlay: true,
})

defineOptions({ inheritAttrs: false })

function close() {
    if (!props.dismissible || props.preventClose) return
    open.value = false
}
</script>

<template>
    <transition name="ui-modal-fade">
        <div v-if="open" class="ui-modal" :class="[{ 'ui-modal--fs': fullscreen }, $props.class]" v-bind="$attrs">
            <div v-if="overlay" class="ui-modal__overlay" @click="close" />

            <div class="ui-modal__panel" role="dialog" aria-modal="true">
                <header v-if="title || description || $slots.header" class="ui-modal__header">
                    <slot name="header">
                        <div>
                            <h2 v-if="title" class="ui-modal__title">{{ title }}</h2>
                            <p v-if="description" class="ui-modal__desc">{{ description }}</p>
                        </div>
                        <button
                            v-if="dismissible && !preventClose"
                            type="button"
                            class="ui-modal__close"
                            aria-label="Close"
                            @click="close"
                        >×</button>
                    </slot>
                </header>

                <div v-if="$slots.default" class="ui-modal__body">
                    <slot />
                </div>

                <footer v-if="$slots.footer" class="ui-modal__footer">
                    <slot name="footer" />
                </footer>
            </div>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
.ui-modal {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;

    &__overlay {
        position: absolute;
        inset: 0;
        background: rgba(8, 11, 22, 0.42);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    &__panel {
        position: relative;
        z-index: 1;
        width: min(520px, 100%);
        max-height: calc(100vh - 48px);
        display: flex;
        flex-direction: column;
        background: var(--glass-strong-bg);
        backdrop-filter: blur(28px) saturate(180%);
        -webkit-backdrop-filter: blur(28px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: var(--glass-radius-lg);
        box-shadow: var(--glass-shadow-lg);
        color: var(--glass-text);
        overflow: hidden;
        isolation: isolate;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            border-radius: inherit;
            background: linear-gradient(180deg, var(--glass-rim-top) 0%, transparent 20%, transparent 80%, var(--glass-rim-bottom) 100%);
            mix-blend-mode: overlay;
            opacity: 0.55;
        }
    }

    &--fs .ui-modal__panel {
        width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
    }

    &__header {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        padding: 22px 22px 12px;
    }

    &__title {
        margin: 0;
        font-family: var(--ui-font-display);
        font-size: 26px;
        font-weight: 400;
        letter-spacing: -0.012em;
        line-height: 1.15;
    }

    &__desc {
        margin: 4px 0 0;
        font-size: 13.5px;
        color: var(--glass-text-muted);
    }

    &__close {
        all: unset;
        width: 30px;
        height: 30px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 18px;
        line-height: 1;
        color: var(--glass-text-muted);
        background: var(--glass-recessed-bg);
        border: 1px solid var(--glass-border-soft);
        cursor: pointer;
        transition: background 160ms ease, color 160ms ease;

        &:hover { color: var(--glass-text); background: color-mix(in srgb, var(--glass-text) 14%, transparent); }
    }

    &__body {
        position: relative;
        z-index: 1;
        padding: 6px 22px 22px;
        overflow-y: auto;
        font-size: 14px;
        line-height: 1.55;
        color: var(--glass-text-muted);
    }

    &__footer {
        position: relative;
        z-index: 1;
        padding: 14px 22px 18px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        border-top: 1px solid var(--glass-border-soft);
        background: var(--glass-recessed-bg);
    }
}

.ui-modal-fade-enter-active, .ui-modal-fade-leave-active {
    transition: opacity 200ms ease;
    .ui-modal__panel {
        transition: opacity 240ms ease, transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }
}
.ui-modal-fade-enter-from, .ui-modal-fade-leave-to {
    opacity: 0;
    .ui-modal__panel { transform: translateY(12px) scale(0.96); opacity: 0; }
}
</style>
