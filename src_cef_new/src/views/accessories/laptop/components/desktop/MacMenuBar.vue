<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
    appName: string
}>()

import PersonalHotspotIcon from "../../../shared/assets/icons/system/personalhotspot.png"
import BatteryIcon from "../../../shared/assets/icons/system/battery.75percent.png"

const currentTime = ref('')
const currentDate = ref('')

const updateTime = () => {
    const now = new Date()
    const h = String(now.getHours()).padStart(2, '0')
    const m = String(now.getMinutes()).padStart(2, '0')
    currentTime.value = `${h}:${m}`

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    currentDate.value = `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`
}

let interval: ReturnType<typeof setInterval>

onMounted(() => {
    updateTime()
    interval = setInterval(updateTime, 10000)
})

onUnmounted(() => {
    clearInterval(interval)
})
</script>

<template>
    <div class="mac-menu-bar">
        <div class="left-items">
            <div class="app-name">{{ appName }}</div>
            <div class="menu-item hide-mobile">File</div>
            <div class="menu-item hide-mobile">Edit</div>
            <div class="menu-item hide-mobile">View</div>
            <div class="menu-item hide-mobile">Go</div>
            <div class="menu-item hide-mobile">Window</div>
            <div class="menu-item hide-mobile">Help</div>
        </div>

        <div class="right-items">
            <div class="status-icon wifi">
                <img :src="PersonalHotspotIcon" alt="Personal Hotspot" width="14" height="8">
            </div>
            <div class="status-icon battery">
                <img :src="BatteryIcon" alt="Battery" width="16" height="8">
            </div>
            <div class="date-time">
                <span>{{ currentDate }}</span>
                <span>{{ currentTime }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.mac-menu-bar {
    width: 100%;
    height: 1.1vw;
    background: rgb(255 255 255 / 0.29);
    backdrop-filter: blur(20px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 0.5vw;
    font-weight: 500;
    color: #ffffff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    z-index: 89;
    user-select: none;
}

.left-items, .right-items {
    display: flex;
    align-items: center;
    height: 100%;
}
.right-items{
	margin-right: 0.7vw;
}

.app-name {
    font-weight: 700;
    padding: 0 10px;
    cursor: default;
}

.menu-item {
    padding: 0 8px;
    cursor: pointer;
}
.menu-item:hover {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}

.status-icon {
    padding: 0 8px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.date-time {
    padding: 0 10px;
    display: flex;
    gap: 8px;
    cursor: default;
}

@media (max-width: 800px) {
    .hide-mobile {
        display: none;
    }
}
</style>

