<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { executeClientAsyncToGroup } from '@/api/rage'
import { usePhoneStore } from '@/stores/phone'

const phoneStore = usePhoneStore()

interface WeatherData {
    weatherId?: number
    hour?: number
    temp?: number
}

const currentWeather = ref<WeatherData>({})

const weatherName: Record<string, string> = {
    cloud: 'Облачно',
    fog: 'Туман',
    rain: 'Дождь',
    snow: 'Снег',
    sunny: 'Солнечно',
    thunder: 'Гроза',
    night: 'Ночь',
    nightcloud: 'Облачно',
    nightfog: 'Туман',
    nightrain: 'Дождь',
    nightthunder: 'Гроза',
    nightsnow: 'Снег',
}

const getWeatherIdToName = (weatherId?: number, hour?: number): string => {
    const isDay = hour !== undefined ? hour > 7 && hour < 21 : true
    if (isDay) {
        switch (weatherId) {
            case 0: case 1: return 'sunny'
            case 2: case 3: case 5: case 9: return 'cloud'
            case 4: return 'fog'
            case 6: case 8: return 'rain'
            case 7: return 'thunder'
            case 10: case 11: case 12: case 13: return 'snow'
        }
    } else {
        switch (weatherId) {
            case 0: case 1: return 'night'
            case 2: case 3: case 5: case 9: return 'nightcloud'
            case 4: return 'nightfog'
            case 6: case 8: return 'nightrain'
            case 7: return 'nightthunder'
            case 10: case 11: case 12: case 13: return 'nightsnow'
        }
    }
    return 'sunny'
}

const weatherClass = () => `newphone__weather_image${getWeatherIdToName(currentWeather.value.weatherId, currentWeather.value.hour)}`
const weatherIconClass = () => getWeatherIdToName(currentWeather.value.weatherId, currentWeather.value.hour)
const weatherLabel = () => weatherName[getWeatherIdToName(currentWeather.value.weatherId, currentWeather.value.hour)] ?? ''

onMounted(() => {
    executeClientAsyncToGroup('getCurrentWeather').then((result) => {
        if (result && typeof result === 'string') {
            currentWeather.value = JSON.parse(result)
        }
    })
})
</script>

<template>
    <div @click="phoneStore.setPage('weather')">
        <div>
            <div>
                Los Santos <span></span>
            </div>
            <div>
                {{ currentWeather.temp ? `-${currentWeather.temp}°C` : '5°C' }}
            </div>
            <div>
                <div></div>
                <div>{{ weatherLabel() }}</div>
            </div>
        </div>
        <div>Погода</div>
    </div>
</template>
