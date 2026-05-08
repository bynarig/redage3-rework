<script setup lang="ts">
import './main.scss'
import { ref, computed, watchEffect } from 'vue'
import { z } from 'zod'
import { IosSearchField, IosProgressBar, UiAlert } from '@/components/ui'

const ColumnSchema = z.object({
    key: z.string().min(1),
    name: z.string().min(1),
    width: z.number().min(1).max(100),
    sortable: z.boolean().optional(),
    reverse: z.boolean().optional(),
})

const ColumnsSchema = z.array(ColumnSchema)

export type SortColumn = z.infer<typeof ColumnSchema>
export type SortListElement = Record<string, unknown>

const props = withDefaults(defineProps<{
    columns?: SortColumn[]
    elements?: any[]
    searchKey?: string
    searchPlaceholder?: string
    emptyText?: string
    listHeight?: string
    loading?: boolean
    theme?: 'light' | 'dark'
}>(), {
    searchPlaceholder: 'Search…',
    emptyText: 'No results',
    listHeight: '320px',
    loading: false,
    theme: 'dark',
})

const emit = defineEmits<{
    'update:elements': [elements: any[]]
    'update:columns': [columns: SortColumn[]]
}>()

const selectedSortKey = ref('')
const searchText = ref('')

watchEffect(() => {
    if (!props.columns?.length) return
    const result = ColumnsSchema.safeParse(props.columns)
    if (!result.success) {
        console.warn('[SortList] Invalid columns config:', result.error.issues)
    }
})

const filterCheck = (el: any, text: string): boolean => {
    text = text.toLowerCase().trim()
    if (!text) return true
    if (!props.searchKey) {
        return Object.values(el).some((item) => {
            if (!Array.isArray(item)) {
                return String(item).toLowerCase().trim().includes(text.replace(' ', '_'))
            }
            return (item as any[]).some((i) =>
                String(i).toLowerCase().trim().includes(text.replace(' ', '_'))
            )
        })
    }
    if (!el[props.searchKey]) return false
    return String(el[props.searchKey]).toLowerCase().trim().includes(text.replace(' ', '_'))
}

const filteredElements = computed(() =>
    (props.elements ?? []).filter((el) => filterCheck(el, searchText.value))
)

const selectSort = (column: SortColumn) => {
    if (!column.sortable) return
    const items = [...(props.elements ?? [])]
    if (selectedSortKey.value === column.key) {
        emit('update:elements', items.reverse())
    } else {
        selectedSortKey.value = column.key
        emit(
            'update:elements',
            items.sort((a, b) =>
                a[column.key] > b[column.key] ? 1 : a[column.key] < b[column.key] ? -1 : 0
            )
        )
    }
    emit(
        'update:columns',
        (props.columns ?? []).map((c) =>
            c.key === column.key ? { ...c, reverse: !c.reverse } : c
        )
    )
}
</script>

<template>
    <div
        class="box-sortlist"
        :class="[`box-sortlist--${theme}`]"
        :style="{ '--sortlist-height': listHeight }"
    >
        <!-- Search bar -->
        <div v-if="searchKey" class="box-input">
            <IosSearchField
                v-model="searchText"
                :placeholder="searchPlaceholder"
                size="md"
                class="sortlist-search"
            />
        </div>

        <!-- Loading bar -->
        <IosProgressBar
            v-if="loading"
            color="accent"
            size="xs"
            indeterminate
            class="sortlist-loader"
        />

        <!-- Column headers -->
        <div class="box-header">
            <div
                v-for="column in columns"
                :key="column.key"
                class="desc"
                :style="{ width: `${column.width}%` }"
                :class="{ active: selectedSortKey === column.key, sortable: column.sortable }"
                @click="selectSort(column)"
            >
                <span class="desc__name">{{ column.name }}</span>
                <span v-if="column.sortable" class="desc__sort" aria-hidden="true">
                    <svg
                        viewBox="0 0 10 14"
                        fill="none"
                        class="desc__arrow"
                        :class="column.reverse ? 'desc__arrow--down' : 'desc__arrow--up'"
                    >
                        <path d="M5 1v12M1 5l4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </span>
            </div>
        </div>

        <!-- List area -->
        <div class="listScrollBar">
            <!-- Empty state -->
            <div v-if="filteredElements.length === 0 && !loading" class="sortlist-empty">
                <UiAlert color="neutral" variant="soft" :title="emptyText" />
            </div>

            <template v-else>
                <slot
                    v-for="(element, index) in filteredElements"
                    :key="index"
                    :index="index"
                    :element="element"
                />
            </template>
        </div>
    </div>
</template>

<style scoped>
.box-sortlist {
    --sortlist-text:           rgba(255, 255, 255, 0.9);
    --sortlist-text-secondary: rgba(171, 171, 171, 1);
    --sortlist-border:         rgba(0, 0, 0, 0.12);
    --sortlist-hover:          rgba(255, 255, 255, 0.05);
}

.box-sortlist--light {
    --sortlist-text:           var(--ui-label);
    --sortlist-text-secondary: var(--ui-label-secondary);
    --sortlist-border:         var(--ui-separator);
    --sortlist-hover:          var(--ui-fill-quaternary);
}

/* Search */
.box-input {
    padding-bottom: 10px;
}

.sortlist-search {
    /* IosSearchField uses --ui-fill for its bg, which reads from theme — keep as-is */
}

/* Loader */
.sortlist-loader {
    margin-bottom: 6px;
}

/* Headers */
.box-header {
    display: flex;
    align-items: center;
    height: 40px;
    border-bottom: 1px solid var(--sortlist-border);
    padding-bottom: 2px;
}

.desc {
    display: flex;
    align-items: center;
    color: var(--sortlist-text-secondary);
    font-family: var(--ui-font);
    font-size: 12px;
    font-weight: var(--ui-fw-medium);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    -webkit-user-select: none;
    user-select: none;
}

.desc.sortable {
    cursor: pointer;
    transition: color var(--ui-dur-fast);
}

.desc.sortable:hover {
    color: var(--sortlist-text);
}

.desc.active {
    color: var(--sortlist-text);
}

.desc__sort {
    display: inline-flex;
    align-items: center;
    margin-left: 5px;
    opacity: 0.45;
}

.desc.active .desc__sort {
    opacity: 0.9;
}

.desc__arrow {
    width: 10px;
    height: 14px;
    transition: transform var(--ui-dur) var(--ui-ease);
}

.desc__arrow--down {
    transform: scaleY(-1);
}

/* Scroll list */
.listScrollBar {
    width: 100%;
    height: var(--sortlist-height);
    overflow: hidden;
    overflow-y: auto;
    font-size: 13px;
    font-family: var(--ui-font);
    color: var(--sortlist-text);
}

.listScrollBar::-webkit-scrollbar {
    width: 3px;
}

.listScrollBar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
}

/* Empty state */
.sortlist-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
}
</style>
