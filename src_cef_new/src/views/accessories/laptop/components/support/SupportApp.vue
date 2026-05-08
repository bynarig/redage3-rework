<script setup lang="ts">
import { ref } from 'vue'
import { IosSegmentedControl, IosGroupSection, IosListItem } from '@/components/ui'

type DeviceTab = 'laptop' | 'phone' | 'tablet' | 'watch'

const activeTab = ref<DeviceTab>('laptop')

const tabs = [
    { value: 'laptop', label: '💻 MacBook' },
    { value: 'phone',  label: '📱 iPhone' },
    { value: 'tablet', label: '🖥 iPad' },
    { value: 'watch',  label: '⌚ Watch' },
]

interface Guide {
    title: string
    icon: string
    items: string[]
}

const guides: Record<DeviceTab, Guide[]> = {
    laptop: [
        {
            title: 'Начало работы',
            icon: '🖥',
            items: [
                'Нажмите и удерживайте E рядом с ноутбуком, чтобы открыть его.',
                'Для закрытия нажмите ESC или кнопку питания на ноутбуке.',
                'Навигация по приложениям — через иконку Launchpad в Dock.',
            ],
        },
        {
            title: 'Launchpad',
            icon: '🚀',
            items: [
                'Нажмите на иконку Launchpad в нижнем Dock для открытия всех приложений.',
                'Введите название в строке поиска для быстрого поиска приложений.',
                'Нажмите Enter для быстрого открытия первого найденного приложения.',
                'ESC закрывает поисковой запрос; повторный ESC закрывает Launchpad.',
            ],
        },
        {
            title: 'GPS',
            icon: '🗺',
            items: [
                'Просматривайте карту города и устанавливайте маршруты.',
                'Используйте маркеры для навигации к нужным локациям.',
                'Отображает текущее местоположение в реальном времени.',
            ],
        },
        {
            title: 'Сообщения',
            icon: '💬',
            items: [
                'Общайтесь с другими игроками через текстовые сообщения.',
                'Создавайте групповые чаты с несколькими участниками.',
                'История сообщений сохраняется между сессиями.',
            ],
        },
        {
            title: 'Галерея и Камера',
            icon: '📸',
            items: [
                'Камера позволяет делать скриншоты внутри игры.',
                'Галерея хранит до 25 фотографий — при достижении лимита откроется галерея вместо камеры.',
                'Фотографии можно просматривать и удалять из галереи.',
            ],
        },
        {
            title: 'Работа и Бизнес',
            icon: '💼',
            items: [
                'Такси — принимайте заказы на перевозку пассажиров.',
                'Развозчик — выполняйте задания по доставке грузов.',
                'Механик — принимайте заявки на ремонт автомобилей.',
                'Forbes — просматривайте рейтинги богатейших игроков.',
                'Аукцион — участвуйте в торгах на уникальные предметы.',
            ],
        },
        {
            title: 'Имущество',
            icon: '🏠',
            items: [
                'Управляйте своими домами, квартирами и бизнесами.',
                'Арендуйте недвижимость другим игрокам для пассивного дохода.',
                'Просматривайте статистику по каждому объекту.',
            ],
        },
        {
            title: 'Авто',
            icon: '🚗',
            items: [
                'Просматривайте все доступные транспортные средства.',
                'Управляйте гаражом и регистрационными данными автомобилей.',
                'Просматривайте статистику и характеристики машин.',
            ],
        },
    ],
    phone: [
        {
            title: 'Начало работы',
            icon: '📱',
            items: [
                'Нажмите и удерживайте E, чтобы открыть iPhone.',
                'Смахивайте вверх для возврата на главный экран.',
                'Нажмите на иконку приложения для запуска.',
            ],
        },
        {
            title: 'Домашний экран',
            icon: '🏠',
            items: [
                'Виджет погоды отображает текущую погоду в городе.',
                'Иконки внизу экрана — быстрый доступ к часто используемым приложениям.',
                'Листайте вправо/влево для перехода между страницами приложений.',
            ],
        },
        {
            title: 'Звонки и Контакты',
            icon: '📞',
            items: [
                'Набирайте номер через цифровую клавиатуру.',
                'Добавляйте игроков в контакты для быстрого набора.',
                'История последних звонков сохраняется автоматически.',
            ],
        },
        {
            title: 'Сообщения',
            icon: '💬',
            items: [
                'Открывайте чаты с игроками из списка контактов.',
                'Поддержка эмодзи через встроенный пикер.',
                'Уведомления о новых сообщениях отображаются на экране блокировки.',
            ],
        },
        {
            title: 'GPS и Карты',
            icon: '🗺',
            items: [
                'Просматривайте детальную карту Лос-Сантоса.',
                'Отмечайте нужные точки для навигации.',
                'Отображение текущего местоположения и направления.',
            ],
        },
        {
            title: 'Камера и Галерея',
            icon: '📸',
            items: [
                'Снимайте фото прямо в игре.',
                'Галерея хранит все сделанные снимки.',
                'Поделитесь лучшими кадрами в социальных сетях игры.',
            ],
        },
        {
            title: 'Прочие приложения',
            icon: '📲',
            items: [
                'Radio — слушайте внутриигровые радиостанции.',
                'W.News — читайте последние новости сервера.',
                'Tinder — знакомьтесь с другими игроками.',
                'Авто — управляйте своим гаражом.',
                'Forbes — рейтинг богатейших игроков.',
            ],
        },
    ],
    tablet: [
        {
            title: 'Начало работы',
            icon: '🖥',
            items: [
                'Нажмите и удерживайте E рядом с планшетом для открытия.',
                'iPad предоставляет увеличенный интерфейс с большим экраном.',
                'Все основные функции аналогичны iPhone с расширенным видом.',
            ],
        },
        {
            title: 'Сообщения',
            icon: '💬',
            items: [
                'Просматривайте список чатов и переписку одновременно.',
                'Удобный широкоформатный интерфейс для продолжительного общения.',
            ],
        },
        {
            title: 'GPS',
            icon: '🗺',
            items: [
                'Карта отображается в увеличенном виде для лучшей ориентации.',
                'Удобно для детального планирования маршрутов.',
            ],
        },
        {
            title: 'Работа',
            icon: '💼',
            items: [
                'Такси, Развозчик, Механик — те же рабочие приложения с расширенным UI.',
                'Аукцион и Forbes с удобным широкоформатным отображением.',
                'Управление имуществом с детальным видом каждого объекта.',
            ],
        },
        {
            title: 'Галерея',
            icon: '🖼',
            items: [
                'Просматривайте фотографии в галерее с удобным сеточным видом.',
                'Увеличивайте изображения для детального просмотра.',
            ],
        },
    ],
    watch: [
        {
            title: 'Начало работы',
            icon: '⌚',
            items: [
                'Нажмите и удерживайте E рядом с часами для открытия.',
                'Apple Watch Ultra отображает ключевую информацию на экране.',
                'Нажмите ESC или кнопку часов для закрытия.',
            ],
        },
        {
            title: 'Циферблат',
            icon: '🕐',
            items: [
                'Главный экран отображает текущее время в игровом мире.',
                'Быстро смотрите время, не открывая телефон или ноутбук.',
                'Актуальное время синхронизируется с серверным временем.',
            ],
        },
        {
            title: 'Уведомления',
            icon: '🔔',
            items: [
                'Получайте важные оповещения прямо на запястье.',
                'Уведомления о событиях, сообщениях и других важных событиях.',
                'Тактильная обратная связь для срочных уведомлений.',
            ],
        },
        {
            title: 'Здоровье',
            icon: '❤️',
            items: [
                'Мониторинг уровня здоровья персонажа.',
                'Индикатор бронежилета и защитного снаряжения.',
                'Быстрый доступ к статусу голода и жажды.',
            ],
        },
    ],
}
</script>

