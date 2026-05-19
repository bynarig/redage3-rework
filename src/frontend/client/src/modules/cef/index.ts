// Main CEF browser bootstrap.
//
// RAGE loads this client bundle, but it does not automatically open the Vue UI.
// The browser must be created from client-side code and pointed at the built
// client_packages/interface/index.html file.

declare const global: {
	mainBrowser?: BrowserMp
}

const INTERFACE_URL = 'package://interface/index.html'

let mainBrowser: BrowserMp | null = null
let browserReady = false
let pendingScripts: string[] = []

function flushPendingScripts(): void {
	if (mainBrowser === null || !browserReady) return

	for (const script of pendingScripts) {
		mainBrowser.execute(script)
	}

	pendingScripts = []
}

function markBrowserReady(): void {
	browserReady = true
	flushPendingScripts()
}

function createMainBrowser(): void {
	if (mainBrowser !== null) {
		mainBrowser.destroy()
	}

	browserReady = false
	mainBrowser = mp.browsers.new(INTERFACE_URL)
	mainBrowser.markAsChat()
	global.mainBrowser = mainBrowser

	mp.gui.chat.show(false)
	mp.gui.cursor.show(true, true)
}

export function executeCef(script: string): void {
	if (mainBrowser !== null && browserReady) {
		mainBrowser.execute(script)
		return
	}

	pendingScripts.push(script)
}

mp.events.add('browserDomReady', (browser: BrowserMp) => {
	if (browser === mainBrowser) {
		markBrowserReady()
	}
})

mp.events.add('browserLoadingFailed', (browser: BrowserMp) => {
	if (browser === mainBrowser) {
		mp.gui.chat.push('[CEF] Failed to load package://interface/index.html')
	}
})

mp.events.add('client:OnBrowserInit', () => {
	markBrowserReady()
	mp.gui.chat.show(false)
	mp.gui.cursor.show(true, true)
})

createMainBrowser()
