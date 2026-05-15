import { ref } from 'vue'
import { executeClientAsyncToGroup, executeClientToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { NEWS_CATEGORIES } from '../types/news'
import type { NewsItem } from '../types/news'

export function useNews() {
    const isLoad = ref(false)
    const newsList = ref<NewsItem[]>([])
    const selectedNews = ref<NewsItem | null>(null)
    const isAddView = ref(false)
    const addTitle = ref('')
    const addText = ref('')
    const addType = ref(0)

    const loadNews = () => {
        executeClientAsyncToGroup('getNews').then((result) => {
            if (result && typeof result === 'string') {
                try { newsList.value = JSON.parse(result) } catch {}
            }
            isLoad.value = true
        })
    }

    executeClientToGroup('loadNews')

    addListernEvent('phoneNewsLoad', () => { isLoad.value = true; loadNews() })

    const onAddNews = () => {
        if (!addTitle.value.trim() || !addText.value.trim()) return
        executeClientToGroup('addNews', addType.value, addTitle.value, addText.value)
        addTitle.value = ''
        addText.value = ''
        isAddView.value = false
    }

    return {
        isLoad,
        newsList,
        selectedNews,
        isAddView,
        addTitle,
        addText,
        addType,
        categories: NEWS_CATEGORIES,
        loadNews,
        onAddNews,
    }
}
