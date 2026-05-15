<script setup lang="ts">
import { computed } from 'vue'

export interface TabItem {
    label: string
    badge?: number | string
    disabled?: boolean
}

const props = withDefaults(defineProps<{
    /** Tab definitions */
    tabs: TabItem[]
    /** Selected tab index — use with v-model */
    modelValue: number
    /** 'phone' = floating pill (iOS 18+ style)
     *  'ipad'  = horizontal top bar */
    variant?: 'phone' | 'ipad'
    /** Show search button at the trailing edge */
    showSearch?: boolean
    /** iPad only: show sidebar toggle on the leading edge */
    showSidebar?: boolean
}>(), {
    modelValue: 0,
    variant: 'phone',
    showSearch: false,
    showSidebar: false,
})

const emit = defineEmits<{
    'update:modelValue': [index: number]
    'search': []
    'sidebar': []
}>()

const select = (i: number) => {
    if (!props.tabs[i]?.disabled && i !== props.modelValue) {
        emit('update:modelValue', i)
    }
}

// CSS vars for the sliding active indicator (phone variant)
const indicatorVars = computed(() => ({
    '--n':   String(props.tabs.length),
    '--sel': String(props.modelValue),
}))
</script>

<template>
    <!-- ══════════ PHONE — floating pill ══════════ -->
    <div v-if="variant === 'phone'" class="tabbar-phone">
        <div class="tabbar-phone__pill" :style="indicatorVars">
            <!-- Sliding active indicator -->
            <div class="tabbar-phone__indicator" aria-hidden="true" />

            <button
                v-for="(tab, i) in tabs"
                :key="i"
                class="tabbar-phone__item"
                :class="{
                    'tabbar-phone__item--active':   i === modelValue,
                    'tabbar-phone__item--disabled': tab.disabled,
                }"
                :aria-selected="i === modelValue"
                :disabled="tab.disabled"
                role="tab"
                @click="select(i)"
            >
                <!-- Icon slot -->
                <span class="tabbar-phone__icon">
                    <slot :name="`icon-${i}`" :active="i === modelValue" />
                </span>

                <span class="tabbar-phone__label">{{ tab.label }}</span>

                <!-- Badge -->
                <span v-if="tab.badge" class="tabbar-badge">{{ tab.badge }}</span>
            </button>
        </div>

        <!-- Trailing search button (outside the pill) -->
        <button v-if="showSearch" class="tabbar-phone__search" @click="emit('search')" aria-label="Search">
            <slot name="search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </slot>
        </button>
    </div>

    <!-- ══════════ IPAD — horizontal top bar ══════════ -->
    <div v-else-if="variant === 'ipad'" class="tabbar-ipad">
        <!-- Leading sidebar toggle -->
        <button v-if="showSidebar" class="tabbar-ipad__sidebar" @click="emit('sidebar')" aria-label="Sidebar">
            <slot name="sidebar-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="9" y1="3" x2="9" y2="21" />
                </svg>
            </slot>
        </button>

        <!-- Tab items -->
        <div class="tabbar-ipad__tabs" role="tablist">
            <button
                v-for="(tab, i) in tabs"
                :key="i"
                class="tabbar-ipad__item"
                :class="{
                    'tabbar-ipad__item--active':   i === modelValue,
                    'tabbar-ipad__item--disabled': tab.disabled,
                }"
                :aria-selected="i === modelValue"
                :disabled="tab.disabled"
                role="tab"
                @click="select(i)"
            >
                <span v-if="$slots[`icon-${i}`]" class="tabbar-ipad__icon">
                    <slot :name="`icon-${i}`" :active="i === modelValue" />
                </span>
                <span class="tabbar-ipad__label">{{ tab.label }}</span>
                <span v-if="tab.badge" class="tabbar-badge">{{ tab.badge }}</span>
            </button>
        </div>

        <!-- Trailing search -->
        <button v-if="showSearch" class="tabbar-ipad__search" @click="emit('search')" aria-label="Search">
            <slot name="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </slot>
        </button>
    </div>
</template>

<style scoped>
/* ═══════════════════════════════════════════════
   SHARED
═══════════════════════════════════════════════ */
.tabbar-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 9999px;
    background: #ff3b30;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    pointer-events: none;
}

/* ═══════════════════════════════════════════════
   PHONE — floating pill
═══════════════════════════════════════════════ */
.tabbar-phone {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
}

/* Outer glass pill */
.tabbar-phone__pill {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border: 0.5px solid rgba(255, 255, 255, 0.9);
    box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.12),
        0 1px 0 rgba(255, 255, 255, 0.6) inset;
    border-radius: 9999px;
    padding: 5px;
    gap: 2px;
}

/* Sliding active indicator */
.tabbar-phone__indicator {
    position: absolute;
    top: 5px;
    bottom: 5px;
    width: calc((100% - 10px) / var(--n));
    left: calc(5px + var(--sel) * ((100% - 10px) / var(--n)));
    border-radius: 9999px;
    background: rgba(0, 122, 255, 0.12);
    transition: left 0.28s cubic-bezier(0.34, 1.1, 0.64, 1);
    pointer-events: none;
    will-change: left;
}

/* Tab button */
.tabbar-phone__item {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    padding: 8px 16px;
    border: none;
    background: transparent;
    border-radius: 9999px;
    cursor: pointer;
    transition: opacity 0.15s ease;
    min-width: 60px;
}

