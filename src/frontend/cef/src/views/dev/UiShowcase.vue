<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
    UiButton, UiCard, UiInput, UiTextarea, UiSelect,
    UiBadge, UiCheckbox, UiToggle, UiTabs, UiAlert,
    UiAvatar, UiSeparator, UiTooltip, UiModal,
    IosButton, IosCard, IosCheckbox, IosListItem,
    IosSegmentedControl, IosProgressBar, IosSearchField,
    IosStepper, IosGroupSection, IosTag,
    type UiButtonColor, type UiButtonVariant, type UiButtonSize,
} from '@/views/components/ui'

// ── State ─────────────────────────────────────────────────────────────────
type Theme = 'glass-light' | 'glass-dark'
type Backdrop = 'aurora' | 'sunset' | 'noir' | 'matrix'

const theme = ref<Theme>('glass-dark')
const backdrop = ref<Backdrop>('aurora')

const checked1 = ref(true)
const checked2 = ref(false)
const checkedInd = ref<boolean | 'indeterminate'>('indeterminate')
const toggleA = ref(true)
const toggleB = ref(false)

const inputBasic = ref('')
const inputClear = ref('redage://player/4291')
const inputPwd = ref('')
const textareaVal = ref('Frosted panes, hard rims, refraction. — RedAge Glass Kit')

const selectVal = ref<string | number | undefined>('online')
const selectMulti = ref<string | undefined>(undefined)

const tabKey = ref<string | number>('overview')

const modalOpen = ref(false)

const colors: UiButtonColor[] = ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral']
const variants: UiButtonVariant[] = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link']
const sizes: UiButtonSize[] = ['xs', 'sm', 'md', 'lg', 'xl']

const wrapClass = computed(() => [
    'showcase',
    `showcase--bg-${backdrop.value}`,
    theme.value === 'glass-dark' ? 'ui-theme-glass-dark' : 'ui-theme-glass-light',
])

const fontLink = `https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap`

onMounted(() => {
    if (!document.querySelector('link[data-glass-fonts]')) {
        const l = document.createElement('link')
        l.rel = 'stylesheet'
        l.href = fontLink
        l.dataset.glassFonts = 'true'
        document.head.appendChild(l)
    }
})

defineProps<{ viewData?: unknown }>()
</script>

