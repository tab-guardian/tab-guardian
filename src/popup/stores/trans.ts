import type { Messages } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import error from '@common/modules/error'
import saveToStorage from '@common/modules/storage/saveToStorage'
import getFromStorage from '@common/modules/storage/getFromStorage'

const DEFAULT_LANG = 'en'

export const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
]

export const useTransStore = defineStore('trans', () => {
    const lang = ref<string>(DEFAULT_LANG)
    const messages = ref<Messages>({})

    async function init(): Promise<void> {
        const savedLang = await getFromStorage<string>('lang')

        if (savedLang) {
            lang.value = savedLang
            return
        }

        setBrowserLang()
    }

    function setBrowserLang(): void {
        const browserLang = navigator.language.slice(0, 2)
        const isLangSupported = languages.some(l => l.code === browserLang)

        if (isLangSupported) {
            lang.value = browserLang
            return
        }

        error.info(`Language ${browserLang} is not supported by the extension`)
    }

    async function loadMessages(msgs: Messages): Promise<void> {
        messages.value = msgs
        await init()
    }

    function changeLang(l: string): void {
        if (!l) {
            error.err('Language not set')
            return
        }

        lang.value = l
        saveToStorage('lang', l)
    }

    function trans(key: string, ...args: string[]): string {
        const message = messages.value[lang.value]

        if (!message) {
            error.err(`Language ${lang.value} not found`)
            return key
        }

        let result = message[key]

        if (!result) {
            const m = `Key "${key}" not found in ${lang.value} language`
            error.warn(m)
            return key
        }

        for (let i = 0; i < args.length; i++) {
            result = result.replaceAll(':n', args[i])
        }

        return result || key
    }

    return {
        lang,
        trans,
        changeLang,
        loadMessages,
    }
})
