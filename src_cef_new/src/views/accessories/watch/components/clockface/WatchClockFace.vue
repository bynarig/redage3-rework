<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDevice } from '../../../shared/composables/useDevice'

const device = useDevice()

const now = ref(new Date())
let timer: ReturnType<typeof setInterval>

onMounted(() => {
    timer = setInterval(() => { now.value = new Date() }, 1000)
})
onUnmounted(() => clearInterval(timer))

const hours = computed(() => String(now.value.getHours()).padStart(2, '0'))
const minutes = computed(() => String(now.value.getMinutes()).padStart(2, '0'))
const secs = computed(() => String(now.value.getSeconds()).padStart(2, '0'))

const dateStr = computed(() => {
    const d = now.value
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
})

const arc = (r: number, progress: number) => {
    const c = 2 * Math.PI * r
    return `${c * progress} ${c}`
}
</script>

<template>
    <div class="awf-root" @click="device.setPage('homescreen')">
        <!-- Status bar -->
        <div class="awf-status">
            <div class="awf-signal">
                <span v-for="i in 4" :key="i" class="awf-bar" :class="{ lit: i <= 3 }"></span>
            </div>
            <span class="awf-location">SAN ANDREAS</span>
            <div class="awf-battery">
                <span class="awf-bat-pct">87%</span>
                <div class="awf-bat-body">
                    <div class="awf-bat-fill" style="width: 87%"></div>
                    <div class="awf-bat-nub"></div>
                </div>
            </div>
        </div>

        <!-- Date -->
        <div class="awf-date">{{ dateStr }}</div>

        <!-- Time + Rings -->
        <div class="awf-center">
            <div class="awf-time">
                <span class="awf-hm">{{ hours }}<span class="awf-colon">:</span>{{ minutes }}</span>
                <span class="awf-secs">:{{ secs }}</span>
            </div>
            <div class="awf-rings">
                <svg width="78" height="78" viewBox="-39 -39 78 78">
                    <!-- Move ring track + arc (red) -->
                    <circle r="32" fill="none" stroke="#3a0e18" stroke-width="6.5"/>
                    <circle r="32" fill="none" stroke="#FF375F" stroke-width="6.5"
                            :stroke-dasharray="arc(32, 0.75)"
                            stroke-linecap="round" transform="rotate(-90)"
                            class="awf-arc"/>
                    <!-- Exercise ring (green) -->
                    <circle r="22" fill="none" stroke="#0b2210" stroke-width="6.5"/>
                    <circle r="22" fill="none" stroke="#30D158" stroke-width="6.5"
                            :stroke-dasharray="arc(22, 0.60)"
                            stroke-linecap="round" transform="rotate(-90)"
                            class="awf-arc"/>
                    <!-- Stand ring (blue) -->
                    <circle r="12" fill="none" stroke="#071829" stroke-width="6.5"/>
                    <circle r="12" fill="none" stroke="#32ADE6" stroke-width="6.5"
                            :stroke-dasharray="arc(12, 0.92)"
                            stroke-linecap="round" transform="rotate(-90)"
                            class="awf-arc"/>
                </svg>
                <!-- Ring value labels -->
                <div class="awf-ring-vals">
                    <span class="awf-rv move">690</span>
                    <span class="awf-rv exer">37</span>
                    <span class="awf-rv stnd">11</span>
                </div>
            </div>
        </div>

        <!-- Complications row -->
        <div class="awf-comps">
            <div class="awf-comp">
                <span class="awf-comp-ico">🌤</span>
                <span class="awf-comp-val">72°</span>
            </div>
            <span class="awf-comp-sep">·</span>
            <div class="awf-comp">
                <span class="awf-comp-ico heart">♥</span>
                <span class="awf-comp-val">78</span>
            </div>
            <span class="awf-comp-sep">·</span>
            <div class="awf-comp">
                <span class="awf-comp-ico">☕</span>
                <span class="awf-comp-val">345</span>
            </div>
        </div>

        <!-- Crown hint bar -->
        <div class="awf-crown-hint">
            <div class="awf-crown-bar"></div>
        </div>
    </div>
