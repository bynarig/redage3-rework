<script setup lang="ts">
import PhoneHeader from '../PhoneHeader.vue'
import PhoneHomeButton from '../PhoneHomeButton.vue'
import { useTinder } from '@/views/accessories/shared/composables/useTinder'

const {
    isLoad, isCreate, view, profile, isEditProfile, editText, editType,
    tinderList, matches, onSaveProfile, onSelectAvatar, onAction, onOpenMessages,
} = useTinder()
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
                <div>Tinder</div>
            </div>

            <!-- Top navigation -->
            <div>
                <span v-if="isCreate" @click="view = 'List'"></span>
                <span v-else />
                <div>
                    <span v-if="isCreate" @click="view = 'Matches'"></span>
                    <span @click="view = 'Profile'"></span>
                </div>
            </div>

            <!-- Profile view -->
            <template v-if="view === 'Profile'">
                <template v-if="isCreate && !isEditProfile">
                    <div>Ваш профиль:</div>
                    <div>
                        <div>
                            <div></div>
                            <div>Мой профиль</div>
                            <div></div>
                            <div>{{ profile.text }}</div>
                        </div>
                        <div @click="isEditProfile = true">Редактировать</div>
                    </div>
                </template>
                <template v-else>
                    <div>
                        <div>Редактирование профиля</div>
                        <div @click="onSelectAvatar"></div>
                        <div>Описание:</div>
                        <textarea v-model="editText" placeholder="Расскажите о себе..." maxlength="150"></textarea>
                        <div>Я ищу:</div>
                        <div @click="editType = 0">
                            <div>Парня</div>
                            <div>
                                <input type="checkbox" disabled :checked="editType === 0">
                                <label></label>
                            </div>
                        </div>
                        <div @click="editType = 1">
                            <div>Девушку</div>
                            <div>
                                <input type="checkbox" disabled :checked="editType === 1">
                                <label></label>
                            </div>
                        </div>
                        <div @click="editType = 2">
                            <div>Друзей</div>
                            <div>
                                <input type="checkbox" disabled :checked="editType === 2">
                                <label></label>
                            </div>
                        </div>
                        <div @click="onSaveProfile">Сохранить</div>
                    </div>
                </template>
            </template>

            <!-- List / swipe view -->
            <template v-else-if="view === 'List'">
                <div v-if="tinderList.length > 0 && tinderList[0]">
                    <div>
                        <i></i>
                        <i></i>
                    </div>
                    <div>
                        <div>
                            <div></div>
                            <div>{{ tinderList[0]!.name }}</div>
                            <div></div>
                            <div>{{ tinderList[0]!.text }}</div>
                        </div>
                    </div>
                    <div>
                        <button id="nope"><i @click="onAction(false)"></i></button>
                        <button id="love"><i @click="onAction(true)"></i></button>
                    </div>
                </div>
                <div v-else>
                    <div></div>
                    <div>Кажется, тут никого нет.. Но скоро кто-то появится!</div>
                </div>
            </template>

            <!-- Matches -->
            <template v-else-if="view === 'Matches'">
                <div>Совпадения:</div>
                <div>
                    <template v-if="matches.length > 0">
                        <div
                            v-for="user in matches"
                            :key="user.uuid"
                            @click="onOpenMessages(user.uuid)"
                        >
                            <div></div>
                            <div><div>{{ user.name }}</div></div>
                            <div></div>
                        </div>
                    </template>
                    <div v-else>
                        <div></div>
                        <div>Совпадений нет</div>
                    </div>
                </div>
            </template>
        </div>
        <PhoneHomeButton />
    </div>
</template>
