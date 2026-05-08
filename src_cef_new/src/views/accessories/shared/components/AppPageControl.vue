<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    /** Total number of pages */
    total: number
    /** Current page index (0-based), use with v-model */
    modelValue: number
    /** Dots beyond this count get the edge-shrink treatment */
    maxVisible?: number
}>(), {
    modelValue: 0,
    maxVisible: 7,
})

const emit = defineEmits<{
    'update:modelValue': [page: number]
}>()

interface DotDescriptor {
    index: number
    active: boolean
    /** 0 = hidden, 1 = full-size active, values in between = scaled inactive */
    scale: number
    opacity: number
}

const dots = computed<DotDescriptor[]>(() => {
    const { total, modelValue: current, maxVisible } = props

    if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => ({
            index: i,
            active: i === current,
            scale: i === current ? 1 : 0.7,
            opacity: i === current ? 1 : 0.32,
        }))
    }

    // Windowed: slide a window of `maxVisible` slots over the full range,
    // centred on the current page, then scale the edge slots.
    const half = Math.floor(maxVisible / 2)
    let wStart = current - half
    let wEnd = current + half

    if (wStart < 0) { wEnd -= wStart; wStart = 0 }
    if (wEnd >= total) { wStart -= wEnd - (total - 1); wEnd = total - 1 }
    wStart = Math.max(0, wStart)

    const hasMoreLeft = wStart > 0
    const hasMoreRight = wEnd < total - 1

    return Array.from({ length: total }, (_, i) => {
        // Outside the window → hidden
        if (i < wStart || i > wEnd) {
            return { index: i, active: false, scale: 0, opacity: 0 }
        }

        if (i === current) {
            return { index: i, active: true, scale: 1, opacity: 1 }
        }

        const fromLeft = i - wStart
        const fromRight = wEnd - i

        // Shrink the outermost visible dot when there are more pages beyond
        if (hasMoreLeft && fromLeft === 0)  return { index: i, active: false, scale: 0.35, opacity: 0.28 }
        if (hasMoreLeft && fromLeft === 1)  return { index: i, active: false, scale: 0.55, opacity: 0.38 }
        if (hasMoreRight && fromRight === 0) return { index: i, active: false, scale: 0.35, opacity: 0.28 }
        if (hasMoreRight && fromRight === 1) return { index: i, active: false, scale: 0.55, opacity: 0.38 }

        return { index: i, active: false, scale: 0.7, opacity: 0.32 }
    })
})

const visibleDots = computed(() => dots.value.filter(d => d.scale > 0))

const go = (index: number) => {
    if (index !== props.modelValue) emit('update:modelValue', index)
}
</script>

<template>
    <div class="page-control" role="tablist" :aria-label="`Page ${modelValue + 1} of ${total}`">
        <button
            v-for="dot in visibleDots"
            :key="dot.index"
            class="dot"
            :class="{ 'dot--active': dot.active }"
            :style="{
                transform: `scale(${dot.scale})`,
                opacity: dot.opacity,
            }"
            :aria-selected="dot.active"
            :aria-label="`Page ${dot.index + 1}`"
            role="tab"
            @click="go(dot.index)"
        />
    </div>
</template>

<style scoped>
.page-control {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 4px 0;
}

.dot {
    /* Base size — active dot stays at 8 px, inactive scales down via transform */
    width: 8px;
    height: 8px;
    border-radius: 50%;
    border: none;
    padding: 0;
    cursor: pointer;
    background: #1d1d1f;
    transform-origin: center;
    transition:
        transform 0.28s cubic-bezier(0.34, 1.26, 0.64, 1),
        opacity  0.28s ease,
        background 0.2s ease;
    flex-shrink: 0;
    /* Expand the click target without changing visual size */
    position: relative;
}

.dot::before {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
}

.dot--active {
    background: #1d1d1f;
    /* Scale is already 1 from the binding — no override needed */
}

/* ── Dark mode ── */
@media (prefers-color-scheme: dark) {
    .dot        { background: #ffffff; }
    .dot--active { background: #ffffff; }
}
</style>
