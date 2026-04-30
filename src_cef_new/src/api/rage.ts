export const executeClient = (eventName: string, ...args: unknown[]) => {
    if ((window as any).mp !== undefined) {
        ;(window as any).mp.trigger(eventName, ...args)
    }
}

export const invokeMethod = (invokeName: string, ...args: unknown[]) => {
    if ((window as any).mp !== undefined) {
        ;(window as any).mp.invoke(invokeName, ...args)
    }
}

export const executeClientAsync = async (eventName: string, ...args: unknown[]): Promise<unknown> => {
    if ((window as any).mp !== undefined) {
        ;(window as any).mp.trigger(eventName, ...args)
    }
    return null
}
