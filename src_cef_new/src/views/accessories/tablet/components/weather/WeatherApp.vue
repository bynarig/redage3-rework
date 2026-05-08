<script setup lang="ts">
import TabletHeader from '../TabletHeader.vue'
import { useWeather } from '@/views/accessories/shared/composables/useWeather'

const { weatherInfo, currentWeather, formatTime, dateStr, weatherNames, nightWeathers, getWeatherName } = useWeather()
</script>

<template>
    <div>
        <TabletHeader />
        <div>
            <div>
                <div></div>
                Los Santos <span>Weather</span>
            </div>
            <div>
                <div>{{ dateStr }}</div>
                <div>Los Santos</div>
                <div></div>
            </div>
            <div>
                <div>{{ currentWeather.temp }}</div>
                <div>
                    <div>&#176;</div>
                    <div>{{ weatherNames[getWeatherName(currentWeather.weatherId, currentWeather.hour)] }}</div>
                </div>
            </div>
            <div>
                <div v-for="weather in weatherInfo" :key="`${weather.hour}-${weather.minute}`">
                    <div>{{ formatTime(weather.hour) }}:{{ formatTime(weather.minute) }}</div>
                    <div></div>
                    <div>{{ weather.temp }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
