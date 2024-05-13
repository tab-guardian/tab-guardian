import type { Messages } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import en from '@/locales/en.json'
import ru from '@/locales/ru.json'
import error from '@/modules/error'

export const useTransStore = defineStore('trans', () => {
    const lang = ref<string>('en')
    const messages = ref<Messages>({ en, ru })

    function trans(key: string): string {
        const message = messages.value[lang.value]

        if (!message) {
            error.err(`Language ${lang.value} not found`)
            return key
        }

        const result = message[key]

        if (!result) {
            error.warn(`Key "${key}" not found in ${lang.value} language`)
            return key
        }

        return result || key
    }

    return {
        trans,
    }
})
