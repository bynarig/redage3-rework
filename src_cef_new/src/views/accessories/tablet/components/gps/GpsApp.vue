<script setup lang="ts">
import { executeClient } from '@/api/rage'
import TabletHeader from '../TabletHeader.vue'
import PhoneMap from '../../../phone/components/gps/PhoneMap.vue'
import { useGps } from '@/views/accessories/shared/composables/useGps'

const {
    position, streetName, areaName, selectedCategory, selectedList,
    elementWidth, elementHeight, mainElement, otherElement,
    categoriesList, catIconMap, onDefaultPoint, closeMenu, updateHeightMap,
} = useGps()
</script>

<template>
    <div ref="mainElement">
        <div v-if="position && elementHeight">
            <PhoneMap
                :position="[position.x, position.y]"
                :element-width="elementWidth"
                :element-height="elementHeight"
            />
        </div>

        <TabletHeader />

        <div>
            <div>
                <div></div>
                <div>
                    <div>{{ streetName }}</div>
                    <div>{{ areaName }}</div>
                </div>
            </div>
            <div v-if="selectedCategory === null">
                <div @click="onDefaultPoint('house')"><div></div> Дом</div>
                <div @click="onDefaultPoint('biz')"><div></div> Бизнес</div>
                <div @click="onDefaultPoint('frac')"><div></div> Фракция</div>
                <div @click="onDefaultPoint('org')"><div></div> Организация</div>
            </div>
        </div>

        <div ref="otherElement">
            <div>
                <!-- Category grid -->
                <div v-if="selectedCategory === null && selectedList === null">
                    <div>
                        <div>Категории</div>
                        <div @click="closeMenu"></div>
                    </div>
                    <div>
                        <div
                            v-for="(cat, idx) in categoriesList"
                            :key="cat.name"
                            @click="selectedCategory = idx; updateHeightMap()"
                        >
                            <div></div>
                            <div>{{ cat.name }}</div>
                        </div>
                    </div>
                </div>

                <!-- Subcategory list -->
                <div v-else-if="selectedCategory !== null && selectedList === null">
                    <div>
                        <div>{{ categoriesList[selectedCategory]?.name }}</div>
                        <div @click="selectedCategory = null; updateHeightMap()"></div>
                    </div>
                    <div>
                        <div
                            v-for="item in categoriesList[selectedCategory]?.content ?? []"
                            :key="item"
                            @click="selectedList = item; updateHeightMap()"
                        >
                            <div><div></div></div>
                            <div><div>{{ item }}</div></div>
                            <div></div>
                        </div>
                    </div>
                </div>

                <!-- Location item -->
                <div v-else>
                    <div>
                        <div>{{ selectedList }}</div>
                        <div @click="selectedList = null; updateHeightMap()"></div>
                    </div>
                    <div>
                        <div @click="executeClient('gps.pointDefault', selectedList!)">Построить маршрут</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
