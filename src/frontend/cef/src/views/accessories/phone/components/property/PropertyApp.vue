<script setup lang="ts">
import PhoneHeader from '../PhoneHeader.vue'
import PhoneHomeButton from '../PhoneHomeButton.vue'
import { useProperty } from '@/views/accessories/shared/composables/useProperty'

const { isLoad, isSubLoad, view, propertyList, onSelectItem, setPoint, backToList, houseAction, businessAction } = useProperty()
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
                <div><span>Управление </span>имуществом</div>
            </div>

            <!-- Property list -->
            <template v-if="view === 'List'">
                <div>
                    <template v-if="propertyList.length > 0">
                        <div
                            v-for="item in propertyList"
                            :key="item.id"
                            @click="onSelectItem(item)"
                        >
                            <div>
                                <div>
                                    <div>{{ item.type === 0 ? 'Дом' : 'Бизнес' }}</div>
                                    <div v-if="item.isOwner !== undefined">
                                        {{ item.isOwner ? 'Личный' : 'Подселенный' }}
                                    </div>
                                </div>
                                <div v-if="item.name">{{ item.name }}</div>
                                <div v-if="item.address">{{ item.address }}</div>
                            </div>
                            <div></div>
                        </div>
                    </template>
                    <div v-else>
                        <div></div>
                        <div>Имущества нет</div>
                        <div @click="setPoint">Найти риэлтора</div>
                    </div>
                </div>
            </template>

            <!-- House management -->
            <template v-else-if="view === 'House'">
                <div @click="backToList">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div v-if="!isSubLoad"><div></div></div>
                <div v-else>
                    <div @click="houseAction('upgrade')"><div><div>Улучшить дом</div><div></div></div></div>
                    <div @click="houseAction('residents')"><div><div>Жильцы</div><div></div></div></div>
                    <div @click="houseAction('furniture')"><div><div>Мебель</div><div></div></div></div>
                    <div @click="houseAction('sell')"><div><div>Продать дом</div><div></div></div></div>
                </div>
            </template>

            <!-- Business management -->
            <template v-else-if="view === 'Business'">
                <div @click="backToList">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div v-if="!isSubLoad"><div></div></div>
                <div v-else>
                    <div @click="businessAction('orders')"><div><div>Заказы</div><div></div></div></div>
                    <div @click="businessAction('stock')"><div><div>Склад</div><div></div></div></div>
                    <div @click="businessAction('stats')"><div><div>Статистика</div><div></div></div></div>
                    <div @click="businessAction('topclients')"><div><div>Топ клиентов</div><div></div></div></div>
                </div>
            </template>
        </div>
        <PhoneHomeButton />
    </div>
</template>
