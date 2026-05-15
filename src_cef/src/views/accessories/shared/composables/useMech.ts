import { ref, onMounted } from 'vue'
import { executeClient, executeClientAsyncToGroup, executeClientToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { useDevice } from './useDevice'
import { usePosition } from './usePosition'
import type { MechView, MechOrder, MechJobOrder, MechDriverSelect } from '../types/mech'

export function useMech() {
    const device = useDevice()
    const pos = usePosition()

    const isLoad = ref(false)
    const selectView = ref<MechView>('List')
    const clientOrder = ref<MechOrder>({})
    const driverListData = ref<MechJobOrder[]>([])
    const driverSelect = ref<MechDriverSelect>({})
    const isDriverSelect = ref(false)

    const closeMenu = () => device.setPage('mainmenu')

    const getMenu = () => {
        executeClientAsyncToGroup('mech.getMenu').then((result) => {
            if (result) selectView.value = result as MechView
            isLoad.value = true
            pos.updateHeightMap()
        })
    }

    const loadClientOrder = () => {
        executeClientAsyncToGroup('mech.getOrder').then((result) => {
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

    const onOrder = () => executeClientToGroup('mech.order')
    const onCancelOrder = () => executeClientToGroup('mech.cancel')

    const loadDriverList = () => {
        executeClientAsyncToGroup('mechjob.getList').then((result) => {
            if (result && typeof result === 'string') driverListData.value = JSON.parse(result)
        })
    }

    const loadDriverSelect = () => {
        executeClientAsyncToGroup('mechjob.getSelect').then((result) => {
            if (result && typeof result === 'string') {
                driverSelect.value = JSON.parse(result)
                isDriverSelect.value = !!(driverSelect.value && driverSelect.value.uid)
                if (isDriverSelect.value && driverSelect.value.pos) {
                    pos.position.value = driverSelect.value.pos
                } else {
                    pos.getPosition()
                }
                pos.updateHeightMap()
            }
        })
    }

    const onTakeOrder = (id: number) => executeClientToGroup('mechjob.take', id)
    const onDriverCancelOrder = () => executeClientToGroup('mechjob.cancel')
    const onShowOnMap = () => {
        if (driverSelect.value.pos) {
            executeClient('createWaypoint', driverSelect.value.pos.x, driverSelect.value.pos.y)
            executeClientToGroup('close')
        }
    }

    const onSelectView = (view: MechView) => {
        selectView.value = view
        pos.updateHeightMap()
        if (view === 'Client') loadClientOrder()
        if (view === 'Driver') {
            executeClientToGroup('mechjob.load')
            loadDriverSelect()
            loadDriverList()
        }
    }

    onMounted(() => {
        pos.getPosition()
        getMenu()
    })

    addListernEvent('phone.mech.getMenu', getMenu)
    addListernEvent('phone.mech.load', loadClientOrder)
    addListernEvent('phone.mechjob.load', loadDriverSelect)
    addListernEvent('phone.mechjob.update', loadDriverList)

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
