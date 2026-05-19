const VK_UP = 0x26

interface ChatApi {
	show(visible: boolean): void
	activate?: (active: boolean) => void
}

interface CursorApi {
	visible: boolean
	show(visible: boolean, toggleControls: boolean): void
}

interface KeyApi {
	bind?: (keyCode: number, keyDown: boolean, handler: () => void) => void
}

function chat(): ChatApi {
	return mp.gui.chat as unknown as ChatApi
}

function cursor(): CursorApi {
	return mp.gui.cursor as unknown as CursorApi
}

function keys(): KeyApi {
	return mp.keys as unknown as KeyApi
}

function deactivateBuiltInChat(): void {
	const api = chat()
	api.show(false)
	if (typeof api.activate === 'function') api.activate(false)
}

function toggleCursor(): void {
	const api = cursor()
	const nextVisible = !api.visible
	api.show(nextVisible, nextVisible)
	api.visible = nextVisible
}

deactivateBuiltInChat()

const keyApi = keys()
if (typeof keyApi.bind === 'function') {
	keyApi.bind(VK_UP, true, toggleCursor)
}

mp.events.add('redage.system.chat.disable', () => {
	deactivateBuiltInChat()
})

export {}
