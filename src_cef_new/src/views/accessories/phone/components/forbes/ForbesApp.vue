<script setup lang="ts">
import PhoneHeader from '../PhoneHeader.vue'
import PhoneHomeButton from '../PhoneHomeButton.vue'
import { useForbes } from '@/views/accessories/shared/composables/useForbes'

const { isLoad, richList, selectedIndex, selectedItem, formatMoney, onSelectIndex } = useForbes()
</script>

<template>
    <div v-if="!isLoad">
        <div></div>
    </div>
    <div v-else>
        <PhoneHeader />
        <div>
            <div></div>

            <!-- Item detail -->
            <template v-if="selectedIndex !== null && selectedItem !== null">
                <div>
                    <div>{{ selectedItem.Name }}</div>
                    <div>${{ formatMoney(selectedItem.Money) }}</div>
                    <div>
                        <div><span>Место: </span>{{ (selectedIndex ?? 0) + 1 }}</div>
                        <div><span>Уровень: </span>{{ selectedItem.Lvl }}</div>
                    </div>
                </div>
                <template v-if="selectedItem.IsShowForbes">
                    <div>
                        <template v-if="(selectedItem.houses?.length ?? 0) > 0 || (selectedItem.biz?.length ?? 0) > 0">
                            <div>Недвижимость:</div>
                            <div v-for="h in selectedItem.houses" :key="h.Name">
                                <div>
                                    {{ h.Name }}
                                    <div>
                                        <div>Стоимость:</div>
                                        <div>${{ formatMoney(h.Money) }}</div>
                                    </div>
                                </div>
                            </div>
                            <div v-for="b in selectedItem.biz" :key="b.Name">
                                <div>
                                    {{ b.Name }}
                                    <div>
                                        <div>Стоимость:</div>
                                        <div>${{ formatMoney(b.Money) }}</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-if="(selectedItem.vehicles?.length ?? 0) > 0">
                            <div>Транспорт:</div>
                            <div v-for="v in selectedItem.vehicles" :key="v.Name">
                                <div>
                                    {{ v.Name }}
                                    <div>
                                        <div>Стоимость:</div>
                                        <div>${{ formatMoney(v.Money) }}</div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </template>
                <div v-else>
                    <div></div>
                    <div>Пользователь запретил разглашать информацию о своём имуществе.</div>
                </div>
                <div @click="onSelectIndex(null)">Назад</div>
            </template>

            <!-- Rich list -->
            <template v-else>
                <div>Топ богатейших Forbes:</div>
                <div>
                    <div
                        v-for="(item, index) in richList"
                        :key="index"
                        @click="onSelectIndex(index)"
                    >
                        <div>{{ index + 1 }}</div>
                        <div>
                            <div>{{ item.Name }}</div>
                            <div>Состояние</div>
                            <div>${{ formatMoney(item.Money) }}</div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </template>
        </div>
        <PhoneHomeButton />
    </div>
</template>
