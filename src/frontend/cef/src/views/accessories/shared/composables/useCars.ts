import { ref } from 'vue'
import { executeClientAsyncToGroup, executeClientToGroup, executeClient } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { CAR_FUNCTIONS } from '../types/cars'
import type { Car } from '../types/cars'

export function useCars() {
    const isLoad = ref(false)
    const carsList = ref<Car[]>([])
    const selectedCar = ref<Car | null>(null)
    const inGarage = ref(false)
    const searchText = ref('')

    const load = () => {
        executeClientAsyncToGroup('cars.getCarsList').then((result) => {
            if (result && typeof result === 'string') {
                try { carsList.value = JSON.parse(result) } catch {}
            }
            isLoad.value = true
        })
        executeClientAsyncToGroup('cars.inGarage').then((r) => { inGarage.value = !!r })
    }

    executeClientToGroup('cars.load')

    addListernEvent('phoneCarsLoad', () => { isLoad.value = true; load() })

    const filteredCars = () => {
        const q = searchText.value.toLowerCase()
        if (!q) return carsList.value
        return carsList.value.filter((c) =>
            c.number.toLowerCase().includes(q) ||
            c.model.toLowerCase().includes(q) ||
            (c.header ?? '').toLowerCase().includes(q)
        )
    }

    const onCarAction = (car: Car, func: string) => {
        executeClientToGroup(`cars.${func}`, car.number)
    }

    const setPointRental = () => {
        executeClient('gps.name', 'Ближайшая аренда авто')
        executeClientToGroup('close')
    }

    return {
        isLoad,
        carsList,
        selectedCar,
        inGarage,
        searchText,
        functionList: CAR_FUNCTIONS,
        filteredCars,
        onCarAction,
        setPointRental,
    }
}
