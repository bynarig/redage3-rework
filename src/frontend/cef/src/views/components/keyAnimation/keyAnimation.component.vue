<script setup lang="ts">
import './main.scss'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export type KeyAnimationColor = 'default' | 'accent' | 'success' | 'warning' | 'destructive'
export type KeyAnimationVariant = 'solid' | 'outline' | 'ghost'

const props = withDefaults(defineProps<{
    keyCode?: number
    keyLocation?: number
    callback?: (code: number, clicked: boolean) => void
    click?: () => void
    disabled?: boolean
    nonactive?: boolean
    keyDetector?: boolean
    keyDonate?: boolean
    color?: KeyAnimationColor
    variant?: KeyAnimationVariant
}>(), {
    color: 'default',
    variant: 'solid',
    disabled: false,
    nonactive: false,
    keyDetector: false,
    keyDonate: false,
})

defineOptions({ inheritAttrs: false })

const buttonEl = ref<HTMLElement>()
const state = ref(false)
const laststate = ref(false)

const colorClass = computed(() => props.color !== 'default' ? `key-color--${props.color}` : '')
const variantClass = computed(() => props.variant !== 'solid' ? `key-variant--${props.variant}` : '')

const handleKeydown = (event: KeyboardEvent) => {
    if (props.nonactive) return
    if (props.disabled || state.value) return
    if (props.keyCode !== event.keyCode || props.keyLocation !== event.location) return

    if (props.callback !== undefined) {
        if (props.keyCode !== 27) props.callback(props.keyCode, false)
    }

    if (laststate.value) {
        laststate.value = false
        setTimeout(() => { laststate.value = true }, 0)
    } else {
        laststate.value = true
    }
    state.value = true
}

const handleKeyup = (event: KeyboardEvent) => {
    if (!state.value || props.keyCode !== event.keyCode) return
    if (props.keyCode === 27) props.callback?.(props.keyCode, false)
    state.value = false
}

const onClick = () => {
    props.click?.()
    if (!props.nonactive) props.callback?.(props.keyCode ?? 0, true)
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('keyup', handleKeyup)
})
</script>

<template>
    <div
        ref="buttonEl"
        v-bind="$attrs"
        :class="[
            'KeyAnimation',
            colorClass,
            variantClass,
            {
                active: laststate,
                keyDetector,
                keyDonate,
                pressed: state,
                disabled,
                nonactive,
            },
        ]"
        @click="onClick"
    >
        <slot />
    </div>
</template>

<style scoped>
/* Color overrides — scoped attribute gives higher specificity than main.scss */
.key-color--accent:hover,
.key-color--accent.pressed {
    background: var(--ui-accent);
    color: var(--ui-accent-fg);
}

.key-color--success:hover,
.key-color--success.pressed {
    background: var(--ui-success);
    color: #ffffff;
}

.key-color--warning:hover,
.key-color--warning.pressed {
    background: var(--ui-warning);
    color: #ffffff;
}

.key-color--destructive:hover,
.key-color--destructive.pressed {
    background: var(--ui-destructive);
    color: #ffffff;
}

/* Variant: outline */
.key-variant--outline {
    background: transparent;
    border: 1.5px solid rgba(255, 255, 255, 0.35);
}

.key-variant--outline:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.6);
}

.key-variant--outline.pressed {
    background: rgba(255, 255, 255, 0.2);
}

/* Variant: ghost */
.key-variant--ghost {
    background: transparent;
}

.key-variant--ghost:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
}

.key-variant--ghost.pressed {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
}
</style>
