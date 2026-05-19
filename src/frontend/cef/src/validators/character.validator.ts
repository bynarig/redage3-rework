// Form-level validation for character creation + customization wizard.
import { CreateCharacterInputSchema, AppearanceSchema, type Appearance } from '@/api/contracts/character'

export interface CharacterFormErrors {
    firstname?: string
    lastname?: string
    gender?: string
}

export function validateCreateCharacter(input: {
    firstname: string
    lastname: string
    gender: string
}): CharacterFormErrors {
    const parsed = CreateCharacterInputSchema.safeParse(input)
    if (parsed.success) return {}
    const errors: CharacterFormErrors = {}
    for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '')
        if (key === 'firstname' && !errors.firstname) errors.firstname = issue.message
        else if (key === 'lastname' && !errors.lastname) errors.lastname = issue.message
        else if (key === 'gender' && !errors.gender) errors.gender = issue.message
    }
    return errors
}

export function validateAppearance(input: Appearance): { ok: boolean; error?: string } {
    const parsed = AppearanceSchema.safeParse(input)
    if (parsed.success) return { ok: true }
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'invalid appearance' }
}

export function hasCharacterErrors(errors: CharacterFormErrors): boolean {
    return Object.values(errors).some((v) => v !== undefined && v !== '')
}
