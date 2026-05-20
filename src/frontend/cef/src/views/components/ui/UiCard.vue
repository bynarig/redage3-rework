<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    description?: string
    highlight?: boolean
    strong?: boolean
    padded?: boolean
    class?: string
}>(), {
    highlight: false,
    strong: false,
    padded: true,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <section
        :class="[
            'ui-card',
            { 'ui-card--highlight': highlight, 'ui-card--strong': strong, 'ui-card--flush': !padded },
            $props.class,
        ]"
        v-bind="$attrs"
    >
        <header v-if="title || description || $slots.header" class="ui-card__header">
            <slot name="header">
                <h3 v-if="title" class="ui-card__title">{{ title }}</h3>
                <p v-if="description" class="ui-card__desc">{{ description }}</p>
            </slot>
        </header>

        <div v-if="$slots.default" class="ui-card__body">
            <slot />
        </div>

        <footer v-if="$slots.footer" class="ui-card__footer">
            <slot name="footer" />
        </footer>
    </section>
</template>

<style lang="scss" scoped>
.ui-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 20px 22px;
    background: var(--glass-pane-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius-lg);
    box-shadow: var(--glass-shadow);
    color: var(--glass-text);
    overflow: hidden;
    isolation: isolate;
    transition: box-shadow 280ms ease, transform 280ms ease;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        background: linear-gradient(180deg,
            var(--glass-rim-top) 0%,
            transparent 18%,
            transparent 82%,
            var(--glass-rim-bottom) 100%);
        mix-blend-mode: overlay;
        opacity: 0.6;
    }

    &--highlight {
        border-color: color-mix(in srgb, var(--glass-accent) 45%, var(--glass-border));
        box-shadow: var(--glass-shadow), 0 0 0 4px var(--glass-accent-soft);
    }

    &--strong {
        background: var(--glass-strong-bg);
        box-shadow: var(--glass-shadow-lg);
    }

    &--flush {
        padding: 0;
    }

    &__header {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__title {
        margin: 0;
        font-family: var(--ui-font-display);
        font-size: 26px;
        font-weight: 400;
        letter-spacing: -0.012em;
        line-height: 1.1;
    }

    &__desc {
        margin: 0;
        font-size: 13.5px;
        color: var(--glass-text-muted);
        letter-spacing: 0.005em;
        line-height: 1.45;
    }

    &__body {
        position: relative;
        z-index: 1;
        font-size: 14px;
        line-height: 1.55;
        color: var(--glass-text-muted);
    }

    &__footer {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 10px;
        padding-top: 6px;
    }
}
</style>
