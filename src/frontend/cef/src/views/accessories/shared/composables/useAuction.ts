import { ref, onUnmounted } from 'vue'
import { executeClientAsyncToGroup, executeClientToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { AuctionListSchema, AUCTION_CATEGORIES } from '@/api/contracts/auction'
import type { AuctionLot } from '@/api/contracts/auction'

function parseList(raw: unknown): AuctionLot[] {
    if (!raw || typeof raw !== 'string') return []
    const result = AuctionListSchema.safeParse(JSON.parse(raw))
    return result.success ? result.data : []
}

function parseSingle(raw: unknown): AuctionLot | null {
    if (!raw || typeof raw !== 'string') return null
    try {
        const item = JSON.parse(raw)
        const result = AuctionListSchema.element.safeParse(item)
        return result.success ? result.data : null
    } catch {
        return null
    }
}

export function useAuction() {
    const isLoad = ref(false)
    const view = ref<'Main' | 'List' | 'Create'>('Main')
    const list = ref<AuctionLot[]>([])
    const myLots = ref<AuctionLot[]>([])
    const categoryId = ref(0)
    const selectedItem = ref<AuctionLot | null>(null)
    const betAmount = ref('')
    const createTitle = ref('')
    const createText = ref('')
    const createPrice = ref('')

    const loadList = () => {
        executeClientAsyncToGroup('auction.getList').then((result) => {
            list.value = parseList(result)
        })
    }

    const loadMyLots = () => {
        executeClientAsyncToGroup('auction.getMyLots').then((result) => {
            myLots.value = parseList(result)
        })
    }

    executeClientToGroup('auction.load')

    addListernEvent('auction.load', () => { isLoad.value = true; loadList(); loadMyLots() })
    addListernEvent('auction.updateList', loadList)

    const onSelectCategory = (index: number) => {
        categoryId.value = index
        executeClientToGroup('auction.selectCategory', index)
        view.value = 'List'
        loadList()
    }

    const onSelectItem = (item: AuctionLot) => {
        selectedItem.value = item
        executeClientToGroup('auction.setItemId', item.id)
    }

    const onBet = () => {
        const amount = parseInt(betAmount.value)
        if (!amount || amount <= 0) return
        executeClientToGroup('auction.bet', amount)
        betAmount.value = ''
    }

    const onCreateLot = () => {
        if (!createTitle.value.trim() || !createText.value.trim() || !createPrice.value) return
        executeClientToGroup('auction.create', createTitle.value, createText.value, parseInt(createPrice.value))
        createTitle.value = ''
        createText.value = ''
        createPrice.value = ''
        view.value = 'Main'
    }

    const formatMoney = (n: number) => n?.toLocaleString('ru-RU') ?? '0'

    onUnmounted(() => {
        executeClientToGroup('auction.close')
    })

    return {
        isLoad,
        view,
        list,
        myLots,
        categoryId,
        selectedItem,
        betAmount,
        createTitle,
        createText,
        createPrice,
        categoryNames: AUCTION_CATEGORIES,
        formatMoney,
        onSelectCategory,
        onSelectItem,
        onBet,
        onCreateLot,
    }
}
