import { ref } from 'vue'
import { executeClientToGroup, setGroup } from '@/api/rage'

interface DeviceNavConfig<T extends string> {
    groupName: string
    keepSelectPage: T
    noHistoryPage?: T
}

export function createDeviceNavigation<T extends string>(config: DeviceNavConfig<T>) {
    const { groupName, keepSelectPage, noHistoryPage } = config

    const currentPage = ref<T>('mainmenu' as T)
    const selectNumber = ref<number | null>(null)
    const selectedImage = ref(false)
    const selectedImageFunc = ref<((link: string) => void) | false>(false)
    const wallpaper = ref('')
    const radioState = ref(false)
    const radioStation = ref(0)

    let pageArray: T[] = []

    function setPage(page: T) {
        if (page === 'mainmenu') {
            pageArray = []
            executeClientToGroup('finger', 1)
        } else if (!noHistoryPage || page !== noHistoryPage) {
            pageArray.push(currentPage.value)
            executeClientToGroup('finger', 5)
        }
        currentPage.value = page
    }

    function pageBack() {
        let page = 'mainmenu' as T
        const lastIndex = pageArray.length - 1
        if (typeof pageArray[lastIndex] === 'string') {
            page = pageArray[lastIndex]
            pageArray.splice(lastIndex, 1)
        }
        if (page !== keepSelectPage) {
            selectNumber.value = null
        }
        currentPage.value = page
    }

    function reset() {
        currentPage.value = 'mainmenu' as T
        selectNumber.value = null
        selectedImage.value = false
        selectedImageFunc.value = false
        pageArray = []
    }

    function initGroup() {
        setGroup(`.${groupName}.`)
    }

    return {
        currentPage,
        selectNumber,
        selectedImage,
        selectedImageFunc,
        wallpaper,
        radioState,
        radioStation,
        setPage,
        pageBack,
        reset,
        initGroup,
    }
}
