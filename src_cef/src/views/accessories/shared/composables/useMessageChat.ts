import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { executeClientToGroup, executeClientAsyncToGroup, executeClient } from '@/api/rage'
import { addListernEvent, hasJsonStructure } from '@/api/functions'
import { format } from '@/api/formatter'
import type { Message, Contact } from '../types/messages'

const INPUT_MAX_LENGTH = 140

export function useMessageChat(selectedNumber: number) {
    const messages = ref<Message[]>([])
    const contactData = ref<Contact>({})
    const inputValue = ref('')
    const isSmile = ref(false)
    const isFocus = ref(false)
    const chatStatus = ref(0)
    const chatElement = ref<HTMLElement | null>(null)
    const inputDiv = ref<HTMLInputElement | null>(null)
    const isLoadMessage = ref(false)

    const chatStatusName = ['', 'Онлайн', 'Был в сети недавно', 'Печатает..']

    let loadMessageTime: ReturnType<typeof setTimeout> | null = null
    let writeTime: ReturnType<typeof setTimeout> | null = null
    let isWrite = false

    const getAvatar = (avatar?: string) => (avatar && avatar.length > 6 ? avatar : '')

    const formatTime = (time?: string | number) => {
        if (!time || time === -1) return ''
        const d = new Date(time as string)
        if (isNaN(d.getTime())) return ''
        const now = new Date()
        const diff = now.getTime() - d.getTime()
        if (diff < 86400000) return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
        return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
    }

    const formatMessage = (text: string) => {
        if (!text) return ''
        return (format('parse', text) as string) ?? text
    }

    const scrollDown = () => {
        nextTick(() => {
            if (chatElement.value) chatElement.value.scrollTop = chatElement.value.scrollHeight
        })
    }

    const onScroll = (e: Event) => {
        const el = e.target as HTMLElement
        if (el.scrollTop === 0 && !isLoadMessage.value && messages.value.length >= 1) {
            isLoadMessage.value = true
            const firstId = messages.value[0]?.Id
            executeClientAsyncToGroup('requestMessages', firstId).then((result) => {
                if (result && typeof result === 'string') {
                    messages.value = [...JSON.parse(result), ...messages.value]
                    loadMessageTime = setTimeout(() => { isLoadMessage.value = false }, 500)
                }
            })
        }
    }

    const getUniqueKey = () => Math.floor(Math.random() * 100000) + 1

    const onSend = (type = 0) => {
        if (!inputValue.value.trim() || inputValue.value.length > INPUT_MAX_LENGTH) return
        const key = getUniqueKey()
        let text = inputValue.value
        if (type === 0) text = format('stringify', text) as string
        messages.value.push({ Key: key, Text: text, Date: -1, Me: true, Type: type, Status: 0, Id: key })
        executeClientToGroup('sendMsg', key, text, type)
        inputValue.value = ''
        executeClientToGroup('draftMessages', '')
        scrollDown()
    }

    const onKeyUp = (e: KeyboardEvent) => { if (e.keyCode === 13) onSend(0) }

    addListernEvent('updMsgStatus', ((key: number, date: string, status: number) => {
        const idx = messages.value.findIndex((m) => m.Key === key)
        if (messages.value[idx]) {
            messages.value[idx].Date = date
            messages.value[idx].Status = status
        }
    }) as (...args: unknown[]) => void)

    addListernEvent('msgAdd', ((text: string, date: string, type: number) => {
        messages.value.push({ Text: text, Date: date, Me: false, Type: type, Status: 1 })
        scrollDown()
    }) as (...args: unknown[]) => void)

    addListernEvent('messageInit', ((result: string) => {
        if (hasJsonStructure(result)) { messages.value = JSON.parse(result); scrollDown() }
    }) as (...args: unknown[]) => void)

    addListernEvent('phoneChatUpdStatus', ((id: number) => { chatStatus.value = id }) as (...args: unknown[]) => void)

    const sendImage = (link: string) => {
        if (!link) return
        inputValue.value = link
        onSend(2)
    }

    addListernEvent('cameraLink', sendImage as (...args: unknown[]) => void)

    const sendGeo = () => {
        executeClientAsyncToGroup('getPosition').then((result) => {
            if (result && typeof result === 'string') {
                const pos = JSON.parse(result)
                inputValue.value = JSON.stringify([pos.x, pos.y])
                onSend(1)
            }
        })
    }

    const onMapClick = (msg: Message) => {
        if (msg.Type === 1) {
            try {
                const pos = JSON.parse(msg.Text)
                executeClient('createWaypoint', pos[0], pos[1])
            } catch {}
        }
    }

    const onStartWrite = () => {
        if (!isWrite) { isWrite = true; executeClientToGroup('startWrite') }
        if (writeTime !== null) clearTimeout(writeTime)
        writeTime = setTimeout(() => onEndWrite(), 10000)
    }

    const onEndWrite = (isTime = true) => {
        if (isWrite) { isWrite = false; executeClientToGroup('endWrite') }
        if (!isTime && writeTime !== null) clearTimeout(writeTime)
        writeTime = null
    }

    const onFocus = () => { isSmile.value = false; isFocus.value = true; executeClientToGroup('inputFocus', true) }
    const onBlur = () => { isFocus.value = false; executeClientToGroup('inputFocus', false); onEndWrite(false) }
    const onInput = () => { if (!isFocus.value) return; onStartWrite(); executeClientToGroup('draftMessages', inputValue.value) }

    const addSmile = (smile: string) => {
        isSmile.value = false
        inputValue.value += smile
        nextTick(() => inputDiv.value?.focus())
    }

    const onContact = () => executeClientToGroup('messageDefault', selectedNumber)

    onMounted(() => {
        executeClientAsyncToGroup('getDraftMessages', selectedNumber).then((result) => {
            if (result && typeof result === 'string') inputValue.value = result
        })
        executeClientAsyncToGroup('getContact', selectedNumber).then((result) => {
            if (hasJsonStructure(result as string)) contactData.value = JSON.parse(result as string)
        })
        executeClientAsyncToGroup('getMessage', selectedNumber).then((result) => {
            if (hasJsonStructure(result as string)) { messages.value = JSON.parse(result as string); scrollDown() }
        })
        executeClientToGroup('getPhoneChatStatus', selectedNumber)
    })

    onUnmounted(() => {
        if (loadMessageTime !== null) clearTimeout(loadMessageTime)
        onEndWrite(false)
        executeClientToGroup('inputFocus', false)
        executeClientToGroup('closeMessage')
    })

    return {
        messages,
        contactData,
        inputValue,
        isSmile,
        chatStatus,
        chatStatusName,
        chatElement,
        inputDiv,
        INPUT_MAX_LENGTH,
        getAvatar,
        formatTime,
        formatMessage,
        onScroll,
        onSend,
        onKeyUp,
        sendGeo,
        onMapClick,
        onFocus,
        onBlur,
        onInput,
        addSmile,
        onContact,
    }
}
