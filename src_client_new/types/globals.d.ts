// RAGE:MP V8 runtime globals not covered by @ragempcommunity/types-client.
// The client V8 engine exposes standard timer functions even though there is no DOM.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function setTimeout(callback: (...args: any[]) => void, ms?: number): number
declare function clearTimeout(id: number): void
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function setInterval(callback: (...args: any[]) => void, ms?: number): number
declare function clearInterval(id: number): void
