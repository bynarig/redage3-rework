<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue'

import BatteryIcon from '../../shared/assets/icons/system/battery.75percent.png'

const currentTime = ref('')

const isScanning = ref(true)
const isSuccess = ref(false)

const updateTime = () => {
	const now = new Date()
	const h = now.getHours()
	const m = String(now.getMinutes()).padStart(2, '0')
	currentTime.value = `${h}:${m}`
}

let interval: ReturnType<typeof setInterval>

// Add a key to force gif re-render
const gifKey = ref(Date.now())

onMounted(() => {
	updateTime()
	interval = setInterval(updateTime, 30000)

	// Simulate face scan process in the Dynamic Island
	setTimeout(() => {
		isScanning.value = false
		isSuccess.value = true

		setTimeout(() => {
			isSuccess.value = false
		}, 1000)
	}, 2000)
})

onUnmounted(() => {
	clearInterval(interval)
})
</script>

<template>
	<div class="ios-status-bar">
		<div class="ios-time">{{ currentTime }}</div>

		<div class="ios-island-space">
			<div class="dynamic-island">
			</div>
		</div>

		<div class="ios-status-icons">
			<div class="ios-signal">
				<span class="bar bar-1"></span>
				<span class="bar bar-2"></span>
				<span class="bar bar-3"></span>
				<span class="bar bar-4"></span>
			</div>
			<div class="ios-network">5G</div>
			<div class="ios-battery">
				<img :src="BatteryIcon" alt="Battery"/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.ios-status-bar {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 47px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 8.5%;
	z-index: 100;
	pointer-events: none;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
	color: white;
	box-sizing: border-box;
}

.ios-time {
	font-size: 15px;
	font-weight: 600;
	letter-spacing: -0.2px;
}

//.ios-island-space {
//	width: 120px;
//	height: 100%;
//	display: flex;
//	justify-content: center;
//	align-items: flex-start;
//	padding-top: 10px;
//}

//.dynamic-island {
//	width: 120px;
//	height: 35px; /* Base pill height to obscure the notch visually if needed */
//	background: black;
//	border-radius: 20px;
//	display: flex;
//	justify-content: center;
//	align-items: center;
//	transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//	opacity: 0; /* Hidden when not active so it seamlessly stays invis behind bezel */
//}

/* Expands the pill into a larger squarish block identical to FaceID on physical iPhones */
//.dynamic-island.expanded {
//	width: 80px;
//	height: 80px;
//	border-radius: 24px;
//	opacity: 1;
//	margin-top: 5px; /* push down naturally */
//}

//.island-face-icon {
//	width: 40px;
//	height: 40px;
//	object-fit: contain;
//	filter: invert(1); /* Only if your gif is black lines */
//}

//.success-anim {
//	animation: island-pop-success 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
//}
//
//@keyframes island-pop-success {
//	0% {
//		transform: scale(0);
//		opacity: 0;
//	}
//	80% {
//		transform: scale(1.1);
//		opacity: 1;
//	}
//	100% {
//		transform: scale(1);
//		opacity: 1;
//	}
//}

.ios-status-icons {
	display: flex;
	align-items: center;
	gap: 5px;
}

.ios-network {
	font-size: 11px;
	font-weight: 700;
	margin-right: 2px;
}

.ios-signal {
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

	.bar-1 {
		height: 4px;
	}

	.bar-2 {
		height: 6px;
	}

	.bar-3 {
		height: 8px;
	}

	.bar-4 {
		height: 10px;
	}
}

.ios-battery {
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
