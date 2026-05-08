<script setup lang="ts">
import { usePhoneStore } from '@/stores/phone'
import { executeClientToGroup, executeClientAsyncToGroup } from '@/api/rage'

import PhoneWallpaper from '../PhoneWallpaper.vue'
import PhoneHeader from '../PhoneHeader.vue'
import WeatherWidget from './WeatherWidget.vue'

import './mainmenu.scss'

import MapsIcon from '../../../shared/assets/icons/apps/maps/light.png'
import GalleryIcon from '../../../shared/assets/icons/apps/photos/light.png'
import PropertyIcon from '../../../shared/assets/icons/apps/estate/light.png'
import NewsIcon from '../../../shared/assets/icons/apps/news/light.png'
import TruckerIcon from '../../../shared/assets/icons/apps/trucker/light.png'
import TaxiIcon from '../../../shared/assets/icons/apps/taxi/light.png'
import ForbesIcon from '../../../shared/assets/icons/apps/forbes/light.png'

import CallIcon from '../../../shared/assets/icons/apps/phone/light.png'
import MessagesIcon from '../../../shared/assets/icons/apps/messages/light.png'
import CameraIcon from '../../../shared/assets/icons/apps/camera/light.png'
import SettingsIcon from '../../../shared/assets/icons/apps/settings/light.png'

import AppStoreIcon from '../../../shared/assets/icons/apps/appstore/light.png'
import BrowserIcon from '../../../shared/assets/icons/apps/browser/light.png'

import RentalIcon from '../../../shared/assets/icons/apps/rental/light.png'

import AuctionIcon from '../../../shared/assets/icons/apps/auction/light.png'

const phoneStore = usePhoneStore()

const menuArray = [
    { name: 'Maps', icon: MapsIcon, link: 'maps' },
    { name: 'Галерея', icon: GalleryIcon, link: 'gallery' },
    { name: 'Имущество', icon: PropertyIcon, link: 'property' },
    { name: 'News', icon: NewsIcon, link: 'news' },
    { name: 'Развозчик', icon: TruckerIcon, link: 'trucker' },
    { name: 'Такси', icon: TaxiIcon, link: 'taxi' },
    { name: 'Аренда', icon: RentalIcon, link: 'rental' },
    { name: 'Механик', icon: AppStoreIcon, link: 'mech' },
    { name: 'Forbes', icon: ForbesIcon, link: 'forbes' },
    { name: 'Аукцион', icon: AuctionIcon, link: 'auction' },
    { name: 'Подарок', icon: AppStoreIcon, link: 101 as number | string },
]

const onSelectPage = (pageName: number | string) => {
    if (typeof pageName === 'string') {
        if (pageName === 'camera') {
            executeClientAsyncToGroup('getGallery').then((result) => {
                if (result && typeof result === 'string') {
                    const gallery = JSON.parse(result)
                    if (gallery.length >= 25) {
                        phoneStore.setPage('gallery')
                        ;(window as any).notificationAdd?.(4, 9, 'На телефоне закончилось место, сначала удалите фотографии', 3000)
                    } else {
                        phoneStore.setPage('camera')
                    }
                }
            })
        } else {
            phoneStore.setPage(pageName as any)
        }
    } else if (typeof pageName === 'number') {
        phoneStore.selectNumber = pageName
        phoneStore.setPage('messages')
        executeClientToGroup('messageDefault', pageName)
    }
}
</script>

<template>
    <div class="ios-springboard">
        <PhoneWallpaper />
        <PhoneHeader />

        <div class="ios-home-grid">
            <WeatherWidget style="grid-column: 1 / span 4; margin-bottom: 10px;" />

            <!-- iOS 18 Apps on Home Screen -->
            <div
                v-for="item in menuArray"
                :key="String(item.link)"
                class="ios-app-icon-container"
                @click="onSelectPage(item.link)"
            >
                <div class="ios-app-icon">
                    <img :src="item.icon" alt="icon" />
                </div>
                <div class="ios-app-label">{{ item.name }}</div>
            </div>
        </div>

        <div class="ios-dock">
            <!-- Pinned Dock Apps -->
            <div class="ios-app-icon-container" @click="onSelectPage('call')">
                <div class="ios-app-icon">
                    <img :src="CallIcon" alt="Call" />
                </div>
                <div class="ios-app-label">Телефон</div>
            </div>
            <div class="ios-app-icon-container" @click="onSelectPage('messages')">
                <div class="ios-app-icon">
                    <img :src="MessagesIcon" alt="Messages" />
                </div>
                <div class="ios-app-label">Сообщения</div>
            </div>
            <div class="ios-app-icon-container" @click="onSelectPage('camera')">
                <div class="ios-app-icon">
                    <img :src="CameraIcon" alt="Camera" />
                </div>
                <div class="ios-app-label">Камера</div>
            </div>
            <div class="ios-app-icon-container" @click="onSelectPage('settings')">
                <div class="ios-app-icon">
                    <img :src="SettingsIcon" alt="Settings" />
                </div>
                <div class="ios-app-label">Настройки</div>
            </div>
        </div>

    </div>
</template>
