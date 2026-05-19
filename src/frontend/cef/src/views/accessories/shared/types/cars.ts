export interface Car {
    number: string
    model: string
    header?: string
    isCreate?: boolean
    isAir?: boolean
    pos?: { x: number; y: number }
}

export const CAR_FUNCTIONS = [
    { name: 'Восстановить', func: 'repair' },
    { name: 'Получить дубликат ключа', func: 'key' },
    { name: 'Сменить замки', func: 'changekey' },
    { name: 'Эвакуировать машину', func: 'evac' },
    { name: 'Отметить в GPS', func: 'gps' },
    { name: 'Продать', func: 'sell' },
]
