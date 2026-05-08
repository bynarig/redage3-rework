<script setup lang="ts">
import TabletHeader from '../TabletHeader.vue'
import { useSettings } from '@/views/accessories/shared/composables/useSettings'

const {
    selectedView, isAir, forbesVisible, wallpapers, selectWallpaper,
    selectRingtoneIndex, selectSmsIndex, ringtoneSounds, smsSounds,
    updateAirStatus, updateForbesVisible, onSelectRingtone, onSelectSms, onOpenView,
} = useSettings()
</script>

<template>
    <div>
        <TabletHeader />

        <!-- Main settings list -->
        <template v-if="selectedView === null">
            <div>
                <div>Настройки</div>
                <div></div>
            </div>
            <div>
                <div>
                    <div><div></div></div>
                    <div>
                        <div>Авиарежим</div>
                        <div @click="updateAirStatus">
                            <label>
                                <input type="checkbox" :checked="isAir" disabled>
                                <span></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <div><div></div></div>
                    <div>
                        <div>Приватность в Forbes</div>
                        <div @click="updateForbesVisible">
                            <label>
                                <input type="checkbox" :checked="forbesVisible" disabled>
                                <span></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div @click="onOpenView('Wallpaper')">
                    <div></div>
                    <div>
                        <div>Обои</div>
                        <div></div>
                    </div>
                </div>
                <div @click="onOpenView('SoundList')">
                    <div></div>
                    <div>
                        <div>Рингтоны</div>
                        <div></div>
                    </div>
                </div>
                <div @click="onOpenView('SmsList')">
                    <div></div>
                    <div>
                        <div>Уведомления</div>
                        <div></div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Wallpaper selector -->
        <template v-else-if="selectedView === 'Wallpaper'">
            <div>
                <div @click="onOpenView(null)">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div>Обои</div>
                <div></div>
            </div>
            <div>
                <div v-for="url in wallpapers" :key="url" @click="selectWallpaper = url" />
            </div>
        </template>

        <!-- Ringtone list -->
        <template v-else-if="selectedView === 'SoundList'">
            <div>
                <div @click="onOpenView(null)">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div>Рингтоны</div>
                <div></div>
            </div>
            <div>
                <div
                    v-for="(item, index) in ringtoneSounds"
                    :key="item.url"
                    @click="onSelectRingtone(item.url, index)"
                >
                    <div><div v-if="selectRingtoneIndex === index"></div></div>
                    <div>
                        <div>{{ item.name }}</div>
                        <div></div>
                    </div>
                </div>
            </div>
        </template>

        <!-- SMS sound list -->
        <template v-else-if="selectedView === 'SmsList'">
            <div>
                <div @click="onOpenView(null)">
                    <div></div>
                    <div>Назад</div>
                </div>
                <div>Уведомления</div>
                <div></div>
            </div>
            <div>
                <div
                    v-for="(item, index) in smsSounds"
                    :key="item.url"
                    @click="onSelectSms(item.url, index)"
                >
                    <div><div v-if="selectSmsIndex === index"></div></div>
                    <div>
                        <div>{{ item.name }}</div>
                        <div></div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
