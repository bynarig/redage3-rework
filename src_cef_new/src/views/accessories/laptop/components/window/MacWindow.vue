<script setup lang="ts">
import { useLaptopStore } from '@/stores/laptop'

const laptopStore = useLaptopStore()

const props = defineProps<{
    title: string
}>()

const closeWindow = () => {
    laptopStore.setPage('mainmenu')
}
</script>

<template>
    <div class="mac-window">
        <div class="mac-titlebar" @mousedown.prevent>
            <div class="traffic-lights">
                <div class="light close" @click="closeWindow" title="Close">
                    <svg class="light-icon close-icon" viewBox="0 0 10 10">
                        <path d="M3 3 L7 7 M7 3 L3 7" stroke="rgba(0,0,0,0.5)" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="light minimize" title="Minimize">
                    <svg class="light-icon" viewBox="0 0 10 10">
                        <path d="M2.5 5 L7.5 5" stroke="rgba(0,0,0,0.5)" stroke-width="1.2" stroke-linecap="round"/>
                    </svg>
                </div>
                <div class="light maximize" title="Zoom">
                    <svg class="light-icon" viewBox="0 0 10 10">
                        <path d="M2.5 7.5 L7.5 2.5 M5.5 2.5 L7.5 2.5 L7.5 4.5 M4.5 7.5 L2.5 7.5 L2.5 5.5" stroke="rgba(0,0,0,0.5)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
            <div class="window-title">{{ title }}</div>
            <div class="title-spacer" />
        </div>
        <div class="mac-window-content">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.mac-window {
    position: absolute;
    inset: 0;
    background: rgba(246, 246, 248, 0.97);
    border-radius: 10px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.28);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 50;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", Helvetica, Arial, sans-serif;
}

.mac-titlebar {
    height: 30px;
    background: linear-gradient(to bottom, #f0f0f0 0%, #e4e4e4 100%);
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    padding: 0 12px;
    user-select: none;
    flex-shrink: 0;
}

.traffic-lights {
    display: flex;
    gap: 7px;
    width: 56px;
    align-items: center;
}

.light {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: filter 0.1s;
}

.close:hover {
    filter: brightness(0.88);
}

.light-icon {
    width: 8px;
    height: 8px;
    opacity: 0;
    transition: opacity 0.15s;
    position: absolute;
}

.traffic-lights:hover .close .light-icon {
    opacity: 1;
}

.close {
    background: #ff5f57;
    border: 0.5px solid rgba(0, 0, 0, 0.12);
}

.minimize {
    background: #c8c8c8;
    border: 0.5px solid rgba(0, 0, 0, 0.08);
    cursor: default;
    pointer-events: none;
}

.maximize {
    background: #c8c8c8;
    border: 0.5px solid rgba(0, 0, 0, 0.08);
    cursor: default;
    pointer-events: none;
}

.window-title {
    flex: 1;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: #3c3c3c;
    letter-spacing: 0.1px;
}

.title-spacer {
    width: 56px;
}

.mac-window-content {
    flex: 1;
    position: relative;
    background-color: #f5f5f7;
    overflow: auto;
}

.mac-window-content::-webkit-scrollbar {
    width: 6px;
}

.mac-window-content::-webkit-scrollbar-track {
    background: transparent;
}

.mac-window-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.18);
    border-radius: 3px;
}
</style>
