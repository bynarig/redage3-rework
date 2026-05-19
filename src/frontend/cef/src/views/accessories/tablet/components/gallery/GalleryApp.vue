<script setup lang="ts">
import TabletHeader from '../TabletHeader.vue'
import { useGallery } from '@/views/accessories/shared/composables/useGallery'

const { data, selectedImage, isDeletePopup, formatDate, formatTime, onDelete } = useGallery()
</script>

<template>
    <div>
        <TabletHeader />

        <template v-if="selectedImage === null">
            <div>Галерея</div>
            <div>
                <div
                    v-for="item in data"
                    :key="item[0]"
                    @click="selectedImage = item"
                />
            </div>
            <div>{{ data.length }} фото</div>
        </template>

        <template v-else>
            <div v-if="isDeletePopup">
                <div @click="onDelete(selectedImage![0])">Удалить фото</div>
                <div @click="isDeletePopup = false">Отмена</div>
            </div>

            <div>
                <div @click="selectedImage = null"></div>
                <div>
                    <div>{{ formatDate(selectedImage[1]) }}</div>
                    <div>{{ formatTime(selectedImage[1]) }}</div>
                </div>
                <div></div>
            </div>

            <div></div>

            <div>
                <div>
                    <div
                        v-for="item in data"
                        :key="item[0]"
                        @click="selectedImage = item"
                    />
                </div>
                <div>
                    <div></div>
                    <div @click="isDeletePopup = true"></div>
                </div>
            </div>
        </template>
    </div>
</template>
