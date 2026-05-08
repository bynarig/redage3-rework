<script setup lang="ts">
import { ref, watch } from 'vue'
import { useLaptopStore } from '@/stores/laptop'
import { useRadio } from '@/views/accessories/shared/composables/useRadio'

const laptopStore = useLaptopStore()
const {
    selectPage, isToggled, selectedStation, volume,
    stationNames, updateToggled, changeVolume, setRadioStation,
} = useRadio(laptopStore.radioState, laptopStore.radioStation)

watch(isToggled, (v) => { laptopStore.radioState = v })
watch(selectedStation, (v) => { laptopStore.radioStation = v })
</script>

<template>
    <div class="radio-app">
        <!-- Player view -->
        <template v-if="selectPage === 'radio'">
            <div class="radio-header">
                <div class="radio-brand">
                    <div class="radio-wave-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M2 16.5a11 11 0 0 1 20 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M5 12.5a7 7 0 0 1 14 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M8 8.5a4 4 0 0 1 8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <circle cx="12" cy="20" r="1.5" fill="currentColor"/>
                        </svg>
                    </div>
                    <div>
                        <div class="radio-title">Radio <span class="radio-fm">FM</span></div>
                        <div class="radio-sub">Los Santos</div>
                    </div>
                </div>
            </div>

            <div class="player-body">
                <div class="album-art">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18V5l12-2v13" stroke="rgba(255,255,255,0.8)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <circle cx="6" cy="18" r="3" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>
                        <circle cx="18" cy="16" r="3" stroke="rgba(255,255,255,0.8)" stroke-width="1.5"/>
                    </svg>
                    <div class="on-air-badge">On Air</div>
                </div>
                <div class="station-name">{{ stationNames[selectedStation] }}</div>
                <div class="station-index">Станция {{ selectedStation + 1 }} из {{ stationNames.length }}</div>
            </div>

            <div class="controls-section">
                <div class="control-row">
                    <span class="control-label">Радио</span>
                    <div class="toggle" :class="{ on: isToggled }" @click="updateToggled">
                        <div class="toggle-thumb" />
                    </div>
                </div>

                <div class="control-row">
                    <span class="control-label">Громкость</span>
                    <div class="volume-control">
                        <button class="vol-btn" @click="changeVolume(-1)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <div class="volume-bar">
                            <div class="volume-fill" :style="{ width: `${Math.round(volume / 10) * 10}%` }" />
                        </div>
                        <button class="vol-btn" @click="changeVolume(+1)">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <span class="volume-value">{{ Math.round(volume / 10) }}</span>
                    </div>
                </div>

                <button class="change-station-btn" @click="selectPage = 'radioList'">
                    Сменить станцию
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </template>

        <!-- Station list view -->
        <template v-else>
            <div class="station-header">
                <button class="back-btn" @click="selectPage = 'radio'">&#8249; Назад</button>
                <span class="station-header-title">Выберите волну</span>
            </div>
            <div class="station-list">
                <div
                    v-for="(name, index) in stationNames"
                    :key="index"
                    class="station-item"
                    :class="{ active: selectedStation === index }"
                    @click="setRadioStation(index)"
                >
                    <div class="station-num">{{ index + 1 }}</div>
                    <div class="station-info">
                        <div class="station-item-name">{{ name }}</div>
                        <div v-if="selectedStation === index" class="station-on-air">On Air</div>
                    </div>
                    <div v-if="selectedStation === index" class="station-active-dot">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="#007aff">
                            <circle cx="4" cy="4" r="4"/>
                        </svg>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.radio-app {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.radio-header {
    padding: 20px 24px 16px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.radio-brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.radio-wave-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #007aff, #5856d6);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
}

.radio-title {
    font-size: 18px;
    font-weight: 700;
    color: #1d1d1f;
}

.radio-fm {
    color: #007aff;
}

.radio-sub {
    font-size: 12px;
    color: #6e6e73;
}

.player-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 32px 24px;
    background: linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    flex-shrink: 0;
}

.album-art {
    width: 120px;
    height: 120px;
    background: rgba(255,255,255,0.08);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 2px solid rgba(255,255,255,0.1);
}

.on-air-badge {
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    background: #ff3b30;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 10px;
    letter-spacing: 0.5px;
}

.station-name {
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    text-align: center;
}

.station-index {
    font-size: 12px;
    color: rgba(255,255,255,0.5);
}

.controls-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
    background: #fff;
    margin: 16px;
    border-radius: 12px;
    border: 1px solid rgba(0,0,0,0.08);
    overflow: hidden;
}

.control-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
}

.control-label {
    font-size: 14px;
    color: #1d1d1f;
    font-weight: 500;
}

.toggle {
    width: 44px;
    height: 24px;
    background: rgba(0,0,0,0.15);
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
}

.toggle.on {
    background: #34c759;
}

.toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    transition: transform 0.2s;
}

.toggle.on .toggle-thumb {
    transform: translateX(20px);
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 8px;
}

.vol-btn {
    width: 28px;
    height: 28px;
    background: rgba(0,0,0,0.06);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #007aff;
    transition: background 0.12s;
}

.vol-btn:hover {
    background: rgba(0,0,0,0.1);
}

.volume-bar {
    width: 120px;
    height: 4px;
    background: rgba(0,0,0,0.1);
    border-radius: 2px;
    overflow: hidden;
}

.volume-fill {
    height: 100%;
    background: #007aff;
    border-radius: 2px;
    transition: width 0.15s;
}

.volume-value {
    font-size: 13px;
    font-weight: 600;
    color: #1d1d1f;
    min-width: 20px;
    text-align: right;
}

.change-station-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 12px 16px;
    padding: 12px;
    background: rgba(0,122,255,0.08);
    color: #007aff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.12s;
}

.change-station-btn:hover {
    background: rgba(0,122,255,0.15);
}

/* Station list */
.station-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.08);
    flex-shrink: 0;
}

.back-btn {
    background: none;
    border: none;
    color: #007aff;
    font-size: 14px;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
}

.station-header-title {
    font-size: 17px;
    font-weight: 600;
    color: #1d1d1f;
}

.station-list {
    flex: 1;
    overflow-y: auto;
    background: #fff;
}

.station-list::-webkit-scrollbar {
    width: 4px;
}

.station-list::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.12);
    border-radius: 2px;
}

.station-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.06);
    cursor: pointer;
    transition: background 0.12s;
}

.station-item:last-child {
    border-bottom: none;
}

.station-item:hover {
    background: rgba(0,0,0,0.03);
}

.station-item.active {
    background: rgba(0,122,255,0.04);
}

.station-num {
    width: 28px;
    height: 28px;
    background: rgba(0,0,0,0.06);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: #6e6e73;
    flex-shrink: 0;
}

.station-item.active .station-num {
    background: rgba(0,122,255,0.12);
    color: #007aff;
}

.station-info {
    flex: 1;
}

.station-item-name {
    font-size: 14px;
    font-weight: 500;
    color: #1d1d1f;
}

.station-on-air {
    font-size: 11px;
    color: #ff3b30;
    font-weight: 600;
    margin-top: 2px;
}

.station-active-dot {
    flex-shrink: 0;
}
</style>