.tabbar-phone__item--disabled {
    opacity: 0.38;
    cursor: not-allowed;
}

.tabbar-phone__item:active:not(.tabbar-phone__item--active):not(.tabbar-phone__item--disabled) {
    opacity: 0.6;
}

/* Icon */
.tabbar-phone__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: rgba(60, 60, 67, 0.5);
    transition: color 0.2s ease;
}

.tabbar-phone__item--active .tabbar-phone__icon {
    color: #007aff;
}

/* Label */
.tabbar-phone__label {
    font-size: 10px;
    font-weight: 500;
    color: rgba(60, 60, 67, 0.5);
    letter-spacing: 0.1px;
    transition: color 0.2s ease, font-weight 0.2s ease;
    line-height: 1;
}

.tabbar-phone__item--active .tabbar-phone__label {
    color: #007aff;
    font-weight: 600;
}

/* Search button (outside pill) */
.tabbar-phone__search {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    border: 0.5px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #1d1d1f;
    transition: transform 0.12s ease, opacity 0.12s ease;
}

.tabbar-phone__search:active {
    transform: scale(0.92);
    opacity: 0.7;
}

/* ═══════════════════════════════════════════════
   IPAD — horizontal top bar
═══════════════════════════════════════════════ */
.tabbar-ipad {
    display: flex;
    align-items: center;
    gap: 2px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    padding: 0 4px;
}

/* Sidebar toggle */
.tabbar-ipad__sidebar {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 9px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #1d1d1f;
    transition: background 0.15s ease;
    margin-right: 4px;
}

.tabbar-ipad__sidebar:hover  { background: rgba(120, 120, 128, 0.1); }
.tabbar-ipad__sidebar:active { background: rgba(120, 120, 128, 0.18); }

/* Scrollable tab row */
.tabbar-ipad__tabs {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 2px;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
}

.tabbar-ipad__tabs::-webkit-scrollbar { display: none; }

/* Individual iPad tab */
.tabbar-ipad__item {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: none;
    border-radius: 9999px;
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s ease;
    flex-shrink: 0;
}

.tabbar-ipad__item:hover:not(.tabbar-ipad__item--active) {
    background: rgba(120, 120, 128, 0.1);
}

.tabbar-ipad__item:active:not(.tabbar-ipad__item--active) {
    background: rgba(120, 120, 128, 0.18);
}

.tabbar-ipad__item--active {
    background: rgba(0, 122, 255, 0.12);
}

.tabbar-ipad__item--disabled {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
}

.tabbar-ipad__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: rgba(60, 60, 67, 0.5);
    flex-shrink: 0;
    transition: color 0.15s ease;
}

.tabbar-ipad__item--active .tabbar-ipad__icon { color: #007aff; }

.tabbar-ipad__label {
    font-size: 14px;
    font-weight: 500;
    color: rgba(60, 60, 67, 0.65);
    transition: color 0.15s ease, font-weight 0.15s ease;
}

.tabbar-ipad__item--active .tabbar-ipad__label {
    color: #007aff;
    font-weight: 600;
}

/* iPad search */
.tabbar-ipad__search {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 9px;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #1d1d1f;
    transition: background 0.15s ease;
    margin-left: 4px;
}

.tabbar-ipad__search:hover  { background: rgba(120, 120, 128, 0.1); }
.tabbar-ipad__search:active { background: rgba(120, 120, 128, 0.18); }

/* ═══════════════════════════════════════════════
   DARK MODE
═══════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
    /* Phone pill */
    .tabbar-phone__pill {
        background: rgba(28, 28, 30, 0.82);
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: 0 4px 28px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset;
    }

    .tabbar-phone__indicator {
        background: rgba(10, 132, 255, 0.2);
    }

    .tabbar-phone__icon  { color: rgba(235, 235, 245, 0.4); }
    .tabbar-phone__label { color: rgba(235, 235, 245, 0.4); }

    .tabbar-phone__item--active .tabbar-phone__icon  { color: #0a84ff; }
    .tabbar-phone__item--active .tabbar-phone__label { color: #0a84ff; }

    .tabbar-phone__search {
        background: rgba(28, 28, 30, 0.82);
        border-color: rgba(255, 255, 255, 0.08);
        box-shadow: 0 4px 28px rgba(0,0,0,0.45);
        color: rgba(235, 235, 245, 0.8);
    }

    /* iPad bar */
    .tabbar-ipad__sidebar,
    .tabbar-ipad__search { color: rgba(235, 235, 245, 0.8); }

    .tabbar-ipad__sidebar:hover,
    .tabbar-ipad__search:hover  { background: rgba(255,255,255,0.08); }
    .tabbar-ipad__sidebar:active,
    .tabbar-ipad__search:active { background: rgba(255,255,255,0.13); }

    .tabbar-ipad__item:hover:not(.tabbar-ipad__item--active)  { background: rgba(255,255,255,0.08); }
    .tabbar-ipad__item:active:not(.tabbar-ipad__item--active) { background: rgba(255,255,255,0.13); }
    .tabbar-ipad__item--active { background: rgba(10,132,255,0.2); }

    .tabbar-ipad__icon  { color: rgba(235, 235, 245, 0.4); }
    .tabbar-ipad__label { color: rgba(235, 235, 245, 0.4); }

    .tabbar-ipad__item--active .tabbar-ipad__icon  { color: #0a84ff; }
    .tabbar-ipad__item--active .tabbar-ipad__label { color: #0a84ff; }
}
</style>
