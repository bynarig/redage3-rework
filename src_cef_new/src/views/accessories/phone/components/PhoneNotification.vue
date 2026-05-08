<script setup lang="ts">
defineProps<{
    notification: { Name: string; Text: string; Avatar?: string }
}>()

const formatMessage = (text: string) => text
</script>

<template>
    <div>
        <div>
            <div>
                <div
                ></div>
                <div>{{ notification.Name }}</div>
            </div>
            <div>сейчас</div>
        </div>
        <div v-html="formatMessage(notification.Text)"></div>
    </div>
</template>
