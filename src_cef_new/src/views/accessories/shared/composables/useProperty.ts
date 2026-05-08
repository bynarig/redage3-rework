import { ref, onUnmounted } from 'vue'
import { executeClientAsyncToGroup, executeClientToGroup, executeClient } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import type { PropertyItem, PropertyView } from '../types/property'

export function useProperty() {
    const isLoad = ref(false)
    const isSubLoad = ref(false)
    const view = ref<PropertyView>('List')
    const propertyList = ref<PropertyItem[]>([])
    const selectedId = ref(0)

    const loadProperty = () => {
        executeClientAsyncToGroup('getProperty').then((result) => {
            if (result && typeof result === 'string') {
                try { propertyList.value = JSON.parse(result) } catch {}
            }
            isLoad.value = true
        })
    }

    executeClientToGroup('loadProperty')

    addListernEvent('phoneMainPropertyLoad', () => { isLoad.value = true; loadProperty() })
    addListernEvent('phoneHouseInit', () => { isSubLoad.value = true })
    addListernEvent('phoneBusinessInit', () => { isSubLoad.value = true })

    const onSelectItem = (item: PropertyItem) => {
        selectedId.value = item.id
        isSubLoad.value = false
        if (item.type === 0) {
            executeClientToGroup('house.load')
            view.value = 'House'
        } else {
            executeClientToGroup('business.load', item.id)
            view.value = 'Business'
        }
    }

    const setPoint = () => {
        executeClient('gps.name', 'Риэлторское агентство')
        executeClientToGroup('close')
    }

    const backToList = () => {
        view.value = 'List'
        isSubLoad.value = false
    }

    const houseAction = (action: string) => executeClientToGroup(`house.${action}`)
    const businessAction = (action: string) => executeClientToGroup(`business.${action}`, selectedId.value)

    onUnmounted(() => {
        executeClient('client.phone.house.close')
    })

    return {
        isLoad,
        isSubLoad,
        view,
        propertyList,
        selectedId,
        onSelectItem,
        setPoint,
        backToList,
        houseAction,
        businessAction,
    }
}