<template>
    <div :class="wrapClass">
        <!-- Animated backdrops -->
        <div class="showcase__sky" aria-hidden="true">
            <span class="showcase__orb showcase__orb--a" />
            <span class="showcase__orb showcase__orb--b" />
            <span class="showcase__orb showcase__orb--c" />
            <span class="showcase__grain" />
        </div>

        <!-- ── Header ───────────────────────────────────────────────────── -->
        <header class="showcase__header">
            <div>
                <p class="showcase__eyebrow">RedAge — Component Atlas</p>
                <h1 class="showcase__title">
                    <em>Glass</em> kit
                </h1>
                <p class="showcase__lead">
                    Self-contained, theme-aware primitives. Reusable APIs. No Nuxt UI
                    dependency. Every surface is a frosted pane with a hard rim and a
                    top-edge glint — drop them anywhere on top of any backdrop.
                </p>
            </div>
            <aside class="showcase__controls">
                <fieldset class="showcase__toggle">
                    <legend>Theme</legend>
                    <button :class="['showcase__chip', theme === 'glass-light' && 'is-on']" @click="theme = 'glass-light'">Light</button>
                    <button :class="['showcase__chip', theme === 'glass-dark' && 'is-on']" @click="theme = 'glass-dark'">Dark</button>
                </fieldset>
                <fieldset class="showcase__toggle">
                    <legend>Backdrop</legend>
                    <button :class="['showcase__chip', backdrop === 'aurora' && 'is-on']" @click="backdrop = 'aurora'">Aurora</button>
                    <button :class="['showcase__chip', backdrop === 'sunset' && 'is-on']" @click="backdrop = 'sunset'">Sunset</button>
                    <button :class="['showcase__chip', backdrop === 'noir' && 'is-on']" @click="backdrop = 'noir'">Noir</button>
                    <button :class="['showcase__chip', backdrop === 'matrix' && 'is-on']" @click="backdrop = 'matrix'">Matrix</button>
                </fieldset>
            </aside>
        </header>

        <!-- ── Buttons ──────────────────────────────────────────────────── -->
        <section class="showcase__section">
            <header class="showcase__sec-head">
                <h2><em>01</em> Buttons</h2>
                <p>Six variants × seven colors × five sizes — all live.</p>
            </header>

            <div class="showcase__grid">
                <div v-for="v in variants" :key="v" class="showcase__cell">
                    <div class="showcase__cell-label">{{ v }}</div>
                    <div class="showcase__row">
                        <UiButton v-for="c in colors" :key="c" :variant="v" :color="c" size="sm" :label="c" />
                    </div>
                </div>
            </div>

            <UiSeparator label="Sizes" size="xs" />

            <div class="showcase__row">
                <UiButton v-for="s in sizes" :key="s" :size="s" :label="s.toUpperCase()" />
            </div>

            <UiSeparator label="States" size="xs" />

            <div class="showcase__row">
                <UiButton label="Default" />
                <UiButton label="Loading" loading />
                <UiButton label="Disabled" disabled />
                <UiButton label="Block" block style="max-width: 220px" />
                <UiButton square size="md" icon="✱" />
                <UiButton square size="lg" icon="↗" variant="outline" color="info" />
                <UiButton square size="xl" icon="✦" variant="soft" color="warning" />
            </div>
        </section>

        <!-- ── Inputs ───────────────────────────────────────────────────── -->
        <section class="showcase__section">
            <header class="showcase__sec-head">
                <h2><em>02</em> Inputs</h2>
                <p>Text, password, textarea, select — frosted by default.</p>
            </header>

            <div class="showcase__cols">
                <div class="showcase__col">
                    <UiInput v-model="inputBasic" placeholder="Search the city…" leading-icon="⌕" />
                    <UiInput v-model="inputClear" placeholder="Clearable" clearable />
                    <UiInput v-model="inputPwd" type="password" placeholder="Password" leading-icon="⚿" />
                    <UiInput v-model="inputBasic" placeholder="Loading…" loading />
                    <UiInput v-model="inputBasic" placeholder="Error state" color="error" highlight />
                    <UiInput v-model="inputBasic" placeholder="Disabled" disabled />
                </div>
                <div class="showcase__col">
                    <UiSelect
                        v-model="selectVal"
                        :items="[
                            { label: 'Online',    value: 'online' },
                            { label: 'Away',      value: 'away' },
                            { label: 'In jail',   value: 'jail' },
                            { label: 'Wanted',    value: 'wanted', disabled: true },
                            { label: 'Offline',   value: 'offline' },
                        ]"
                        placeholder="Status"
                    />
                    <UiSelect
                        v-model="selectMulti"
                        :items="['Sandy Shores', 'Paleto Bay', 'Vinewood', 'Davis']"
                        placeholder="Neighbourhood"
                        variant="soft"
                    />
                    <UiTextarea v-model="textareaVal" :rows="4" placeholder="Description…" />
                </div>
            </div>

            <div class="showcase__row" style="margin-top: 14px">
                <UiInput v-model="inputBasic" size="xs" placeholder="xs" />
                <UiInput v-model="inputBasic" size="sm" placeholder="sm" />
                <UiInput v-model="inputBasic" size="md" placeholder="md" />
                <UiInput v-model="inputBasic" size="lg" placeholder="lg" />
                <UiInput v-model="inputBasic" size="xl" placeholder="xl" />
            </div>
        </section>

        <!-- ── Selection ────────────────────────────────────────────────── -->
        <section class="showcase__section">
            <header class="showcase__sec-head">
                <h2><em>03</em> Selection &amp; toggles</h2>
                <p>Checkbox, switch, segmented choices.</p>
            </header>

            <div class="showcase__cols">
                <div class="showcase__col">
                    <UiCheckbox v-model="checked1" label="Auto-save character" description="Persist position every 60 seconds" />
                    <UiCheckbox v-model="checked2" color="success" label="Enable VOIP" />
                    <UiCheckbox v-model="checkedInd" indeterminate color="warning" label="Partially applied" description="Some characters opted in" />
                    <UiCheckbox :model-value="false" disabled label="Disabled state" />
                </div>
                <div class="showcase__col">
                    <UiToggle v-model="toggleA" label="Frosted HUD" description="Apply backdrop blur to the player HUD" />
                    <UiToggle v-model="toggleB" color="success" label="Cinematic camera" />
                    <UiToggle v-model="toggleA" color="warning" size="lg" label="Restricted area pulse" />
                    <UiToggle v-model="toggleB" color="error" size="sm" label="Force PvP" />
                </div>
            </div>
        </section>

        <!-- ── Badges, Avatars, Tooltips, Separators ───────────────────── -->
        <section class="showcase__section">
            <header class="showcase__sec-head">
                <h2><em>04</em> Badges, avatars, tooltips</h2>
                <p>The little signals that decorate a row.</p>
            </header>

            <div class="showcase__row">
                <UiBadge v-for="c in colors" :key="c" :color="c" :label="c" />
            </div>
            <div class="showcase__row">
                <UiBadge v-for="c in colors" :key="`o-${c}`" :color="c" :label="c" variant="outline" />
            </div>
            <div class="showcase__row">
                <UiBadge v-for="c in colors" :key="`s-${c}`" :color="c" :label="c" variant="soft" />
            </div>

            <UiSeparator label="Avatars" size="xs" />

            <div class="showcase__row" style="align-items: flex-end">
                <UiAvatar size="xs" text="JD" />
                <UiAvatar size="sm" text="VR" />
                <UiAvatar size="md" text="Mira K" chip-color="success" chip-text="ON" />
                <UiAvatar size="lg" text="Cassius" chip-color="warning" />
                <UiAvatar size="xl" text="Echo" chip-color="error" chip-position="top-right" />
                <UiAvatar size="2xl" text="A" />
            </div>

            <UiSeparator label="Tooltips" size="xs" />

            <div class="showcase__row" style="gap: 24px">
                <UiTooltip text="Top tooltip" placement="top">
                    <UiButton label="Hover top" variant="soft" />
                </UiTooltip>
                <UiTooltip text="Bottom" placement="bottom">
                    <UiButton label="Hover bottom" variant="soft" />
                </UiTooltip>
                <UiTooltip text="Saves the current outfit" placement="right" :kbds="['⌘', 'S']" arrow>
                    <UiButton label="With keys" variant="soft" />
                </UiTooltip>
            </div>

            <UiSeparator label="Separators" size="xs" />

            <UiSeparator label="solid" type="solid" />
            <UiSeparator label="dashed" type="dashed" />
            <UiSeparator label="dotted" type="dotted" />
            <UiSeparator />
        </section>

        <!-- ── Cards, Alerts, Tabs, Modal ──────────────────────────────── -->
        <section class="showcase__section">
            <header class="showcase__sec-head">
                <h2><em>05</em> Surfaces</h2>
                <p>Cards, alerts, tabs, and a modal that floats over everything.</p>
            </header>

            <div class="showcase__cards">
                <UiCard title="Standard card" description="A frosted pane with the default rim and shadow.">
                    Anything you put inside lives behind the same hairline highlight. Try
                    dragging this onto any backdrop.
                    <template #footer>
                        <UiButton size="sm" label="Action" />
                        <UiButton size="sm" variant="ghost" label="Dismiss" />
                    </template>
                </UiCard>

                <UiCard title="Highlight card" description="With an outer accent ring." highlight>
                    Use sparingly — meant to surface a single primary card.
                    <template #footer>
                        <UiBadge label="Featured" />
                    </template>
                </UiCard>

                <UiCard title="Strong card" description="Higher opacity for legibility on busy backdrops." strong>
                    Same skeleton, more opaque pane. The rim and glint stay subtle.
                </UiCard>
            </div>

            <UiSeparator label="Alerts" size="xs" />

            <div class="showcase__col">
                <UiAlert color="primary" icon="ⓘ" title="Glass kit loaded" description="14 components, two themes, four backdrops. Reusable, configurable, theme-aware." />
                <UiAlert color="success" icon="✓" title="Character saved" description="State persisted to player-service." />
                <UiAlert color="warning" icon="⚠" title="Connection unstable" description="Reply latency spiked above 250ms — investigate." />
                <UiAlert color="error" variant="solid" icon="!" title="Service unreachable" description="auth-service did not respond within 10s." />
            </div>

            <UiSeparator label="Tabs" size="xs" />

            <UiTabs
                v-model="tabKey"
                :items="[
                    { label: 'Overview', value: 'overview' },
                    { label: 'Characters', value: 'chars' },
                    { label: 'Inventory', value: 'inv' },
                    { label: 'Telemetry', value: 'tel', disabled: true },
                ]"
            >
                <template #default="{ value }">
                    <UiCard padded>
                        Active panel: <strong>{{ value }}</strong>. The contents are slot-driven —
                        bring your own routing.
                    </UiCard>
                </template>
            </UiTabs>

            <div class="showcase__row" style="margin-top: 12px">
                <UiTabs
                    :items="[
                        { label: 'All' }, { label: 'Online' }, { label: 'Wanted' }
                    ]"
                    variant="underline"
                    size="sm"
                />
                <UiTabs
                    :items="[
                        { label: 'All' }, { label: 'Online' }, { label: 'Wanted' }
                    ]"
                    variant="link"
                    color="secondary"
                />
            </div>

            <UiSeparator label="Modal" size="xs" />

            <div class="showcase__row">
                <UiButton label="Open modal" @click="modalOpen = true" />
            </div>
            <UiModal v-model:open="modalOpen" title="Confirm purchase" description="Buying the cosmic-orange skin will deduct $4,800 from your bank.">
                <p>This action cannot be undone. The skin is bound to character #4291 and
                will appear in your wardrobe within five seconds.</p>
                <template #footer>
                    <UiButton variant="ghost" label="Cancel" @click="modalOpen = false" />
                    <UiButton color="primary" label="Buy now" @click="modalOpen = false" />
                </template>
            </UiModal>
        </section>

        <!-- ── iOS components (untouched) ─────────────────────────────── -->
        <section class="showcase__section showcase__section--ios">
            <header class="showcase__sec-head">
                <h2><em>06</em> iOS kit <small>(preserved)</small></h2>
                <p>The native-feeling iOS surfaces stay as-is — for accessories like the in-game phone.</p>
            </header>

            <div class="showcase__cols">
                <div class="showcase__col" style="flex: 0 0 280px">
                    <IosCard flush>
                        <IosListItem label="Enable notifications">
                            <template #right><IosCheckbox v-model="checked1" /></template>
                        </IosListItem>
                        <IosListItem label="Location access" :chevron="true" />
                        <IosListItem label="Allow VOIP">
                            <template #right><IosCheckbox v-model="checked2" /></template>
                        </IosListItem>
                    </IosCard>

                    <IosGroupSection title="Quick actions" footer="Bound to the radial menu.">
                        <IosListItem label="Camera" :separator="true" />
                        <IosListItem label="Wallet" :chevron="true" :separator="true" />
                        <IosListItem label="Sign out" :separator="false" />
                    </IosGroupSection>
                </div>

                <div class="showcase__col">
                    <IosSegmentedControl :model-value="'All'" :items="['All', 'Online', 'Offline']" />
                    <IosSearchField :model-value="''" placeholder="Search players…" />
                    <IosStepper :model-value="3" :min="0" :max="10" />
                    <div class="showcase__row">
                        <IosTag label="VIP" color="accent" />
                        <IosTag label="Wanted" color="destructive" />
                        <IosTag label="Online" color="success" />
                    </div>
                    <div class="showcase__col">
                        <IosProgressBar :value="65" color="accent" label="Health" show-value />
                        <IosProgressBar :value="40" color="warning" label="Stamina" show-value />
                        <IosProgressBar color="success" indeterminate label="Loading…" />
                    </div>
                    <div class="showcase__row">
                        <IosButton variant="filled" color="blue" label="Play" />
                        <IosButton variant="tinted" color="blue" label="Play" />
                        <IosButton variant="filled" color="red" label="Delete" />
                    </div>
                </div>
            </div>
        </section>

        <footer class="showcase__footer">
            <UiSeparator />
            <p>RedAge v3 — Glass kit, drafted on {{ new Date().toLocaleDateString() }}. Backdrop variations are CSS only.</p>
        </footer>
    </div>
