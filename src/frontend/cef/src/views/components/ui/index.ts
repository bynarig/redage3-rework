import "./theme.scss"

// ── Glassmorphism Ui* primitives (self-contained, no Nuxt UI dep) ─────────────
export { default as UiButton } from './UiButton.vue'
export { default as UiInput } from './UiInput.vue'
export { default as UiTextarea } from './UiTextarea.vue'
export { default as UiSelect } from './UiSelect.vue'
export { default as UiBadge } from './UiBadge.vue'
export { default as UiCard } from './UiCard.vue'
export { default as UiModal } from './UiModal.vue'
export { default as UiCheckbox } from './UiCheckbox.vue'
export { default as UiToggle } from './UiToggle.vue'
export { default as UiTabs } from './UiTabs.vue'
export { default as UiAlert } from './UiAlert.vue'
export { default as UiAvatar } from './UiAvatar.vue'
export { default as UiSeparator } from './UiSeparator.vue'
export { default as UiTooltip } from './UiTooltip.vue'

// ── iOS-style components (unchanged — these live under ios/) ──────────────────
export { default as IosCard } from './ios/IosCard.vue'
export { default as IosCheckbox } from './ios/IosCheckbox.vue'
export { default as IosListItem } from './ios/IosListItem.vue'
export { default as IosSegmentedControl } from './ios/IosSegmentedControl.vue'
export { default as IosProgressBar } from './ios/IosProgressBar.vue'
export { default as IosSearchField } from './ios/IosSearchField.vue'
export { default as IosStepper } from './ios/IosStepper.vue'
export { default as IosGroupSection } from './ios/IosGroupSection.vue'
export { default as IosTag } from './ios/IosTag.vue'

// AppButton (shared accessory button) doubles as the iOS button surface.
export { default as IosButton } from '../../accessories/shared/components/AppButton.vue'

// ── Type re-exports ───────────────────────────────────────────────────────────
export type { UiButtonColor, UiButtonVariant, UiButtonSize } from './UiButton.vue'
export type { UiInputColor, UiInputVariant, UiInputSize } from './UiInput.vue'
export type { UiTextareaColor, UiTextareaVariant, UiTextareaSize } from './UiTextarea.vue'
export type { UiSelectColor, UiSelectVariant, UiSelectSize } from './UiSelect.vue'
export type { UiBadgeColor, UiBadgeVariant, UiBadgeSize } from './UiBadge.vue'
export type { UiCheckboxColor, UiCheckboxSize } from './UiCheckbox.vue'
export type { UiToggleColor, UiToggleSize } from './UiToggle.vue'
export type { UiTabsColor, UiTabsVariant, UiTabsSize, UiTabsOrientation, UiTabItem } from './UiTabs.vue'
export type { UiAlertColor, UiAlertVariant, UiAlertOrientation } from './UiAlert.vue'
export type { UiAvatarSize, UiAvatarChipPosition, UiAvatarChipColor } from './UiAvatar.vue'
export type { UiSeparatorColor, UiSeparatorType, UiSeparatorSize, UiSeparatorOrientation } from './UiSeparator.vue'
