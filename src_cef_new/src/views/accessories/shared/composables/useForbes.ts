import { ref } from 'vue'
import { executeClientAsyncToGroup, executeClientToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { ForbesListSchema, ForbesItemSchema } from '@/api/contracts/forbes'
import type { ForbesItem } from '@/api/contracts/forbes'

function parseForbesList(raw: unknown): ForbesItem[] {
    if (!raw || typeof raw !== 'string') return []
    const result = ForbesListSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : []
}

function parseForbesItem(raw: unknown): ForbesItem | null {
    if (!raw || typeof raw !== 'string') return null
    const result = ForbesItemSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : null
}

export function useForbes() {
    const isLoad = ref(false)
    const richList = ref<ForbesItem[]>([])
    const selectedIndex = ref<number | null>(null)
    const selectedItem = ref<ForbesItem | null>(null)

    const loadList = () => {
        executeClientAsyncToGroup('forbes.getList').then((result) => {
            richList.value = parseForbesList(result)
            isLoad.value = true
        })
    }

    executeClientToGroup('forbes.load')

    addListernEvent('phone.forbes.load', () => { isLoad.value = true; loadList() })

    const onSelectIndex = (index: number | null) => {
        selectedIndex.value = index
        if (index === null) {
            selectedItem.value = null
            return
        }
        executeClientAsyncToGroup('forbes.getId', index).then((result) => {
            selectedItem.value = parseForbesItem(result)
        })
    }

    const formatMoney = (n: number) => n?.toLocaleString('ru-RU') ?? '0'

    return { isLoad, richList, selectedIndex, selectedItem, formatMoney, onSelectIndex }
}
