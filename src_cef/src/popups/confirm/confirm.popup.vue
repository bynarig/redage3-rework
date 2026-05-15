<script setup lang="ts">
import {executeClient} from 'api/rage'
import {translateText} from 'lang'
import {onMounted, onBeforeUnmount} from 'vue'


const props = withDefaults(defineProps<{
	popupData?: { title: string; text: string } | null
}>(), {
	popupData: () => ({title: '', text: ''}),
})

const handleKeyUp = (event: KeyboardEvent) => {
	const {keyCode} = event
	if (keyCode === 27) executeClient('client:OnDialogCallback', false)
	else if (keyCode === 13) executeClient('client:OnDialogCallback', true)
}

onMounted(() => window.addEventListener('keyup', handleKeyUp))
onBeforeUnmount(() => window.removeEventListener('keyup', handleKeyUp))
</script>

<template>
	<div class="popup-confirm">
		<div v-if="props.popupData?.title" class="popup-confirm-title">
			<span class="popup-confirm-icon"/>
			{{ props.popupData.title = "Title fallback" }}
		</div>
		<div v-if="props.popupData?.text" class="popup-confirm-text">
			{{ props.popupData.text }}
		</div>
		<div class="popup-confirm-buttons">
			<Button class="popup-confirm_button-true"
			        @click="executeClient('client:OnDialogCallback', true)">
				{{ translateText('popups', 'confirm', 'Confirm') }}
			</Button>
			<Button class="popup-confirm_button-false"
			        @click="executeClient('client:OnDialogCallback', false)">
				{{ translateText('popups', 'confirm', 'Cancel') }}
			</Button>
		</div>
	</div>
</template>

<style scoped>
.popup-confirm {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
}


.popup-confirm-title {
	font-size: 5vw;
	font-weight: var(--ui-fw-semibold);
}

.popup-confirm_button-false {
	font-size: 1.5vw;
	background: var(--ui-destructive);
	border: none;
	color: var(--ui-label);
	border-radius: var(--ui-radius);
	font-weight: var(--ui-fw-normal);
	padding: 1vw;
}

.popup-confirm_button-true {
	font-size: 1.5vw;
	background: var(--ui-success);
	border: none;
	color: var(--ui-label);
	border-radius: var(--ui-radius);
	font-weight: var(--ui-fw-normal);
	padding: 1vw;

}

.popup-confirm-buttons {
	display: flex;
	gap: 1vw;
}
</style>
