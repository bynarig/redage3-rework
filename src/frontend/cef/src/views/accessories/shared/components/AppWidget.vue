<script setup lang="ts">
/**
 * AppWidget — iOS home-screen widget container.
 *
 * Sizes (phone / tablet):
 *   phone:  small 158×158 | medium 338×158 | large 338×354
 *   tablet: small 120×120 | medium 260×120 | large 260×260 | extraLarge 560×260
 */
withDefaults(defineProps<{
    /** Widget family */
    size?: 'small' | 'medium' | 'large' | 'extraLarge'
    /** Device context — affects pixel dimensions */
    device?: 'phone' | 'tablet'
}>(), {
    size: 'medium',
    device: 'phone',
})
</script>

<template>
    <div class="widget" :class="[`widget--${device}`, `widget--${size}`]">
        <slot />
    </div>
</template>

<style scoped>
/* ── Base ── */
.widget {
    position: relative;
    overflow: hidden;
    background: linear-gradient(145deg, #5ac8fa 0%, #2196f3 55%, #1565c0 100%);
    box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.18),
        0 1px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

/* Subtle inner highlight */
.widget::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(
        160deg,
        rgba(255, 255, 255, 0.18) 0%,
        transparent 45%
    );
    pointer-events: none;
}

/* ══ PHONE sizes ══════════════════════════════ */
.widget--phone.widget--small {
    width: 158px;
    height: 158px;
    border-radius: 26px;
}

.widget--phone.widget--medium {
    width: 338px;
    height: 158px;
    border-radius: 26px;
}

.widget--phone.widget--large {
    width: 338px;
    height: 354px;
    border-radius: 26px;
}

/* phone doesn't have extraLarge — fall back to large */
.widget--phone.widget--extraLarge {
    width: 338px;
    height: 354px;
    border-radius: 26px;
}

/* ══ TABLET sizes ═════════════════════════════ */
.widget--tablet.widget--small {
    width: 120px;
    height: 120px;
    border-radius: 22px;
}

.widget--tablet.widget--medium {
    width: 260px;
    height: 120px;
    border-radius: 22px;
}

.widget--tablet.widget--large {
    width: 260px;
    height: 260px;
    border-radius: 22px;
}

.widget--tablet.widget--extraLarge {
    width: 560px;
    height: 260px;
    border-radius: 22px;
}
</style>
