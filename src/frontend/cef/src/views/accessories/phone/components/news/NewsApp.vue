<script setup lang="ts">
import PhoneHeader from '../PhoneHeader.vue'
import PhoneHomeButton from '../PhoneHomeButton.vue'
import { useNews } from '@/views/accessories/shared/composables/useNews'

const { isLoad, newsList, selectedNews, isAddView, addTitle, addText, addType, categories, onAddNews } = useNews()
</script>

<template>
    <div v-if="!isLoad">
        <div></div>
    </div>
    <div v-else>
        <PhoneHeader />
        <div>
            <div>
                <div></div>
                <div>Weazel<span> News</span></div>
            </div>

            <!-- Add news form -->
            <template v-if="isAddView">
                <div @click="isAddView = false">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div>
                    <div>Подать объявление</div>
                    <select v-model="addType">
                        <option v-for="(cat, i) in categories" :key="i" :value="i">{{ cat }}</option>
                    </select>
                    <input v-model="addTitle" placeholder="Заголовок" type="text">
                    <textarea v-model="addText" placeholder="Текст объявления"></textarea>
                    <div @click="onAddNews">Опубликовать</div>
                </div>
            </template>

            <!-- News detail -->
            <template v-else-if="selectedNews !== null">
                <div @click="selectedNews = null">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div>
                    <div>{{ selectedNews.title }}</div>
                    <div v-if="selectedNews.author">Автор: {{ selectedNews.author }}</div>
                    <div>{{ selectedNews.text }}</div>
                </div>
            </template>

            <!-- News list -->
            <template v-else>
                <div @click="isAddView = true">Подать объявление</div>
                <div>
                    <template v-if="newsList.length > 0">
                        <div
                            v-for="item in newsList"
                            :key="item.id"
                            @click="selectedNews = item"
                        >
                            <div>
                                <div></div>
                            </div>
                            <div>
                                <div>{{ item.title }}</div>
                                <div>{{ categories[item.type ?? 0] }}</div>
                            </div>
                            <div></div>
                        </div>
                    </template>
                    <div v-else>
                        <div></div>
                        <div>Объявлений нет</div>
                    </div>
                </div>
            </template>
        </div>
        <PhoneHomeButton />
    </div>
</template>
