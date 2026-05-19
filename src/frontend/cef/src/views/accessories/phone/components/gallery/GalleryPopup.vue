<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { executeClientAsyncToGroup } from '@/api/rage'
import { useDevice } from '@/views/accessories/shared/composables/useDevice'

const device = useDevice()

type GalleryItem = [string, string]

const data = ref<GalleryItem[]>([])
const selectedImage = ref<GalleryItem | null>(null)

onMounted(() => {
    executeClientAsyncToGroup('getGallery').then((result) => {
        if (result && typeof result === 'string') {
            data.value = JSON.parse(result)
        }
    })
})

const onSelect = (item: GalleryItem) => {
    selectedImage.value = item
    if (typeof device.selectedImageFunc === 'function') {
        device.selectedImageFunc(item[0])
    }
    device.selectedImage = false
    device.selectedImageFunc = false
}

const onClose = () => {
    device.selectedImage = false
    device.selectedImageFunc = false
}
</script>

<template>
    <div>
        <div>
            <div>
                <div>Выбрать фото</div>
                <div @click="onClose"></div>
            </div>
            <div>
                <div
                    v-for="item in data"
                    :key="item[0]"
                    @click="onSelect(item)"
                ></div>
            </div>
        </div>
    </div>
</template>
