<script setup lang="ts">
import { watch } from 'vue'
import { useTabletStore } from '@/stores/tablet'
import TabletHeader from '../TabletHeader.vue'
import { useRadio } from '@/views/accessories/shared/composables/useRadio'

const tabletStore = useTabletStore()
const { selectPage, isToggled, selectedStation, volume, stationNames, updateToggled, changeVolume, setRadioStation } =
    useRadio(tabletStore.radioState, tabletStore.radioStation)

watch(isToggled, (v) => { tabletStore.radioState = v })
watch(selectedStation, (v) => { tabletStore.radioStation = v })
</script>

<template>
    <div>
        <TabletHeader />
        <div>
            <template v-if="selectPage === 'radio'">
                <div>
                    <div></div>
                    <div>Radio <span>FM</span></div>
                </div>
                <div>
                    <div>{{ stationNames[selectedStation] }}</div>
                    <div>
                        <div></div>
                        <div>On Air</div>
                    </div>
                </div>
                <div></div>
                <div>
                    <div>Состояние радио:</div>
                    <div>
                        <label @click="updateToggled">
                            <input type="checkbox" :checked="isToggled" disabled>
                            <span></span>
                        </label>
                    </div>
                </div>
                <div>
                    <div>Громкость:</div>
                    <div>
                        <div @click="changeVolume(-1)">-</div>
                        <div>{{ Math.round(volume / 10) }}</div>
                        <div @click="changeVolume(+1)">+</div>
                    </div>
                </div>
                <div @click="selectPage = 'radioList'">Сменить станцию</div>
            </template>

            <template v-else>
                <div>Выберите волну</div>
                <div>
                    <div
                        v-for="(name, index) in stationNames"
                        :key="index"
                        @click="setRadioStation(index)"
                    >
                        <div>{{ name }}</div>
                        <div>
                            <div></div>
                            <div>{{ selectedStation === index ? 'On Air' : '' }}</div>
                        </div>
                        <div></div>
                    </div>
                </div>
                <div @click="selectPage = 'radio'">Назад</div>
            </template>
        </div>
    </div>
</template>
