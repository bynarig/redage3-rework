import { ref, readonly } from 'vue'
import { executeClient } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { AuthReplySchema, type AccountSummary } from '@/api/contracts/auth'

/**
 * Auth composable backed by the server-side gateway.
 *
 *   const { account, loading, error, login, register } = useAuth()
 *   await login('joe', 'secret')
 *
 * Replies arrive asynchronously over the `redage:auth:reply` event
 * (client -> CEF via the `listernEvent` bridge). We keep a single
 * pending-promise so concurrent calls don't cross wires.
 */
const account = ref<AccountSummary | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
let pending: ((ok: boolean) => void) | null = null

addListernEvent('redage:auth:reply', (rawReply: unknown) => {
    const parsed = AuthReplySchema.safeParse(rawReply)
    loading.value = false
    if (!parsed.success) {
        error.value = 'invalid server reply'
        pending?.(false)
        pending = null
        return
    }
    const reply = parsed.data
    if (reply.ok && reply.account) {
        account.value = reply.account
        error.value = null
        pending?.(true)
    } else {
        error.value = reply.error ?? 'login failed'
        pending?.(false)
    }
    pending = null
})

function call(eventName: string, ...args: unknown[]): Promise<boolean> {
    if (pending) {
        // The contract is one-in-flight at a time — UI should disable the
        // submit button while loading. If we hit this we drop the new call
        // rather than confuse the previous one.
        return Promise.resolve(false)
    }
    loading.value = true
    error.value = null
    return new Promise<boolean>((resolve) => {
        pending = resolve
        executeClient(eventName, ...args)
    })
}

export function useAuth() {
    return {
        account: readonly(account),
        loading: readonly(loading),
        error: readonly(error),
        login: (loginName: string, password: string) => call('redage.auth.login', loginName, password),
        register: (loginName: string, email: string, password: string) =>
            call('redage.auth.register', loginName, email, password),
    }
}
