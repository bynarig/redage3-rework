import { ref, onMounted } from 'vue'
import { executeClient, executeClientToGroup } from '@/api/rage'
import { useDevice } from './useDevice'
import { usePosition } from './usePosition'

export const GPS_CATEGORIES = [
    {
        name: 'Гос. структуры',
        icon: 'gos',
        content: ['City Hall', 'LSPD', 'EMS', 'FIB', 'NEWS', 'Центр управления', 'SHERIFF 1', 'SHERIFF 2'],
    },
    {
        name: 'Банды',
        icon: 'weapons',
        content: ['Marabunta Grande', 'Vagos', 'Ballas', 'The Families', 'Bloods Street'],
    },
    {
        name: 'Мафии',
        icon: 'mafia',
        content: ['La Cosa Nostra', 'Русская мафия', 'Yakuza', 'Армянская мафия'],
    },
    {
        name: 'Работы',
        icon: 'licenses',
        content: [
            'Электростанция', 'Отделение почты', 'Таксопарк', 'Автобусный парк',
            'Стоянка газонокосилок', 'Стоянка дальнобойщиков', 'Стоянка инкассаторов', 'Стоянка автомехаников',
        ],
    },
    {
        name: 'Подработка',
        icon: 'jobs',
        content: [
            'Гражданская шахта 1', 'Гражданская шахта 2', 'Гражданская шахта 3', 'Гражданская шахта 4',
            'Государственная шахта', 'Лесоруб 1', 'Лесоруб 2', 'Лесоруб 3', 'Лесоруб 4', 'Лесоруб 5',
        ],
    },
    {
        name: 'Ближайшие места',
        icon: 'recent',
        content: ['Ближайшая аренда мотоциклов', 'Ближайшая аренда велосипеда', 'Ближайшая аренда лодки'],
    },
    {
        name: 'Прочее',
        icon: 'clubs',
        content: [
            'Автошкола', 'Казино', 'Семьи', 'Арена', 'Амфитеатр', 'Humane Labs',
            'Маяк', 'Охотничий магазин', 'Главный рынок', 'Черный рынок', 'Церковь',
            'Продавец питомцев', 'Суд',
        ],
    },
]

export const GPS_CAT_ICON_MAP: Record<string, string> = {
    gos: 'phoneicons-gos',
    weapons: 'phoneicons-weapons',
    mafia: 'phoneicons-mafia',
    licenses: 'phoneicons-licenses',
    jobs: 'phoneicons-jobs',
    recent: 'phoneicons-recent2',
    clubs: 'phoneicons-clubs',
}

export function useGps() {
    const device = useDevice()
    const pos = usePosition()

    const selectedCategory = ref<number | null>(null)
    const selectedList = ref<string | null>(null)

    const onDefaultPoint = (index: string) => {
        executeClient('gps.pointDefault', index)
        executeClientToGroup('close')
    }

    const closeMenu = () => {
        if (selectedCategory.value === null) {
            device.setPage('mainmenu')
        } else if (selectedList.value !== null) {
            selectedList.value = null
            pos.getPosition()
            pos.updateHeightMap()
        } else {
            selectedCategory.value = null
            pos.updateHeightMap()
        }
    }

    onMounted(() => {
        pos.getPosition()
        pos.updateHeightMap()
    })

    return {
        ...pos,
        selectedCategory,
        selectedList,
        categoriesList: GPS_CATEGORIES,
        catIconMap: GPS_CAT_ICON_MAP,
        onDefaultPoint,
        closeMenu,
    }
}
