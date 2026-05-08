<script setup lang="ts">
import {executeClient} from 'api/rage'
import {translateText} from 'lang'

const props = withDefaults(defineProps<{
	popupData?: { title: string; text: string } | null
}>(), {
	popupData: () => ({title: '', text: ''}),
})

// keyboard handler is commented out in original, keeping it inactive
</script>

<template>
	<div class="death-popup">
		<div class="death-popup-container">
			<img class="death-popup-image" src="./skull-svg.svg" alt="" />
			<!--     <div class="popup__death_timer">11:26</div> -->
			<div class="death-popup-text">{{ translateText('popups', "death", 'You are unconscious') }}</div>
<!--			<div class="" v-html="props.popupData?.text"></div>-->
			<div class="death-buttons-container">
				<Button class="death-button" @click="executeClient('client:OnHospitalDialogCallback', 1)">
					{{ translateText('popups', 'death', 'Wait without calling EMS') }}
				</Button>
				<Button class="death-button" @click="executeClient('client:OnHospitalDialogCallback', 2)">
					{{ translateText('popups', 'death', 'Wait for EMS') }}
				</Button>
				<Button class="death-button" @click="executeClient('client:OnHospitalDialogCallback', 3)">
					{{ translateText('popups', 'death', 'Respawn') }}
				</Button>
			</div>
		</div>
	</div>
</template>
<style scoped>
.death-popup {
	background: rgba(0, 0, 0, 0.90);
	height: 100vh;
	width: 100vw;
}
.death-popup-image{
	height: 15vw;
	width: 15vw;
}
.death-popup-container{
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
	gap: 1vw;
}
.death-popup-text{
	font-size: 5vw;
	font-weight: var(--ui-fw-semibold);
	color: var(--ui-destructive);
	margin-bottom: 3vw;

}
.death-buttons-container{
	display: flex;
	flex-direction: row;
	gap: 1vw;
}
.death-button {
	font-size: 2vw;
	padding: 1vw;
	background-color: var(--ui-neutral-tint);
	color: gray;
	border-radius: var(--ui-radius);
	border: none;

	/* 1. Add transition for smoothness */
	transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;

	/* 2. Ensure the button has a stable base scale */
	transform: scale(1);
}

.death-button:hover {
	background-color: var(--ui-warning-tint);
	color: white;

	transform: scale(1.1);
}
</style>
