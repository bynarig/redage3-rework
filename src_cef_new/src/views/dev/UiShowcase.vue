<script setup lang="ts">
import { ref } from 'vue'
import {
    IosButton, IosCard, IosCheckbox, IosListItem,
    IosSegmentedControl, IosProgressBar, IosSearchField,
    IosStepper, IosGroupSection, IosTag,
} from '@/components/ui'

const checked1 = ref(false)
const checked2 = ref(true)
const checked3 = ref(false)
const checked4 = ref(true)

const segTab = ref<string>('All')
const segTabDark = ref<string>('All')
const segView = ref<string | number>('list')

const searchVal = ref('')
const searchValDark = ref('')

const stepCount = ref(3)
const stepCountBounded = ref(5)
const stepCountDark = ref(2)

const progressVal = ref(65)

const removableTags = ref(['VIP', 'Online', 'Wanted'])
function removeTag(label: string) {
    removableTags.value = removableTags.value.filter(t => t !== label)
}
</script>

<template>
    <div class="showcase">
        <!-- ── Header ───────────────────────────────────────────────────────── -->
        <h1 class="showcase__title">iOS 26 Component Library</h1>

        <!-- ── Checkboxes in cards ──────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">IosCheckbox + IosCard</h2>
            <div class="showcase__row">
                <!-- Light card -->
                <IosCard flush>
                    <IosListItem label="Enable notifications">
                        <template #right>
                            <IosCheckbox v-model="checked1" />
                        </template>
                    </IosListItem>
                    <IosListItem label="Allow location access">
                        <template #right>
                            <IosCheckbox v-model="checked2" />
                        </template>
                    </IosListItem>
                </IosCard>

                <!-- Dark card -->
                <IosCard :dark="true" flush>
                    <IosListItem label="Enable notifications" :dark="true">
                        <template #right>
                            <IosCheckbox v-model="checked3" :dark="true" />
                        </template>
                    </IosListItem>
                    <IosListItem label="Allow location access" :dark="true">
                        <template #right>
                            <IosCheckbox v-model="checked4" :dark="true" />
                        </template>
                    </IosListItem>
                </IosCard>
            </div>
        </section>

        <!-- ── Buttons — Blue ───────────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">IosButton — Blue</h2>

            <!-- Filled -->
            <div class="showcase__row">
                <IosButton variant="filled" color="blue" size="lg" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="filled" color="blue" size="md" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="filled" color="blue" size="sm" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
            </div>

            <!-- Tinted -->
            <div class="showcase__row">
                <IosButton variant="tinted" color="blue" size="lg" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="blue" size="md" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="blue" size="sm" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
            </div>

            <!-- Gray -->
            <div class="showcase__row">
                <IosButton variant="gray" color="blue" size="lg" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="gray" color="blue" size="md" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="gray" color="blue" size="sm" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
            </div>

            <!-- Plain -->
            <div class="showcase__row">
                <IosButton variant="plain" color="blue" size="lg" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="plain" color="blue" size="md" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="plain" color="blue" size="sm" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
            </div>

            <!-- Label-only -->
            <div class="showcase__row">
                <IosButton variant="filled" color="blue" size="lg" label="Play" />
                <IosButton variant="filled" color="blue" size="md" label="Play" />
                <IosButton variant="filled" color="blue" size="sm" label="Play" />
                <IosButton variant="tinted" color="blue" size="lg" label="Play" />
                <IosButton variant="tinted" color="blue" size="md" label="Play" />
                <IosButton variant="tinted" color="blue" size="sm" label="Play" />
            </div>

            <!-- Icon-only circles -->
            <div class="showcase__row">
                <IosButton variant="filled" color="blue" size="lg">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="filled" color="blue" size="md">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="filled" color="blue" size="sm">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="blue" size="lg">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="blue" size="md">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="blue" size="sm">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="gray" color="blue" size="lg">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="gray" color="blue" size="md">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="gray" color="blue" size="sm">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
            </div>
        </section>

        <!-- ── Buttons — Red ────────────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">IosButton — Red (Destructive)</h2>

            <div class="showcase__row">
                <IosButton variant="filled" color="red" size="lg" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="filled" color="red" size="md" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="filled" color="red" size="sm" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="red" size="lg" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="red" size="md" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="red" size="sm" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
            </div>

            <div class="showcase__row">
                <IosButton variant="filled" color="red" size="lg">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="filled" color="red" size="md">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="filled" color="red" size="sm">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="red" size="lg">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="red" size="md">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="red" size="sm">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
            </div>
        </section>

        <!-- ── Disabled states ──────────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">Disabled states</h2>
            <div class="showcase__row">
                <IosButton variant="filled" color="blue" size="md" label="Play" :disabled="true" />
                <IosButton variant="tinted" color="blue" size="md" label="Play" :disabled="true" />
                <IosButton variant="gray"   color="blue" size="md" label="Play" :disabled="true" />
                <IosButton variant="plain"  color="blue" size="md" label="Play" :disabled="true" />
                <IosButton variant="filled" color="red"  size="md" label="Delete" :disabled="true" />
                <IosButton variant="tinted" color="red"  size="md" label="Delete" :disabled="true" />
            </div>
        </section>

        <!-- ── IosSegmentedControl ──────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">IosSegmentedControl</h2>

            <div class="showcase__row">
                <IosSegmentedControl
                    v-model="segTab"
                    :items="['All', 'Online', 'Offline']"
                    size="sm"
                />
                <IosSegmentedControl
                    v-model="segTab"
                    :items="['All', 'Online', 'Offline']"
                    size="md"
                />
                <IosSegmentedControl
                    v-model="segTab"
                    :items="['All', 'Online', 'Offline']"
                    size="lg"
                />
            </div>

            <div class="showcase__row">
                <IosSegmentedControl
                    v-model="segView"
                    :items="[{ label: 'List', value: 'list' }, { label: 'Grid', value: 'grid' }, { label: 'Map', value: 'map', disabled: true }]"
                    full-width
                    style="width: 320px"
                />
            </div>

            <div class="showcase__row">
                <IosSegmentedControl
                    v-model="segTab"
                    :items="['A', 'B', 'C']"
                    disabled
                />
            </div>
        </section>

        <!-- ── IosSegmentedControl dark ─────────────────────────────────────── -->
        <section class="showcase__section showcase__section--dark">
            <h2 class="showcase__heading showcase__heading--light">IosSegmentedControl — Dark</h2>
            <div class="showcase__row dark" data-theme="dark">
                <IosSegmentedControl
                    v-model="segTabDark"
                    :items="['Messages', 'Calls', 'Contacts']"
                    size="md"
                />
            </div>
        </section>

        <!-- ── IosProgressBar ───────────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">IosProgressBar</h2>

            <div class="showcase__col">
                <IosProgressBar :value="progressVal" color="accent"      size="md" label="Health"     show-value />
                <IosProgressBar :value="progressVal" color="success"     size="md" label="Stamina"    show-value />
                <IosProgressBar :value="progressVal" color="warning"     size="md" label="Hunger"     show-value />
                <IosProgressBar :value="progressVal" color="destructive" size="md" label="Wanted"     show-value />
                <IosProgressBar :value="progressVal" color="neutral"     size="md" label="Experience" show-value />
            </div>

            <div class="showcase__col" style="margin-top: 16px">
                <IosProgressBar :value="40" color="accent" size="xs" />
                <IosProgressBar :value="55" color="accent" size="sm" />
                <IosProgressBar :value="70" color="accent" size="md" />
                <IosProgressBar :value="85" color="accent" size="lg" />
            </div>

            <div class="showcase__col" style="margin-top: 16px">
                <IosProgressBar :value="60" color="success" size="md" striped animated label="Loading assets…" />
                <IosProgressBar color="accent" size="md" indeterminate label="Connecting…" />
                <IosProgressBar color="warning" size="md" indeterminate />
            </div>
        </section>

        <!-- ── IosSearchField ───────────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">IosSearchField</h2>

            <div class="showcase__col">
                <IosSearchField v-model="searchVal" placeholder="Search players…" size="sm" />
                <IosSearchField v-model="searchVal" placeholder="Search players…" size="md" />
                <IosSearchField v-model="searchVal" placeholder="Search players…" size="lg" />
                <IosSearchField v-model="searchVal" placeholder="Disabled" size="md" disabled />
            </div>
        </section>

        <section class="showcase__section showcase__section--dark">
            <h2 class="showcase__heading showcase__heading--light">IosSearchField — Dark</h2>
            <div class="dark" data-theme="dark">
                <IosSearchField v-model="searchValDark" placeholder="Search…" size="md" />
            </div>
        </section>

        <!-- ── IosStepper ────────────────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">IosStepper</h2>

            <div class="showcase__row">
                <IosStepper v-model="stepCount" size="sm" />
                <IosStepper v-model="stepCount" size="md" />
                <IosStepper v-model="stepCount" size="lg" />
            </div>

            <div class="showcase__row">
                <IosStepper v-model="stepCountBounded" :min="0" :max="10" size="md" />
                <IosStepper v-model="stepCount" size="md" disabled />
            </div>
        </section>

        <section class="showcase__section showcase__section--dark">
            <h2 class="showcase__heading showcase__heading--light">IosStepper — Dark</h2>
            <div class="showcase__row dark" data-theme="dark">
                <IosStepper v-model="stepCountDark" :min="0" :max="99" size="md" />
                <IosStepper v-model="stepCountDark" :min="0" :max="99" size="lg" />
            </div>
        </section>

        <!-- ── IosGroupSection ───────────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">IosGroupSection</h2>

            <div class="showcase__col">
                <IosGroupSection title="Privacy" footer="These settings are stored on-device and never shared with the server.">
                    <IosListItem label="Share analytics" :separator="true">
                        <template #right>
                            <IosCheckbox v-model="checked1" />
                        </template>
                    </IosListItem>
                    <IosListItem label="Location access" :chevron="true" :separator="true" />
                    <IosListItem label="Enable notifications" :separator="false">
                        <template #right>
                            <IosCheckbox v-model="checked2" />
                        </template>
                    </IosListItem>
                </IosGroupSection>

                <IosGroupSection title="Account" footer="Logged in as Player #4291.">
                    <IosListItem label="Change username" :chevron="true" :separator="true" />
                    <IosListItem label="Sign out" :separator="false" />
                </IosGroupSection>
            </div>
        </section>

        <!-- ── IosTag ────────────────────────────────────────────────────────── -->
        <section class="showcase__section">
            <h2 class="showcase__heading">IosTag</h2>

            <div class="showcase__row">
                <IosTag label="Default" color="default" size="sm" />
                <IosTag label="Accent" color="accent" size="sm" />
                <IosTag label="Success" color="success" size="sm" />
                <IosTag label="Warning" color="warning" size="sm" />
                <IosTag label="Danger" color="destructive" size="sm" />
            </div>

            <div class="showcase__row">
                <IosTag label="xs" color="accent" size="xs" />
                <IosTag label="sm" color="accent" size="sm" />
                <IosTag label="md" color="accent" size="md" />
            </div>

            <div class="showcase__row">
                <IosTag label="All" color="default" size="sm" :selected="true" />
                <IosTag label="Online" color="default" size="sm" />
                <IosTag label="Nearby" color="default" size="sm" />
                <IosTag label="Wanted" color="destructive" size="sm" :selected="false" />
            </div>

            <div class="showcase__row">
                <IosTag
                    v-for="tag in removableTags"
                    :key="tag"
                    :label="tag"
                    color="accent"
                    size="sm"
                    removable
                    @remove="removeTag(tag)"
                />
                <span v-if="!removableTags.length" style="font-size:13px; color: var(--ui-label-tertiary)">All removed — refresh to reset</span>
            </div>
        </section>

        <!-- ── Dark background demo ─────────────────────────────────────────── -->
        <section class="showcase__section showcase__section--dark">
            <h2 class="showcase__heading showcase__heading--light">Dark Background</h2>
            <div class="showcase__row">
                <IosButton variant="filled" color="blue" size="md" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="tinted" color="blue" size="md" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="gray" color="neutral" size="md" label="Play">
                    <template #icon><svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5l9 5.5-9 5.5V2.5z"/></svg></template>
                </IosButton>
                <IosButton variant="filled" color="red" size="md" label="Delete" />
                <IosButton variant="tinted" color="red" size="md" label="Delete" />
            </div>
            <div class="showcase__row">
                <IosCard :dark="true" flush>
                    <IosListItem label="Dark mode option" :dark="true">
                        <template #right>
                            <IosCheckbox v-model="checked3" :dark="true" />
                        </template>
                    </IosListItem>
                    <IosListItem label="Another option" :dark="true" :chevron="true" />
                </IosCard>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
.showcase {
    padding: 40px;
    min-height: 100vh;
    background: #F2F2F7;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;

    &__title {
        font-size: 28px;
        font-weight: 700;
        color: #000;
        margin: 0 0 32px;
    }

    &__section {
        margin-bottom: 40px;
        padding: 24px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 20px;
        -webkit-backdrop-filter: blur(12px);
        backdrop-filter: blur(12px);

        &--dark {
            background: rgba(28, 28, 30, 0.95);
        }
    }

    &__heading {
        font-size: 13px;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: rgba(60, 60, 67, 0.6);
        margin: 0 0 16px;

        &--light {
            color: rgba(235, 235, 245, 0.6);
        }
    }

    &__row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 12px;

        & > * {
            margin-right: 10px;
            margin-bottom: 10px;
        }
    }

    &__col {
        display: flex;
        flex-direction: column;
        margin-bottom: 12px;

        & > * {
            margin-bottom: 10px;
        }

        & > *:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
