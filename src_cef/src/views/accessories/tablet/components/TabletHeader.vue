<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import BatteryIcon from '../../shared/assets/icons/system/battery.75percent.png'

const currentTime = ref('')

const updateTime = () => {
    const now = new Date()
    const h = now.getHours()
    const m = String(now.getMinutes()).padStart(2, '0')
    currentTime.value = `${h}:${m}`
}

let interval: ReturnType<typeof setInterval>

onMounted(() => {
    updateTime()
    interval = setInterval(updateTime, 30000)
})

onUnmounted(() => {
    clearInterval(interval)
})
</script>

<template>
    <div class="tablet-status-bar">
        <div class="tablet-time">{{ currentTime }}</div>
        <div class="tablet-status-icons">
            <div class="tablet-signal">
                <span class="bar bar-1"></span>
                <span class="bar bar-2"></span>
                <span class="bar bar-3"></span>
                <span class="bar bar-4"></span>
            </div>
            <div class="tablet-network">WiFi</div>
            <div class="tablet-battery">
                <img :src="BatteryIcon" alt="Battery" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tablet-status-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    z-index: 100;
    pointer-events: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: white;
    box-sizing: border-box;
}

.tablet-time {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.2px;
}

.tablet-status-icons {
    display: flex;
    align-items: center;
    gap: 5px;
}

.tablet-network {
    font-size: 11px;
    font-weight: 700;
    margin-right: 2px;
}

.tablet-signal {
    display: flex;
    align-items: flex-end;
    gap: 1.5px;
    height: 10px;
    margin-top: 1px;
    margin-right: 2px;

    .bar {
        width: 3px;
        background: white;
        border-radius: 1px;
    }
    .bar-1 { height: 4px; }
    .bar-2 { height: 6px; }
    .bar-3 { height: 8px; }
    .bar-4 { height: 10px; }
}

.tablet-battery {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 12px;
    margin-left: 2px;

    img {
        height: 100%;
        object-fit: contain;
    }
}
</style>
