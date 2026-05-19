import { ref } from 'vue'
import { executeClientAsyncToGroup } from '@/api/rage'
import { WEATHER_NAMES, NIGHT_WEATHERS, getWeatherName } from '../types/weather'
import type { WeatherItem } from '../types/weather'

const DAY_NAMES = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
const MONTH_NAMES = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

export function useWeather() {
    const weatherInfo = ref<WeatherItem[]>([])
    const currentWeather = ref<WeatherItem>({ weatherId: 0, hour: 12, minute: 0, temp: 0 })

    executeClientAsyncToGroup('getWeather').then((result) => {
        if (result && typeof result === 'string') {
            weatherInfo.value = JSON.parse(result)
            const first = weatherInfo.value[0]
            if (weatherInfo.value.length && first) currentWeather.value = first
        }
    })

    const formatTime = (t: number) => String(t).padStart(2, '0')

    const now = new Date()
    const dateStr = `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()]}`

    return {
        weatherInfo,
        currentWeather,
        formatTime,
        dateStr,
        weatherNames: WEATHER_NAMES,
        nightWeathers: NIGHT_WEATHERS,
        getWeatherName,
    }
}
