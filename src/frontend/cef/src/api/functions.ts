import { getCurrentInstance, onUnmounted } from 'vue'

declare global {
    interface Window {
        listernEvent?: (eventName: string, ...args: unknown[]) => void
        functionList?: Record<string, (...args: unknown[]) => void>
    }
}

window.listernEvent = (eventName: string, ...args: unknown[]) => {
    try {
        if (typeof window.functionList?.[eventName] === 'function') {
            window.functionList[eventName](...args)
        }
    } catch {}
}

export const addListernEvent = (eventName: string, func: (...args: unknown[]) => void) => {
    if (typeof window.functionList !== 'object') {
        window.functionList = {}
    }

    window.functionList[eventName] = func

    if (getCurrentInstance()) {
        onUnmounted(() => {
            delete window.functionList?.[eventName]
        })
    }
}

export const hasJsonStructure = (str: unknown): boolean => {
    if (typeof str !== 'string') return false
    try {
        const result = JSON.parse(str)
        const type = Object.prototype.toString.call(result)
        return type === '[object Object]' || type === '[object Array]'
    } catch {
        return false
    }
}
