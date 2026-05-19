// Form-level validation for the player-authentication view.
// The same shape is enforced server-side by @redage/validators on the
// auth-service — we duplicate it here for live UI feedback only.
import { LoginInputSchema, RegisterInputSchema, type LoginInput, type RegisterInput } from '@/api/contracts/auth'

export interface FieldErrors {
    login?: string
    email?: string
    password?: string
    passwordRepeat?: string
}

/** Returns the first error per field, or empty object on full pass. */
export function validateLogin(input: { login: string; password: string }): FieldErrors {
    const parsed = LoginInputSchema.safeParse(input)
    if (parsed.success) return {}
    return mapZodErrors(parsed.error.issues)
}

export function validateRegister(input: {
    login: string
    email: string
    password: string
    passwordRepeat: string
}): FieldErrors {
    const parsed = RegisterInputSchema.safeParse({
        login: input.login,
        email: input.email,
        password: input.password,
    })
    const errors: FieldErrors = parsed.success ? {} : mapZodErrors(parsed.error.issues)
    if (input.password !== input.passwordRepeat) errors.passwordRepeat = 'passwords do not match'
    return errors
}

export function hasErrors(errors: FieldErrors): boolean {
    return Object.values(errors).some((v) => v !== undefined && v !== '')
}

function mapZodErrors(issues: ReadonlyArray<{ path: PropertyKey[]; message: string }>): FieldErrors {
    const out: FieldErrors = {}
    for (const issue of issues) {
        const key = String(issue.path[0] ?? '')
        if (key === 'login' && !out.login) out.login = issue.message
        else if (key === 'email' && !out.email) out.email = issue.message
        else if (key === 'password' && !out.password) out.password = issue.message
    }
    return out
}

export type { LoginInput, RegisterInput }
