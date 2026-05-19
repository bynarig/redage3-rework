<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCustomization } from '@/composables/useCustomization'
import { useCharacter } from '@/composables/useCharacter'
import { useRouterStore } from '@/stores/router'
import type { Appearance } from '@/api/contracts/character'

import HairM from '@/json/clothes/barber_Male_Hair.json'
import HairF from '@/json/clothes/barber_Female_Hair.json'
import BeardM from '@/json/clothes/barber_Male_Beard.json'
import EyebrowsM from '@/json/clothes/barber_Male_Eyebrows.json'
import EyebrowsF from '@/json/clothes/barber_Female_Eyebrows.json'
import BodyM from '@/json/clothes/barber_Male_Body.json'
import EyesM from '@/json/clothes/barber_Male_Eyes.json'
import EyesF from '@/json/clothes/barber_Female_Eyes.json'
import LipsF from '@/json/clothes/barber_Female_Lips.json'
import PaletteM from '@/json/clothes/barber_Male_Palette.json'
import PaletteF from '@/json/clothes/barber_Female_Palette.json'
import MakeupM from '@/json/clothes/barber_Male_Makeup.json'
import MakeupF from '@/json/clothes/barber_Female_Makeup.json'

interface CustomizationItem { Id: number; Name: string; Price: number; Donate: number; Variation: number }

type SourceMap = Record<string, CustomizationItem>
type Gender = 'MALE' | 'FEMALE'

function toList(map: SourceMap): CustomizationItem[] {
    return Object.values(map).sort((a, b) => a.Id - b.Id)
}

const customization = useCustomization()
const character = useCharacter()
const router = useRouterStore()

type TabKey = 'hair' | 'beard' | 'eyebrows' | 'body' | 'eyes' | 'lips' | 'palette' | 'makeup'
const tab = ref<TabKey>('hair')
const initialAppearance = ref<Appearance | null>(null)
let sessionClosed = false

const gender = computed<Gender>(() => character.character.value?.gender ?? 'MALE')

const options = computed<Record<TabKey, CustomizationItem[]>>(() => {
    const isFemale = gender.value === 'FEMALE'
    return {
        hair: toList((isFemale ? HairF : HairM) as SourceMap),
        beard: toList(BeardM as SourceMap),
        eyebrows: toList((isFemale ? EyebrowsF : EyebrowsM) as SourceMap),
        body: toList(BodyM as SourceMap),
        eyes: toList((isFemale ? EyesF : EyesM) as SourceMap),
        lips: toList(LipsF as SourceMap),
        palette: toList((isFemale ? PaletteF : PaletteM) as SourceMap),
        makeup: toList((isFemale ? MakeupF : MakeupM) as SourceMap),
    }
})

const tabConfig: { key: TabKey; label: string; gender?: Gender }[] = [
    { key: 'hair', label: 'Hair' },
    { key: 'beard', label: 'Beard', gender: 'MALE' },
    { key: 'eyebrows', label: 'Brows' },
    { key: 'body', label: 'Chest', gender: 'MALE' },
    { key: 'eyes', label: 'Eyes' },
    { key: 'lips', label: 'Lips', gender: 'FEMALE' },
    { key: 'palette', label: 'Blush' },
    { key: 'makeup', label: 'Makeup' },
]

const tabs = computed(() => tabConfig.filter((item) => !item.gender || item.gender === gender.value))
const activeOptions = computed(() => options.value[tab.value])
const subtitle = computed(() => (gender.value === 'FEMALE' ? 'Female character' : 'Male character'))

watch(tabs, (visibleTabs) => {
    if (!visibleTabs.some((item) => item.key === tab.value)) tab.value = visibleTabs[0]?.key ?? 'hair'
}, { immediate: true })

onMounted(() => {
    const current = character.character.value?.appearance
    if (current) customization.set(current)
    initialAppearance.value = { ...customization.appearance.value }
    customization.start()
    customization.preview()
})

function selectedFor(t: TabKey): number {
    switch (t) {
        case 'hair':
            return customization.appearance.value.hairId
        case 'beard':
            return customization.appearance.value.beardId
        case 'eyebrows':
            return customization.appearance.value.eyebrowsId
        case 'body':
            return customization.appearance.value.bodyId
        case 'eyes':
            return customization.appearance.value.eyesId
        case 'lips':
            return customization.appearance.value.lipsId
        case 'palette':
            return customization.appearance.value.paletteId
        case 'makeup':
            return customization.appearance.value.makeupId
    }
}

