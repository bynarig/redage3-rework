import { ref, onMounted } from 'vue'
import { executeClient, executeClientAsyncToGroup, executeClientToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { useDevice } from './useDevice'
import { usePosition } from './usePosition'
import type { TaxiView, TaxiOrder, TaxiJobOrder, TaxiDriverSelect } from '../types/taxi'

export function useTaxi() {
    const device = useDevice()
    const pos = usePosition()

    const isLoad = ref(false)
    const selectView = ref<TaxiView>('List')
    const clientOrder = ref<TaxiOrder>({})
    const driverListData = ref<TaxiJobOrder[]>([])
    const driverSelect = ref<TaxiDriverSelect>({})
    const isDriverSelect = ref(false)

    const closeMenu = () => device.setPage('mainmenu')

    const getMenu = () => {
        executeClientAsyncToGroup('taxi.getMenu').then((result) => {
            if (result) selectView.value = result as TaxiView
            isLoad.value = true
            pos.updateHeightMap()
        })
    }

    const loadClientOrder = () => {
        executeClientAsyncToGroup('taxi.getOrder').then((result) => {
            if (result && typeof result === 'string') {
                clientOrder.value = JSON.parse(result)
                if (clientOrder.value.pos) {
                    pos.position.value = clientOrder.value.pos
                    pos.getStreetAndArea(clientOrder.value.pos)
                } else {
                    pos.getStreetAndArea(pos.position.value)
                }
                pos.updateHeightMap()
            }
        })
    }

    const onOrder = () => executeClientToGroup('taxi.order')
    const onCancelOrder = () => executeClientToGroup('taxi.cancel')

    const loadDriverList = () => {
        executeClientAsyncToGroup('taxijob.getList').then((result) => {
            if (result && typeof result === 'string') driverListData.value = JSON.parse(result)
        })
    }

    const loadDriverSelect = () => {
        executeClientAsyncToGroup('taxijob.getSelect').then((result) => {
            if (result && typeof result === 'string') {
                driverSelect.value = JSON.parse(result)
                isDriverSelect.value = !!(driverSelect.value && driverSelect.value.name)
                if (isDriverSelect.value && driverSelect.value.pos) {
                    pos.position.value = driverSelect.value.pos
                } else {
                    pos.getPosition()
                }
                pos.updateHeightMap()
            }
        })
    }

    const onTakeOrder = (id: number) => executeClientToGroup('taxijob.take', id)
    const onDriverCancelOrder = () => executeClientToGroup('taxijob.cancel')
    const onShowOnMap = () => {
        if (driverSelect.value.pos) {
            executeClient('createWaypoint', driverSelect.value.pos.x, driverSelect.value.pos.y)
            executeClientToGroup('close')
        }
    }

    const onSelectView = (view: TaxiView) => {
        selectView.value = view
        pos.updateHeightMap()
        if (view === 'Client') loadClientOrder()
        if (view === 'Driver') {
            executeClientToGroup('taxijob.load')
            loadDriverSelect()
            loadDriverList()
        }
    }

    onMounted(() => {
        pos.getPosition()
        getMenu()
    })

    addListernEvent('phone.taxi.getMenu', getMenu)
    addListernEvent('phone.taxi.load', loadClientOrder)
    addListernEvent('phone.taxijob.load', loadDriverSelect)
    addListernEvent('phone.taxijob.update', loadDriverList)

    return {
        ...pos,
        isLoad,
        selectView,
        clientOrder,
        driverListData,
        driverSelect,
        isDriverSelect,
        closeMenu,
        onOrder,
        onCancelOrder,
        onTakeOrder,
        onDriverCancelOrder,
        onShowOnMap,
        onSelectView,
    }
}
