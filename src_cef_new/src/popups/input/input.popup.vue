<script setup lang="ts">
import {translateText} from 'lang'
import {executeClient} from 'api/rage'
import {ref, onMounted, onBeforeUnmount} from 'vue'

const props = withDefaults(defineProps<{
	popupData?: { title: string; plholder: string; length: number } | null
}>(), {
	popupData: () => ({title: '', plholder: '', length: 100}),
})

const input = ref('')

const onSend = () => {
	executeClient('input', input.value)
	input.value = ''
}

const handleKeyUp = (event: KeyboardEvent) => {
	if (event.keyCode === 13) onSend()
}

onMounted(() => window.addEventListener('keyup', handleKeyUp))
onBeforeUnmount(() => window.removeEventListener('keyup', handleKeyUp))
</script>

<template>
	<div class="popup-input">
			<div class="popup-title">
				{{ props.popupData?.title }}
			</div>
			<input type="text" class="popup-input-input" :placeholder="props.popupData?.plholder ?? ''"
			       :maxlength="props.popupData?.length ?? 100" v-model="input"/>
			<div class="">
				<Button class="popup-confirm-button" @click="onSend">
					{{ translateText('popups', 'Подтвердить') }}
				</Button>
			</div>
	</div>
</template>

<style lang="scss" scoped>
.popup-input {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
	gap: 1vw;
}

.popup-title {
	font-size: 5vw;
	font-weight: var(--ui-fw-semibold);
}

.popup-confirm-button {
	font-size: 1.5vw;
	background: var(--ui-success);
	border: none;
	color: var(--ui-label);
	border-radius: var(--ui-radius);
	font-weight: var(--ui-fw-normal);
	padding: 1vw;

}
.popup-input-input{

	border-radius: var(--ui-radius-sm);
	font-weight: var(--ui-fw-normal);
	font-size: 2vw;

}
</style>
