export interface NewsItem {
    id: number
    title: string
    text: string
    type?: number
    author?: string
    time?: string
}

export const NEWS_CATEGORIES = ['Покупка', 'Продажа', 'Услуги', 'Вакансии', 'Аренда', 'Потеряно', 'Найдено', 'Другое']