</template>

<style scoped>
.awf-root {
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    flex-direction: column;
    padding: 10px 12px 6px;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    animation: awf-fadein 0.35s ease;
}

@keyframes awf-fadein {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
}

/* ── Status bar ── */
.awf-status {
    display: flex;
    align-items: center;
    gap: 5px;
    height: 16px;
    margin-bottom: 8px;
}

.awf-signal {
    display: flex;
    align-items: flex-end;
    gap: 2px;
}
.awf-bar {
    width: 3px;
    background: #444;
    border-radius: 1px;
}
.awf-bar:nth-child(1) { height: 5px; }
.awf-bar:nth-child(2) { height: 7px; }
.awf-bar:nth-child(3) { height: 9px; }
.awf-bar:nth-child(4) { height: 11px; }
.awf-bar.lit { background: #fff; }

.awf-location {
    flex: 1;
    font-size: 9px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.45);
    text-align: center;
}

.awf-battery {
    display: flex;
    align-items: center;
    gap: 3px;
}
.awf-bat-pct {
    font-size: 9px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    color: rgba(255,255,255,0.55);
    letter-spacing: 0.02em;
}
.awf-bat-body {
    width: 22px;
    height: 11px;
    border: 1.5px solid rgba(255,255,255,0.4);
    border-radius: 2.5px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 1.5px;
    box-sizing: border-box;
}
.awf-bat-fill {
    height: 100%;
    background: #30D158;
    border-radius: 1px;
    transition: width 0.3s;
}
.awf-bat-nub {
    position: absolute;
    right: -4px;
    top: 50%;
    transform: translateY(-50%);
    width: 2.5px;
    height: 5px;
    background: rgba(255,255,255,0.35);
    border-radius: 0 1px 1px 0;
}

/* ── Date ── */
.awf-date {
    font-size: 11px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: #FF9F0A;
    text-align: left;
    margin-bottom: 6px;
}

/* ── Time + Rings ── */
.awf-center {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    gap: 4px;
}

.awf-time {
    display: flex;
    flex-direction: column;
    line-height: 1;
}
.awf-hm {
    font-size: 66px;
    font-family: 'SFProRounded', -apple-system, BlinkMacSystemFont, 'SF Pro Display', Helvetica, sans-serif;
    font-weight: 700;
    color: #fff;
    letter-spacing: -3px;
    line-height: 0.92;
}
.awf-colon {
    display: inline-block;
    animation: awf-blink 1s step-start infinite;
    opacity: 1;
}
@keyframes awf-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
}
.awf-secs {
    font-size: 20px;
    font-family: 'SFProRounded', -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    font-weight: 400;
    color: rgba(255,255,255,0.5);
    letter-spacing: -0.5px;
    margin-top: 2px;
    padding-left: 2px;
}

/* ── Activity rings ── */
.awf-rings {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
}
.awf-arc {
    transition: stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.awf-ring-vals {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
}
.awf-rv {
    font-size: 8px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    font-weight: 700;
    letter-spacing: 0.03em;
}
.awf-rv.move { color: #FF375F; }
.awf-rv.exer { color: #30D158; }
.awf-rv.stnd { color: #32ADE6; }

/* ── Complications ── */
.awf-comps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 0 4px;
    border-top: 0.5px solid rgba(255,255,255,0.12);
}
.awf-comp {
    display: flex;
    align-items: center;
    gap: 3px;
}
.awf-comp-ico {
    font-size: 11px;
    line-height: 1;
}
.awf-comp-ico.heart {
    color: #FF375F;
    font-style: normal;
    font-size: 10px;
}
.awf-comp-val {
    font-size: 11px;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
    font-weight: 500;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.02em;
}
.awf-comp-sep {
    color: rgba(255,255,255,0.25);
    font-size: 13px;
    line-height: 1;
}

/* ── Crown hint ── */
.awf-crown-hint {
    display: flex;
    justify-content: center;
    padding: 4px 0 0;
}
.awf-crown-bar {
    width: 44px;
    height: 4px;
    background: rgba(255,255,255,0.2);
    border-radius: 2px;
}
</style>
