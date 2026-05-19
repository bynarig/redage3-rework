<script setup lang="ts">
import { useCamera } from '@/views/accessories/shared/composables/useCamera'

useCamera()
</script>

<template>
    <div class="camera-app">
        <div class="camera-overlay">
            <div class="camera-viewfinder">
                <div class="corner tl" />
                <div class="corner tr" />
                <div class="corner bl" />
                <div class="corner br" />
            </div>
            <div class="camera-icon">
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="13" r="4" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>
                </svg>
            </div>
            <div class="camera-status">
                <div class="status-dot" />
                <span>Камера активна</span>
            </div>
            <div class="camera-hint">Управление осуществляется через игровой интерфейс</div>
        </div>
    </div>
</template>

<style scoped>
.camera-app {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: #000;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
}

.camera-overlay {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    position: relative;
}

.camera-viewfinder {
    position: absolute;
    width: 200px;
    height: 200px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.corner {
    position: absolute;
    width: 20px;
    height: 20px;
    border-color: rgba(255,255,255,0.6);
    border-style: solid;
}

.corner.tl { top: 0; left: 0; border-width: 2px 0 0 2px; }
.corner.tr { top: 0; right: 0; border-width: 2px 2px 0 0; }
.corner.bl { bottom: 0; left: 0; border-width: 0 0 2px 2px; }
.corner.br { bottom: 0; right: 0; border-width: 0 2px 2px 0; }

.camera-icon {
    width: 110px;
    height: 110px;
    background: rgba(255,255,255,0.06);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,0.12);
}

.camera-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.8);
}

.status-dot {
    width: 8px;
    height: 8px;
    background: #ff3b30;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

.camera-hint {
    font-size: 12px;
    color: rgba(255,255,255,0.35);
    text-align: center;
    max-width: 220px;
    line-height: 1.5;
}
</style>
