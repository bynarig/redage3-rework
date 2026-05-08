import { ref, onMounted } from 'vue'
import { executeClient, executeClientAsyncToGroup, executeClientToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { useDevice } from './useDevice'
import { usePosition } from './usePosition'
import type { TruckerSelect, TruckerOrder } from '../types/trucker'

export function useTrucker() {
    const device = useDevice()
    const pos = usePosition()

    const isLoad = ref(false)
    const isSelect = ref(false)
    const selectTrucker = ref<TruckerSelect>({})
    const listData = ref<TruckerOrder[]>([])

    const closeMenu = () => device.setPage('mainmenu')

    const getData = () => {
        executeClientAsyncToGroup('truck.getSelect').then((result) => {
            if (result && typeof result === 'string') {
                selectTrucker.value = JSON.parse(result)
                isSelect.value = !!(selectTrucker.value && selectTrucker.value.uid)
                if (isSelect.value && selectTrucker.value.pos) {
                    pos.position.value = selectTrucker.value.pos
                } else {
                    pos.getPosition()
                }
                pos.updateHeightMap()
            }
        })
        isLoad.value = true
    }

    const loadList = () => {
        executeClientAsyncToGroup('truck.getList').then((result) => {
            if (result && typeof result === 'string') listData.value = JSON.parse(result)
        })
    }

    const onTakeOrder = (id: number) => executeClientToGroup('truck.take', id)
    const onCancelOrder = () => executeClientToGroup('truck.cancel')
    const onShowOnMap = () => {
        if (selectTrucker.value.pos) {
            executeClient('createWaypoint', selectTrucker.value.pos.x, selectTrucker.value.pos.y)
            executeClientToGroup('close')
        }
    }

    onMounted(() => {
        executeClientToGroup('truck.load')
        getData()
        loadList()
        pos.updateHeightMap()
    })

    addListernEvent('phoneTruckerLoad', getData)
    addListernEvent('phone.truck.update', loadList)

    return {
        ...pos,
        isLoad,
        isSelect,
        selectTrucker,
        listData,
        closeMenu,
        onTakeOrder,
        onCancelOrder,
        onShowOnMap,
    }
}
