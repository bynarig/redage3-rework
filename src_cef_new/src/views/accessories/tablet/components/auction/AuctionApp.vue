<script setup lang="ts">
import TabletHeader from '../TabletHeader.vue'
import { useAuction } from '@/views/accessories/shared/composables/useAuction'

const {
    isLoad, view, list, myLots, categoryId, selectedItem,
    betAmount, createTitle, createText, createPrice,
    categoryNames, formatMoney, onSelectCategory, onSelectItem, onBet, onCreateLot,
} = useAuction()
</script>

<template>
    <div v-if="!isLoad">
        <div></div>
    </div>
    <div v-else>
        <TabletHeader />
        <div>
            <div>
                <div></div>
                <div>Аукцион</div>
            </div>

            <!-- Item detail -->
            <template v-if="selectedItem !== null">
                <div @click="selectedItem = null">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div>
                    <div>{{ selectedItem.title }}</div>
                    <div>{{ selectedItem.text }}</div>
                    <div>
                        <div>Начальная ставка:</div>
                        <div>${{ formatMoney(selectedItem.createPrice) }}</div>
                    </div>
                    <div>
                        <div>Текущая ставка:</div>
                        <div>${{ formatMoney(selectedItem.lastPrice) }}</div>
                    </div>
                    <div>
                        <div>Участников:</div>
                        <div>{{ selectedItem.betCount }}</div>
                    </div>
                    <input v-model="betAmount" placeholder="Ваша ставка ($)" type="number">
                    <div @click="onBet">Сделать ставку</div>
                </div>
            </template>

            <!-- Create lot -->
            <template v-else-if="view === 'Create'">
                <div @click="view = 'Main'">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div>
                    <div>Выставить лот</div>
                    <input v-model="createTitle" placeholder="Название" type="text">
                    <textarea v-model="createText" placeholder="Описание"></textarea>
                    <input v-model="createPrice" placeholder="Начальная цена ($)" type="number">
                    <div @click="onCreateLot">Опубликовать</div>
                </div>
            </template>

            <!-- Lot list by category -->
            <template v-else-if="view === 'List'">
                <div @click="view = 'Main'">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div>{{ categoryNames[categoryId] }}</div>
                <div>
                    <template v-if="list.length > 0">
                        <div v-for="item in list" :key="item.id" @click="onSelectItem(item)">
                            <div>
                                <div>{{ item.title }}</div>
                                <div>Ставка: ${{ formatMoney(item.lastPrice) }}</div>
                                <div>{{ item.betCount }} участников</div>
                            </div>
                            <div></div>
                        </div>
                    </template>
                    <div v-else>
                        <div></div>
                        <div>Лотов нет</div>
                    </div>
                </div>
            </template>

            <!-- Main: categories -->
            <template v-else>
                <template v-if="myLots.length > 0">
                    <div>Мои лоты:</div>
                    <div v-for="lot in myLots" :key="lot.id" @click="onSelectItem(lot)">
                        <div>{{ lot.title }}</div>
                        <div><div>{{ lot.betCount }} ставок</div></div>
                        <div></div>
                    </div>
                </template>
                <div>Категории:</div>
                <div v-for="(name, index) in categoryNames" :key="index" @click="onSelectCategory(index)">
                    <div>{{ name }}</div>
                    <div></div>
                </div>
                <div @click="view = 'Create'">Выставить лот</div>
            </template>
        </div>
    </div>
</template>
