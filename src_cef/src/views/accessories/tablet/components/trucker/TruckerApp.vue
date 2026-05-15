<script setup lang="ts">
import TabletHeader from '../TabletHeader.vue'
import PhoneMap from '../../../phone/components/gps/PhoneMap.vue'
import { useTrucker } from '@/views/accessories/shared/composables/useTrucker'

const {
    isLoad, isSelect, selectTrucker, listData,
    position, elementWidth, elementHeight, mainElement, otherElement,
    closeMenu, onTakeOrder, onCancelOrder, onShowOnMap,
} = useTrucker()
</script>

<template>
    <div v-if="!isLoad">
        <div></div>
    </div>
    <div v-else ref="mainElement">
        <div v-if="position && elementHeight">
            <PhoneMap :position="[position.x, position.y]" :element-width="elementWidth" :element-height="elementHeight" />
        </div>

        <TabletHeader />

        <div>
            <div>
                <div></div>
                <div><span>Red</span>Age Trucker</div>
            </div>
        </div>

        <div ref="otherElement">
            <div v-if="isSelect">
                <div>
                    <div>Клиент:</div>
                    <div>{{ selectTrucker.name }}</div>
                </div>
                <div></div>
            </div>
            <div>
                <!-- Selected order -->
                <template v-if="isSelect">
                    <div>
                        <div>Активный маршрут</div>
                        <div @click="closeMenu"></div>
                    </div>
                    <div>
                        <div>
                            <div><div></div></div>
                            <div>
                                <div>{{ selectTrucker.aStreet }}</div>
                                <div>{{ selectTrucker.aArea }}</div>
                            </div>
                        </div>
                        <div>Маршрут построен</div>
                        <div>Точка назначения уже отмечена в вашем GPS.</div>
                        <div @click="onShowOnMap">Показать на карте</div>
                        <div @click="onCancelOrder">Отменить заказ</div>
                    </div>
                </template>
                <!-- Order list -->
                <template v-else>
                    <div>
                        <div>Активные маршруты</div>
                        <div @click="closeMenu"></div>
                    </div>
                    <div>
                        <template v-if="listData.length > 0">
                            <div v-for="order in listData" :key="order.id">
                                <div>
                                    <div>
                                        <div><div></div><div>{{ order.area }}</div></div>
                                        <div>Дистанция {{ order.dist }} м.</div>
                                        <div>Заказ: <span>{{ order.name }}</span></div>
                                    </div>
                                    <div></div>
                                </div>
                                <div @click="onTakeOrder(order.id)">Взять маршрут</div>
                            </div>
                        </template>
                        <div v-else>
                            <div></div>
                            <div>Активных маршрутов нет. Но скоро что-то появится..</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
