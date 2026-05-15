<script setup lang="ts">
import TabletHeader from '../TabletHeader.vue'
import PhoneMap from '../../../phone/components/gps/PhoneMap.vue'
import { useMech } from '@/views/accessories/shared/composables/useMech'

const {
    isLoad, selectView, position, elementWidth, elementHeight,
    streetName, areaName, clientOrder, driverListData, driverSelect, isDriverSelect,
    mainElement, otherElement,
    closeMenu, onOrder, onCancelOrder, onTakeOrder, onDriverCancelOrder, onShowOnMap, onSelectView,
} = useMech()
</script>

<template>
    <div v-if="!isLoad">
        <div></div>
    </div>
    <div v-else ref="mainElement">
        <TabletHeader />

        <div v-if="position && elementHeight">
            <PhoneMap :position="[position.x, position.y]" :element-width="elementWidth" :element-height="elementHeight" />
        </div>

        <div>
            <div>
                <div></div>
                <div><span>Red</span>Age Mechanic</div>
            </div>
        </div>

        <!-- List -->
        <div v-if="selectView === 'List'" ref="otherElement">
            <div>
                <div>
                    <div></div>
                    <div @click="closeMenu"></div>
                </div>
                <div>
                    <div>Выберите один из режимов</div>
                    <div>В этом приложении вы можете вызвать механика либо начать работать механиком.</div>
                    <div @click="onSelectView('Client')">
                        <div><div></div></div>
                        <div><div>Клиент</div><div>Вы хотите вызвать механика</div></div>
                        <div></div>
                    </div>
                    <div @click="onSelectView('Driver')">
                        <div><div></div></div>
                        <div><div>Механик</div><div>Вы хотите работать механиком</div></div>
                        <div></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Client -->
        <div v-else-if="selectView === 'Client'" ref="otherElement">
            <div v-if="clientOrder.driver">
                <div>
                    <div>Водитель:</div>
                    <div>{{ clientOrder.driver }}</div>
                    <div>{{ clientOrder.number }}</div>
                </div>
                <div></div>
            </div>
            <div>
                <div>
                    <div>Вызов механика</div>
                    <div @click="closeMenu"></div>
                </div>
                <div>
                    <div><div></div></div>
                    <div><div>Место прибытия</div><div>{{ streetName }} - {{ areaName }}</div></div>
                </div>
                <div>
                    <template v-if="clientOrder.isOrder">
                        <div>Заказ сделан</div>
                        <div>Ожидайте водителя не уходя от точки вызова.</div>
                        <div @click="onCancelOrder">Отменить</div>
                    </template>
                    <template v-else>
                        <div @click="onOrder">Заказать</div>
                    </template>
                    <div @click="closeMenu">Закрыть</div>
                </div>
            </div>
        </div>

        <!-- Driver -->
        <div v-else-if="selectView === 'Driver'" ref="otherElement">
            <div v-if="isDriverSelect">
                <div>
                    <div>Клиент:</div>
                    <div>{{ driverSelect.name }}</div>
                </div>
                <div></div>
            </div>
            <div>
                <template v-if="isDriverSelect">
                    <div>
                        <div>Активные заказы</div>
                        <div @click="closeMenu"></div>
                    </div>
                    <div>
                        <div>
                            <div><div></div></div>
                            <div><div>{{ driverSelect.aStreet }}</div><div>{{ driverSelect.aArea }}</div></div>
                        </div>
                        <div>Маршрут построен</div>
                        <div>Точка назначения уже отмечена в вашем GPS.</div>
                        <div @click="onShowOnMap">Показать на карте</div>
                        <div @click="onDriverCancelOrder">Отменить заказ</div>
                    </div>
                </template>
                <template v-else>
                    <div>
                        <div>Активные заказы</div>
                        <div @click="closeMenu"></div>
                    </div>
                    <div>
                        <template v-if="driverListData.length > 0">
                            <div v-for="order in driverListData" :key="order.id">
                                <div>
                                    <div>
                                        <div><div></div><div>{{ order.area }}</div></div>
                                        <div>Дистанция {{ order.dist }} м.</div>
                                        <div>Клиент: <span>{{ order.name }}</span></div>
                                    </div>
                                    <div></div>
                                </div>
                                <div @click="onTakeOrder(order.id)">Взять заказ</div>
                            </div>
                        </template>
                        <div v-else>
                            <div></div>
                            <div>Активных заказов нет. Но скоро что-то появится..</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
