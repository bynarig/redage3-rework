import { ref, nextTick } from 'vue'
import { executeClientAsync } from '@/api/rage'
import type { Position } from '../types/position'

const DEFAULT_POSITION: Position = { x: -301.46353, y: 2785.5164, z: 60.438744 }

export function usePosition() {
    const position = ref<Position>({ ...DEFAULT_POSITION })
    const streetName = ref('')
    const areaName = ref('')
    const mainElement = ref<HTMLElement | null>(null)
    const otherElement = ref<HTMLElement | null>(null)
    const elementWidth = ref(0)
    const elementHeight = ref(0)

    const updateHeightMap = () => {
        nextTick(() => {
            if (mainElement.value && otherElement.value) {
                const defaultMainHeight = 634
                const main = mainElement.value.getBoundingClientRect()
                const other = otherElement.value.getBoundingClientRect()
                if (main && other) {
                    elementWidth.value = main.width
                    elementHeight.value = main.height - other.height + (defaultMainHeight / main.height) * 45
                }
            }
        })
    }

    const getStreetAndArea = (pos: Position) => {
        executeClientAsync('getStreetName', pos).then((r) => { if (r) streetName.value = r as string })
        executeClientAsync('getAreaName', pos).then((r) => { if (r) areaName.value = r as string })
    }

    const getPosition = () => {
        executeClientAsync('getPosition').then((result) => {
            if (result && typeof result === 'string') {
                position.value = JSON.parse(result)
                getStreetAndArea(position.value)
                updateHeightMap()
            }
        })
    }

    return {
        position,
        streetName,
        areaName,
        mainElement,
        otherElement,
        elementWidth,
        elementHeight,
        updateHeightMap,
        getStreetAndArea,
        getPosition,
    }
}