</template>

<style lang="scss" scoped>
.showcase {
    --gutter: 28px;

    // Escape #viewcontainer's overflow:hidden by becoming our own scroll viewport.
    position: fixed;
    inset: 0;
    z-index: 1000;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    pointer-events: auto;

    padding: 56px var(--gutter) 80px;
    font-family: 'Geist', var(--ui-font);
    color: var(--glass-text);
    background: #0a0d18;

    &__sky {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        overflow: hidden;
    }

    // ── Backdrops ────────────────────────────────────────────────────
    &--bg-aurora &__sky {
        background:
            radial-gradient(120% 70% at 18% 8%, rgba(15, 224, 184, 0.55), transparent 60%),
            radial-gradient(80% 60% at 95% 22%, rgba(255, 88, 184, 0.55), transparent 60%),
            radial-gradient(120% 80% at 50% 102%, rgba(247, 178, 64, 0.50), transparent 65%),
            #06070d;
    }
    &--bg-sunset &__sky {
        background:
            radial-gradient(100% 70% at 14% 14%, rgba(255, 119, 70, 0.60), transparent 55%),
            radial-gradient(90% 70% at 90% 60%, rgba(255, 51, 138, 0.55), transparent 60%),
            radial-gradient(120% 80% at 50% 100%, rgba(86, 36, 154, 0.65), transparent 70%),
            #14081d;
    }
    &--bg-noir &__sky {
        background:
            radial-gradient(140% 90% at 12% 8%, rgba(58, 70, 100, 0.6), transparent 55%),
            radial-gradient(120% 80% at 92% 92%, rgba(28, 32, 50, 0.85), transparent 60%),
            linear-gradient(180deg, #060810, #0a0d18 40%, #050608);
    }
    &--bg-matrix &__sky {
        background:
            radial-gradient(80% 60% at 22% 18%, rgba(0, 220, 130, 0.36), transparent 60%),
            radial-gradient(80% 60% at 78% 82%, rgba(0, 140, 220, 0.40), transparent 60%),
            linear-gradient(180deg, #03070d, #050d12);
    }

    &__orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        opacity: 0.75;
        animation: float 18s ease-in-out infinite alternate;

        &--a { top: -8%; left: -6%; width: 460px; height: 460px; background: radial-gradient(circle, rgba(255, 56, 130, 0.85), transparent 70%); animation-duration: 22s; }
        &--b { top: 40%; right: -8%; width: 520px; height: 520px; background: radial-gradient(circle, rgba(56, 196, 255, 0.75), transparent 70%); animation-duration: 26s; animation-direction: alternate-reverse; }
        &--c { bottom: -10%; left: 30%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(255, 196, 64, 0.55), transparent 70%); animation-duration: 30s; }
    }

    &__grain {
        position: absolute;
        inset: 0;
        opacity: 0.15;
        mix-blend-mode: overlay;
        background-image: radial-gradient(rgba(255, 255, 255, 0.7) 0.5px, transparent 0.5px);
        background-size: 3px 3px;
        pointer-events: none;
    }

    // Light themes get a softer base.
    &.ui-theme-glass-light {
        color: var(--glass-text);
        &.showcase--bg-aurora &__sky {
            background:
                radial-gradient(120% 70% at 18% 8%, rgba(190, 220, 255, 0.95), transparent 60%),
                radial-gradient(90% 70% at 95% 22%, rgba(255, 200, 220, 0.95), transparent 60%),
                radial-gradient(120% 80% at 50% 102%, rgba(255, 230, 180, 0.95), transparent 65%),
                #f6f4ee;
        }
        &.showcase--bg-noir &__sky {
            background:
                radial-gradient(140% 80% at 12% 8%, rgba(220, 224, 238, 0.95), transparent 55%),
                radial-gradient(120% 80% at 92% 92%, rgba(196, 204, 220, 0.95), transparent 60%),
                linear-gradient(180deg, #e8eaf2, #d6dbe6);
        }
    }

    // ── Header ───────────────────────────────────────────────────────
    &__header {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 28px;
        align-items: flex-end;
        margin-bottom: 56px;
    }

    &__eyebrow {
        font-family: var(--ui-font-mono);
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: var(--glass-text-muted);
        margin: 0 0 12px;
    }

    &__title {
        font-family: var(--ui-font-display);
        font-size: clamp(64px, 9vw, 124px);
        font-weight: 400;
        line-height: 0.92;
        letter-spacing: -0.025em;
        margin: 0;
        color: var(--glass-text);
        text-shadow: 0 6px 32px rgba(0, 0, 0, 0.25);

        em {
            font-style: italic;
            background: linear-gradient(135deg, #ff75a2 0%, #f7b240 50%, #6ed5ff 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
    }

    &__lead {
        max-width: 560px;
        margin: 18px 0 0;
        font-size: 15px;
        line-height: 1.55;
        color: var(--glass-text-muted);
    }

    &__controls {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: flex-end;
    }

    &__toggle {
        all: unset;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px;
        background: var(--glass-pane-bg);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: 999px;

        legend {
            font-family: var(--ui-font-mono);
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            padding: 0 10px;
            color: var(--glass-text-muted);
        }
    }

    &__chip {
        all: unset;
        padding: 5px 12px;
        font-size: 12px;
        font-weight: 500;
        border-radius: 999px;
        cursor: pointer;
        color: var(--glass-text-muted);
        transition: color 180ms ease, background 220ms ease;

        &:hover { color: var(--glass-text); }
        &.is-on {
            background: linear-gradient(180deg, color-mix(in srgb, var(--glass-accent) 90%, white 10%), var(--glass-accent));
            color: var(--glass-text-on-tint);
            box-shadow: 0 4px 12px color-mix(in srgb, var(--glass-accent) 30%, transparent);
        }
    }

    // ── Sections ──────────────────────────────────────────────────────
    &__section {
        position: relative;
        z-index: 1;
        margin-bottom: 56px;
    }

    &__sec-head {
        margin-bottom: 22px;

        h2 {
            font-family: var(--ui-font-display);
            font-size: 38px;
            font-weight: 400;
            letter-spacing: -0.015em;
            line-height: 1.05;
            margin: 0 0 6px;
            color: var(--glass-text);

            em {
                font-style: normal;
                font-family: var(--ui-font-mono);
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.08em;
                margin-right: 12px;
                padding: 2px 10px;
                border-radius: 999px;
                background: var(--glass-recessed-bg);
                border: 1px solid var(--glass-border-soft);
                color: var(--glass-text-muted);
                vertical-align: middle;
            }

            small {
                font-family: var(--ui-font);
                font-size: 14px;
                color: var(--glass-text-subtle);
                font-style: italic;
                margin-left: 8px;
            }
        }

        p {
            margin: 0;
            font-size: 14px;
            color: var(--glass-text-muted);
        }
    }

    &__row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 12px;
        margin-bottom: 14px;
    }

    &__col {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1 1 280px;
        min-width: 0;
    }

    &__cols {
        display: flex;
        gap: 28px;
        flex-wrap: wrap;
    }

    &__grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px 28px;
        margin-bottom: 18px;
    }

    &__cell {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    &__cell-label {
        font-family: var(--ui-font-mono);
        font-size: 10.5px;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: var(--glass-text-subtle);
        padding: 0 2px;
    }

    &__cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 18px;
        margin-bottom: 24px;
    }

    &__footer {
        position: relative;
        z-index: 1;
        margin-top: 64px;
        font-family: var(--ui-font-mono);
        font-size: 11.5px;
        color: var(--glass-text-subtle);
        letter-spacing: 0.04em;

        p { margin: 12px 0 0; }
    }

    // ── Sub-tweaks ────────────────────────────────────────────────────
    &__section--ios {
        // The iOS components have their own internal tokens — make sure
        // they sit on something that lets their solid white surfaces shine.
        :deep(.ios-card),
        :deep(.iosCard) {
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
        }
    }
}

@keyframes float {
    from { transform: translate3d(0, 0, 0) scale(1); }
    to   { transform: translate3d(40px, -60px, 0) scale(1.08); }
}
</style>