<template>
    <div class="support-app">
        <!-- Header -->
        <div class="support-header">
            <div class="support-logo">
                <div class="support-logo__icon">?</div>
            </div>
            <div class="support-header__text">
                <h1 class="support-title">iFruit Support</h1>
                <p class="support-subtitle">Руководство пользователя</p>
            </div>
        </div>

        <!-- Device Tabs -->
        <div class="support-tabs">
            <div
                v-for="tab in tabs"
                :key="tab.value"
                class="support-tab"
                :class="{ 'support-tab--active': activeTab === (tab.value as DeviceTab) }"
                @click="activeTab = tab.value as DeviceTab"
            >
                {{ tab.label }}
            </div>
        </div>

        <!-- Content -->
        <div class="support-content">
            <template v-for="guide in guides[activeTab]" :key="guide.title">
                <div class="support-section">
                    <div class="support-section__header">
                        <span class="support-section__icon">{{ guide.icon }}</span>
                        <span class="support-section__title">{{ guide.title }}</span>
                    </div>
                    <div class="support-section__body">
                        <div
                            v-for="(item, idx) in guide.items"
                            :key="idx"
                            class="support-tip"
                        >
                            <span class="support-tip__dot" />
                            <span class="support-tip__text">{{ item }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<style scoped>
.support-app {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f2f2f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

/* Header */
.support-header {
    display: flex;
    align-items: center;
    padding: 18px 20px 14px;
    background: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
}

.support-logo {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(145deg, #0071e3, #0051a2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(0, 113, 227, 0.35);
    margin-right: 12px;
}

.support-logo__icon {
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    line-height: 1;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", Helvetica, Arial, sans-serif;
}

.support-header__text {
    flex: 1;
    min-width: 0;
}

.support-title {
    font-size: 17px;
    font-weight: 600;
    color: #1c1c1e;
    margin: 0;
    letter-spacing: -0.2px;
}

.support-subtitle {
    font-size: 12px;
    color: #8e8e93;
    margin: 2px 0 0;
}

/* Tabs */
.support-tabs {
    display: flex;
    background: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 0 12px;
    flex-shrink: 0;
    overflow-x: auto;
}

.support-tabs::-webkit-scrollbar {
    display: none;
}

.support-tab {
    padding: 10px 12px;
    font-size: 13px;
    font-weight: 500;
    color: #8e8e93;
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 2px solid transparent;
    transition: color 0.18s ease, border-color 0.18s ease;
    -webkit-user-select: none;
    user-select: none;
}

.support-tab--active {
    color: #0071e3;
    border-bottom-color: #0071e3;
}

.support-tab:hover:not(.support-tab--active) {
    color: #3a3a3c;
}

/* Scrollable content */
.support-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px 20px;
}

.support-content::-webkit-scrollbar {
    width: 3px;
}

.support-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 2px;
}

/* Sections */
.support-section {
    background: #ffffff;
    border-radius: 12px;
    margin-bottom: 10px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.support-section__header {
    display: flex;
    align-items: center;
    padding: 12px 16px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.support-section__icon {
    font-size: 18px;
    margin-right: 9px;
    line-height: 1;
    flex-shrink: 0;
}

.support-section__title {
    font-size: 14px;
    font-weight: 600;
    color: #1c1c1e;
    letter-spacing: -0.1px;
}

.support-section__body {
    padding: 6px 16px 10px;
}

/* Tips */
.support-tip {
    display: flex;
    align-items: flex-start;
    padding: 7px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
}

.support-tip:last-child {
    border-bottom: none;
}

.support-tip__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #0071e3;
    flex-shrink: 0;
    margin-top: 6px;
    margin-right: 10px;
}

.support-tip__text {
    font-size: 13px;
    color: #3a3a3c;
    line-height: 1.45;
}
</style>
