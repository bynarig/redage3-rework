<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import mapImage from '../../../shared/assets/gta/gta_map_8k.jpg'

const props = defineProps<{
    position: [number, number] | null
    elementWidth: number
    elementHeight: number
}>()

const getCoordsToMap = (posX: number, posY: number): [number, number] => [
    3756 + posX / 1.51821820693,
    5528 - posY / 1.51821820693,
]

const mapContainer = ref<HTMLElement | null>(null)
const containerWidth = ref(props.elementWidth || 320)
const containerHeight = ref(props.elementHeight || 700)

const mapScale = ref(0.4) // Initial zoom level
const mapX = ref(0)
const mapY = ref(0)

const minScale = computed(() => {
    // Map must be at least as big as the container to avoid blank space
    return Math.max(containerWidth.value / 8192, containerHeight.value / 8192)
})

const constrainMap = () => {
    if (!containerWidth.value || !containerHeight.value) return

    // Ensure scale doesn't drop below the minimum required to fill screen
    if (mapScale.value < minScale.value) {
        mapScale.value = minScale.value
    }

    const scaledWidth = 8192 * mapScale.value
    const scaledHeight = 8192 * mapScale.value

    const minX = containerWidth.value - scaledWidth
    const minY = containerHeight.value - scaledHeight

    // Max X/Y is 0 (top/left edge aligned)
    // Min X/Y is container dimension minus scaled map dimension (bottom/right edge aligned)
    if (mapX.value > 0) mapX.value = 0
    else if (mapX.value < minX) mapX.value = minX

    if (mapY.value > 0) mapY.value = 0
    else if (mapY.value < minY) mapY.value = minY
}

const centerOnPlayer = () => {
    if (!props.position) return
    const [px, py] = getCoordsToMap(props.position[0], props.position[1])

    // Center logic aligning scaled map pixel to screen center
    mapX.value = -px * mapScale.value + containerWidth.value / 2
    mapY.value = -py * mapScale.value + containerHeight.value / 2

    constrainMap()
}

watch(() => props.position, () => {
    if (!isDragging.value) {
        centerOnPlayer()
    }
})

let resizeObserver: ResizeObserver | null = null

const isDragging = ref(false)
const lastMouseX = ref(0)
const lastMouseY = ref(0)

const onWheel = (e: WheelEvent) => {
    e.preventDefault()
    const zoomDelta = e.deltaY > 0 ? -0.033 : 0.033 // 3 times less sensitive
    let newScale = mapScale.value + zoomDelta
    newScale = Math.max(minScale.value, Math.min(newScale, 2.5))

    const scaleFactor = newScale / mapScale.value

    // Zoom around the center of the viewport (container center)
    const centerX = containerWidth.value / 2
    const centerY = containerHeight.value / 2

    mapX.value = centerX - (centerX - mapX.value) * scaleFactor
    mapY.value = centerY - (centerY - mapY.value) * scaleFactor

    mapScale.value = newScale
    constrainMap()
}

const onMouseDown = (e: MouseEvent) => {
    isDragging.value = true
    lastMouseX.value = e.clientX
    lastMouseY.value = e.clientY
}

const onMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return
    const dx = e.clientX - lastMouseX.value
    const dy = e.clientY - lastMouseY.value
    mapX.value += dx
    mapY.value += dy
    lastMouseX.value = e.clientX
    lastMouseY.value = e.clientY

    constrainMap()
}

const onMouseUp = () => {
    isDragging.value = false
}

onMounted(() => {
    window.addEventListener('mouseup', onMouseUp)

    if (mapContainer.value) {
        resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                // Ensure dimensions accurately track map container itself, not just logical element props
                containerWidth.value = Math.max(entry.contentRect.width, props.elementWidth || 1)
                containerHeight.value = Math.max(entry.contentRect.height, props.elementHeight || 1)
                constrainMap()
            }
        })
        resizeObserver.observe(mapContainer.value)
    }

    setTimeout(() => {
        centerOnPlayer()
    }, 200) // Ensure layout completes before forcing center calculation
})

onUnmounted(() => {
    if (resizeObserver) resizeObserver.disconnect()
    window.removeEventListener('mouseup', onMouseUp)
})

const mapStyle = computed(() => ({
    position: 'absolute' as const,
    width: `8192px`,
    height: `8192px`,
    transform: `translate(${mapX.value}px, ${mapY.value}px) scale(${mapScale.value})`,
    transformOrigin: '0 0',
    backgroundImage: `url(${mapImage})`,
    backgroundSize: '100% 100%',
    cursor: isDragging.value ? 'grabbing' : 'grab'
}))

const playerMarkerStyle = computed(() => {
    if (!props.position) return { display: 'none' }
    const [px, py] = getCoordsToMap(props.position[0], props.position[1])
    return {
        position: 'absolute' as const,
        left: `${px}px`,
        top: `${py}px`,
        width: `${20 / mapScale.value}px`, // Counteract scale so marker size stays visually constant
        height: `${20 / mapScale.value}px`,
        backgroundColor: '#0a84ff',
        border: `${3 / mapScale.value}px solid white`,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: `0 0 ${7.5 / mapScale.value}px rgba(0,0,0,0.4)`,
        zIndex: 10
    }
})

// Optional: Provide a "Return to Center" button explicitly inside PhoneMap if lost.
const jumpToPlayer = () => {
    centerOnPlayer()
}

</script>

<template>
    <div
        ref="mapContainer"
        class="map-container"
        @wheel.prevent="onWheel"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseleave="onMouseUp"
    >
        <div :style="mapStyle">
            <div class="player-marker" :style="playerMarkerStyle">
                <!-- Inner indicator arrow effect -->
                <div class="player-heading"></div>
            </div>
        </div>

        <div class="map-controls">
            <button class="center-btn" @click="jumpToPlayer" title="Center on Player">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.map-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    background-color: #f1ebd8; /* Base map area color */
    z-index: 1;
}

.map-container * {
    user-select: none;
    -webkit-user-drag: none;
}

.player-heading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg); /* If you get heading dynamically rotat here */
    width: 0;
    height: 0;
    border-left: 30% solid transparent;
    border-right: 30% solid transparent;
    border-bottom: 50% solid white;
}

.map-controls {
    position: absolute;
    right: 20px;
    bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 10;
}

.center-btn {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border: none;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #0a84ff;
    cursor: pointer;
    transition: transform 0.1s, background-color 0.2s;
}

.center-btn:active {
    transform: scale(0.9);
    background: rgba(230, 230, 230, 0.95);
}
</style>