function pick(item: CustomizationItem) {
    switch (tab.value) {
        case 'hair':
            customization.patch({ hairId: item.Id })
            break
        case 'beard':
            customization.patch({ beardId: item.Id })
            break
        case 'eyebrows':
            customization.patch({ eyebrowsId: item.Id })
            break
        case 'body':
            customization.patch({ bodyId: item.Id })
            break
        case 'eyes':
            customization.patch({ eyesId: item.Id })
            break
        case 'lips':
            customization.patch({ lipsId: item.Id })
            break
        case 'palette':
            customization.patch({ paletteId: item.Id })
            break
        case 'makeup':
            customization.patch({ makeupId: item.Id })
            break
    }
    customization.preview()
}

async function finish() {
    const ok = await customization.save()
    if (ok) {
        closeSession()
        router.setHud('PlayerHud')
    }
}

function cancel() {
    if (initialAppearance.value) {
        customization.set(initialAppearance.value)
        customization.preview()
    } else {
        customization.reset()
    }
    closeSession()
    router.setView('PlayerAuthentication')
}

function closeSession() {
    if (sessionClosed) return
    sessionClosed = true
    customization.stop()
}

onBeforeUnmount(closeSession)
</script>

<template>
    <main class="player-customization">
        <aside class="player-customization__sidebar">
            <header>
                <h1>Appearance</h1>
                <p>{{ subtitle }}</p>
            </header>

            <nav class="player-customization__tabs">
                <button
                    v-for="t in tabs"
                    :key="t.key"
                    :class="{ active: tab === t.key }"
                    type="button"
                    @click="tab = t.key"
                >
                    {{ t.label }}
                </button>
            </nav>

            <ul class="player-customization__list">
                <li
                    v-for="item in activeOptions"
                    :key="item.Id"
                    :class="{ active: selectedFor(tab) === item.Id }"
                    @click="pick(item)"
                >
                    <span class="player-customization__name">{{ item.Name }}</span>
                    <span v-if="item.Price > 0" class="player-customization__price">${{ item.Price }}</span>
                </li>
            </ul>

            <p v-if="customization.error.value" class="player-customization__error">
                {{ customization.error.value }}
            </p>

            <div class="player-customization__actions">
                <button type="button" class="player-customization__cancel" @click="cancel">Cancel</button>
                <button
                    type="button"
                    class="player-customization__done"
                    :disabled="customization.loading.value"
                    @click="finish"
                >
                    {{ customization.loading.value ? 'Saving…' : 'Done' }}
                </button>
            </div>
        </aside>
    </main>
</template>

<style scoped>
.player-customization {
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0) 40%);
    display: flex;
    color: #f1f5f9;
    font-family: 'Geist Variable', system-ui, sans-serif;
}
.player-customization__sidebar {
    width: 360px;
    background: #0f172a;
    border-right: 1px solid #1e293b;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.player-customization__sidebar header h1 {
    margin: 0 0 4px;
    font-size: 22px;
}
.player-customization__sidebar header p {
    margin: 0;
    font-size: 12px;
    color: #94a3b8;
}
.player-customization__tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4px;
    background: #1e293b;
    border-radius: 8px;
    padding: 4px;
}
.player-customization__tabs button {
    background: transparent;
    border: none;
    min-height: 34px;
    padding: 8px 6px;
    color: #cbd5e1;
    font-size: 12px;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.player-customization__tabs button.active {
    background: #6366f1;
    color: white;
}
.player-customization__list {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-top: 1px solid #1e293b;
    padding-top: 12px;
}
.player-customization__list li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #1e293b;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.15s;
}
.player-customization__list li:hover {
    background: #334155;
}
.player-customization__list li.active {
    background: #6366f1;
}
.player-customization__price {
    color: #94a3b8;
    font-size: 11px;
}
.player-customization__error {
    color: #f87171;
    font-size: 12px;
    margin: 0;
}
.player-customization__actions {
    display: flex;
    gap: 8px;
}
.player-customization__cancel,
.player-customization__done {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
}
.player-customization__cancel {
    background: #1e293b;
    color: #cbd5e1;
}
.player-customization__done {
    background: #6366f1;
    color: white;
}
.player-customization__done:disabled {
    background: #334155;
    color: #64748b;
    cursor: not-allowed;
}
</style>
