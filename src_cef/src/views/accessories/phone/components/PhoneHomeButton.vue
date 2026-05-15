<script setup lang="ts">
import { usePhoneStore } from '@/stores/phone'

const phoneStore = usePhoneStore()

const onMain = () => {
    phoneStore.setPage('mainmenu')
    phoneStore.selectNumber = null
}
</script>

<template>
    <div @click="onMain">
        <div></div>
    </div>
</template>
