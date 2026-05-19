<script setup lang="ts">
import { useWeather } from '@/views/accessories/shared/composables/useWeather'

const { weatherInfo, currentWeather, formatTime, dateStr, weatherNames, nightWeathers, getWeatherName } = useWeather()
</script>

<template>
    <div class="weather-app">
        <div class="weather-header">
            <div class="header-brand">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" stroke="#007aff" stroke-width="2"/>
                    <path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#007aff" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Los Santos <span class="brand-sub">Weather</span></span>
            </div>
            <div class="header-date">{{ dateStr }}</div>
        </div>

        <div class="current-card">
            <div class="current-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>
                </svg>
                Los Santos
            </div>
            <div class="current-temp-row">
                <div class="current-temp">
                    {{ currentWeather.temp }}<span class="deg">°</span>
                </div>
                <div class="current-condition">
                    <div class="condition-icon">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="5" stroke="rgba(255,255,255,0.9)" stroke-width="1.5"/>
                            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="condition-name">
                        {{ weatherNames[getWeatherName(currentWeather.weatherId, currentWeather.hour)] }}
                    </div>
                </div>
            </div>
        </div>

        <div class="forecast-section">
            <div class="forecast-title">Прогноз по часам</div>
            <div class="forecast-list">
                <div
                    v-for="weather in weatherInfo"
                    :key="`${weather.hour}-${weather.minute}`"
                    class="forecast-item"
                >
                    <div class="forecast-time">
                        {{ formatTime(weather.hour) }}:{{ formatTime(weather.minute) }}
                    </div>
                    <div class="forecast-icon-small">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="5" stroke="#007aff" stroke-width="1.5"/>
                            <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2" stroke="#007aff" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="forecast-temp">{{ weather.temp }}°</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.weather-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.weather-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.header-brand {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
}

.brand-sub {
    color: #6e6e73;
    font-weight: 400;
}

.header-date {
    font-size: 13px;
    color: #6e6e73;
}

.current-card {
    margin: 16px;
    background: linear-gradient(135deg, #1a6fba 0%, #007aff 50%, #34aadc 100%);
    border-radius: 16px;
    padding: 24px;
    color: #fff;
    flex-shrink: 0;
}

.current-location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
    margin-bottom: 16px;
}

.current-temp-row {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
}

.current-temp {
    font-size: 72px;
    font-weight: 200;
    line-height: 1;
    color: #fff;
    letter-spacing: -2px;
}

.deg {
    font-size: 32px;
    font-weight: 300;
    vertical-align: super;
}

.current-condition {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding-bottom: 8px;
}

.condition-icon {
    opacity: 0.9;
}

.condition-name {
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.9);
    text-align: center;
    max-width: 80px;
    line-height: 1.3;
}

.forecast-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin: 0 16px 16px;
    background: #fff;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
}

.forecast-title {
    padding: 14px 16px 10px;
    font-size: 12px;
    font-weight: 600;
    color: #6e6e73;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    flex-shrink: 0;
}

.forecast-list {
    flex: 1;
    overflow-y: auto;
}

.forecast-list::-webkit-scrollbar {
    width: 4px;
}

.forecast-list::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.12);
    border-radius: 2px;
}

.forecast-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    transition: background 0.12s;
}

.forecast-item:last-child {
    border-bottom: none;
}

.forecast-item:hover {
    background: rgba(0,0,0,0.02);
}

.forecast-time {
    width: 52px;
    font-size: 14px;
    font-weight: 500;
    color: #1d1d1f;
    flex-shrink: 0;
}

.forecast-icon-small {
    flex: 1;
    display: flex;
    justify-content: center;
}

.forecast-temp {
    font-size: 16px;
    font-weight: 600;
    color: #1d1d1f;
    width: 40px;
    text-align: right;
}
</style>
