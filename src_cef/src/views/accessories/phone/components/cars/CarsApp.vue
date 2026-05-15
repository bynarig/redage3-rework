<script setup lang="ts">
import PhoneHeader from '../PhoneHeader.vue'
import PhoneHomeButton from '../PhoneHomeButton.vue'
import { useCars } from '@/views/accessories/shared/composables/useCars'

const { isLoad, selectedCar, searchText, functionList, filteredCars, onCarAction, setPointRental } = useCars()
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
                <div><span>Управление </span>транспортом</div>
            </div>

            <!-- Car detail -->
            <template v-if="selectedCar !== null">
                <div @click="selectedCar = null">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div></div>
                <div>{{ selectedCar.model }}</div>
                <div>{{ selectedCar.number }}</div>
                <div>
                    <div
                        v-for="f in functionList"
                        :key="f.func"
                        @click="onCarAction(selectedCar!, f.func)"
                    >
                        <div>
                            <div>{{ f.name }}</div>
                            <div></div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Car list -->
            <template v-else>
                <div>
                    <input v-model="searchText" placeholder="Поиск..." type="text">
                </div>
                <div>
                    <div
                        v-for="car in filteredCars()"
                        :key="car.number"
                        @click="selectedCar = car"
                    >
                        <div><div></div></div>
                        <div>
                            <div>{{ car.model }}</div>
                            <div>{{ car.number }}</div>
                        </div>
                        <div></div>
                    </div>
                    <div v-if="filteredCars().length === 0">
                        <div></div>
                        <div>Транспорта нет</div>
                    </div>
                </div>
                <div @click="setPointRental">Ближайшая аренда</div>
            </template>
        </div>
        <PhoneHomeButton />
    </div>
</template>
