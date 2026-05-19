<script setup lang="ts">
import { computed } from 'vue'

export type LiquidGlassTint = 'none' | 'light' | 'dark' | 'accent' | 'warm' | 'cool'
export type LiquidGlassVariant = 'default' | 'thick' | 'thin' | 'ultra'

const props = withDefaults(defineProps<{
    radius?: string
    blur?: number
    padding?: string
    tint?: LiquidGlassTint
    variant?: LiquidGlassVariant
    tag?: string
    specular?: boolean
}>(), {
    radius: '16px',
    blur: 32,
    padding: '16px',
    tint: 'light',
    variant: 'default',
    tag: 'div',
    specular: true,
})

const tintColor = computed<string>(() => {
    const map: Record<LiquidGlassTint, string> = {
        none:   'rgba(255, 255, 255, 0.00)',
        light:  'rgba(255, 255, 255, 0.08)',
        dark:   'rgba(0,   0,   0,   0.18)',
        accent: 'rgba(99,  185, 255, 0.08)',
        warm:   'rgba(255, 200, 140, 0.08)',
        cool:   'rgba(140, 200, 255, 0.08)',
    }
    return map[props.tint]
})

const saturation = computed<number>(() => {
    const map: Record<LiquidGlassVariant, number> = {
        ultra:   220,
        thick:   200,
        default: 180,
        thin:    140,
    }
    return map[props.variant]
})

const brightness = computed<number>(() => {
    const map: Record<LiquidGlassVariant, number> = {
        ultra:   115,
        thick:   112,
        default: 108,
        thin:    104,
    }
    return map[props.variant]
})

const glassStyle = computed(() => ({
    '--lg-blur':       `${props.blur}px`,
    '--lg-saturate':   `${saturation.value}%`,
    '--lg-brightness': `${brightness.value}%`,
    '--lg-tint':       tintColor.value,
    '--lg-radius':     props.radius,
    '--lg-padding':    props.padding,
}))
</script>

<template>
    <component
        :is="tag"
        class="liquid-glass"
        :class="[`liquid-glass--${variant}`, { 'liquid-glass--specular': specular }]"
        :style="glassStyle"
    >
        <slot />
    </component>
</template>

<style scoped>
.liquid-glass {
    position: relative;
    padding: var(--lg-padding);
    border-radius: var(--lg-radius);
    background: var(--lg-tint);
    -webkit-backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-saturate)) brightness(var(--lg-brightness));
    backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-saturate)) brightness(var(--lg-brightness));
    border-top: 1px solid rgba(255, 255, 255, 0.32);
    border-left: 1px solid rgba(255, 255, 255, 0.28);
    border-right: 1px solid rgba(255, 255, 255, 0.10);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
        inset 0 1.5px 0 rgba(255, 255, 255, 0.38),
        inset 0 -1px 0 rgba(0, 0, 0, 0.08),
        inset 1px 0 0 rgba(255, 255, 255, 0.12),
        0 8px 40px rgba(0, 0, 0, 0.18),
        0 2px 8px rgba(0, 0, 0, 0.10);
    overflow: hidden;
}

/* Top specular highlight — the "glass sheen" sweep */
.liquid-glass--specular::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 52%;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.18) 0%,
        rgba(255, 255, 255, 0.04) 60%,
        rgba(255, 255, 255, 0.00) 100%
    );
    border-radius: var(--lg-radius) var(--lg-radius) 0 0;
    pointer-events: none;
    z-index: 0;
}

/* Bottom depth shadow — gives the glass a physical thickness feel */
.liquid-glass--specular::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 36%;
    background: linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.10) 0%,
        rgba(0, 0, 0, 0.00) 100%
    );
    border-radius: 0 0 var(--lg-radius) var(--lg-radius);
    pointer-events: none;
    z-index: 0;
}

/* Slot content sits above the pseudo-element layers */
.liquid-glass > :deep(*) {
    position: relative;
    z-index: 1;
}

/* Variant: ultra — maximum glass density */
.liquid-glass--ultra {
    background: rgba(255, 255, 255, 0.14);
    box-shadow:
        inset 0 2px 0 rgba(255, 255, 255, 0.50),
        inset 0 -1px 0 rgba(0, 0, 0, 0.12),
        inset 1px 0 0 rgba(255, 255, 255, 0.20),
        0 12px 60px rgba(0, 0, 0, 0.24),
        0 4px 16px rgba(0, 0, 0, 0.12);
}

.liquid-glass--ultra::before {
    height: 60%;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.30) 0%,
        rgba(255, 255, 255, 0.06) 55%,
        rgba(255, 255, 255, 0.00) 100%
    );
}

/* Variant: thick — heavy frosted glass */
.liquid-glass--thick {
    background: rgba(255, 255, 255, 0.11);
    box-shadow:
        inset 0 1.5px 0 rgba(255, 255, 255, 0.44),
        inset 0 -1px 0 rgba(0, 0, 0, 0.10),
        0 10px 48px rgba(0, 0, 0, 0.20),
        0 3px 12px rgba(0, 0, 0, 0.10);
}

/* Variant: thin — barely-there glass */
.liquid-glass--thin {
    background: rgba(255, 255, 255, 0.05);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.24),
        0 4px 20px rgba(0, 0, 0, 0.10);
}

.liquid-glass--thin::before {
    height: 45%;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.10) 0%,
        rgba(255, 255, 255, 0.00) 100%
    );
}
</style>
