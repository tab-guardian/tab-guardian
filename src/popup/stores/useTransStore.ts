import type { Messages } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'

export const useTransStore = defineStore('transStore', () => {
    const lang = ref<string>('en')
    const messages = ref<Messages>({ en, ru })

    function trans(key: string): string {
        const message = messages.value[lang.value]

        if (!message) {
            console.error(`Language ${lang.value} not found`)
            return key
        }

        const result = message[key]

        if (!result) {
            console.warn(`[Tab Guardian]: Key "${key}" not found in ${lang.value} language`)
            return key
        }

        return result || key
    }

    return {
        trans,
    }
})
