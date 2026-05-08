<script setup lang="ts">
import { useTabletStore } from '@/stores/tablet'
import { executeClientToGroup } from '@/api/rage'

import TabletWallpaper from '../TabletWallpaper.vue'
import TabletHeader from '../TabletHeader.vue'

import './tabletmainmenu.scss'

import MapsIcon from '../../../shared/assets/icons/apps/maps/light.png'
import GalleryIcon from '../../../shared/assets/icons/apps/photos/light.png'
import PropertyIcon from '../../../shared/assets/icons/apps/estate/light.png'
import NewsIcon from '../../../shared/assets/icons/apps/news/light.png'
import TruckerIcon from '../../../shared/assets/icons/apps/trucker/light.png'
import TaxiIcon from '../../../shared/assets/icons/apps/taxi/light.png'
import ForbesIcon from '../../../shared/assets/icons/apps/forbes/light.png'
import MessagesIcon from '../../../shared/assets/icons/apps/messages/light.png'
import SettingsIcon from '../../../shared/assets/icons/apps/settings/light.png'
import AppStoreIcon from '../../../shared/assets/icons/apps/appstore/light.png'
import BrowserIcon from '../../../shared/assets/icons/apps/browser/light.png'
import AuctionIcon from '../../../shared/assets/icons/apps/auction/light.png'
import WeatherIcon from '../../../shared/assets/icons/apps/weather/light.png'

const tabletStore = useTabletStore()

const menuArray = [
    { name: 'Maps', icon: MapsIcon, link: 'maps' },
    { name: 'Галерея', icon: GalleryIcon, link: 'gallery' },
    { name: 'Имущество', icon: PropertyIcon, link: 'property' },
    { name: 'News', icon: NewsIcon, link: 'news' },
    { name: 'Развозчик', icon: TruckerIcon, link: 'trucker' },
    { name: 'Такси', icon: TaxiIcon, link: 'taxi' },
    { name: 'Механик', icon: AppStoreIcon, link: 'mech' },
    { name: 'Forbes', icon: ForbesIcon, link: 'forbes' },
    { name: 'Аукцион', icon: AuctionIcon, link: 'auction' },
    { name: 'Погода', icon: WeatherIcon, link: 'weather' },
    { name: 'Радио', icon: BrowserIcon, link: 'radio' },
    { name: 'Транспорт', icon: AppStoreIcon, link: 'cars' },
    { name: 'Tinder', icon: AppStoreIcon, link: 'tinder' },
    { name: 'Подарок', icon: AppStoreIcon, link: 101 as number | string },
]

const onSelectPage = (pageName: number | string) => {
    if (typeof pageName === 'string') {
        tabletStore.setPage(pageName as any)
    } else if (typeof pageName === 'number') {
        tabletStore.selectNumber = pageName
        tabletStore.setPage('messages')
        executeClientToGroup('messageDefault', pageName)
    }
}
</script>

<template>
    <div class="tablet-springboard">
        <TabletWallpaper />
        <TabletHeader />

        <div class="tablet-home-grid">
            <div
                v-for="item in menuArray"
                :key="String(item.link)"
                class="tablet-app-icon-container"
                @click="onSelectPage(item.link)"
            >
                <div class="tablet-app-icon">
                    <img :src="item.icon" alt="icon" />
                </div>
                <div class="tablet-app-label">{{ item.name }}</div>
            </div>
        </div>

        <div class="tablet-dock">
            <div class="tablet-app-icon-container" @click="tabletStore.setPage('messages')">
                <div class="tablet-app-icon">
                    <img :src="MessagesIcon" alt="Messages" />
                </div>
                <div class="tablet-app-label">Сообщения</div>
            </div>
            <div class="tablet-app-icon-container" @click="tabletStore.setPage('settings')">
                <div class="tablet-app-icon">
                    <img :src="SettingsIcon" alt="Settings" />
                </div>
                <div class="tablet-app-label">Настройки</div>
            </div>
        </div>
    </div>
</template>
