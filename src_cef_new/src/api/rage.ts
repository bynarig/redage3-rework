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
    const rpc = (window as any).rpc
    if (rpc !== undefined) {
        return await rpc.callClient('rpc.' + eventName, ...args)
    }
    return null
}

let _groupName = ''

export const setGroup = (groupName: string) => {
    _groupName = groupName
}

export const clearGroup = () => {
    _groupName = ''
}

export const executeClientToGroup = (eventName: string, ...args: unknown[]) => {
    if ((window as any).mp !== undefined) {
        ;(window as any).mp.trigger('client' + _groupName + eventName, ...args)
    }
}

export const executeClientAsyncToGroup = async (eventName: string, ...args: unknown[]): Promise<unknown> => {
    const rpc = (window as any).rpc
    if (rpc !== undefined) {
        return await rpc.callClient('rpc' + _groupName + eventName, ...args)
    }
    return null
}
