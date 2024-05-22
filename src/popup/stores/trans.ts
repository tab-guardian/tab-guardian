import type { Messages } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import error from '@common/modules/error'

export const useTransStore = defineStore('trans', () => {
    const lang = ref<string>('en')
    const messages = ref<Messages>({})

    function loadMessages(msgs: Messages): void {
        messages.value = msgs
    }

    function trans(key: string): string {
        const message = messages.value[lang.value]

        if (!message) {
            error.err(`Language ${lang} not found`)
            return key
        }

        const result = message[key]

        if (!result) {
            const m = `Key "${key}" not found in ${lang} language`
            error.warn(m)
            return key
        }

        return result || key
    }

    return {
        trans,
        loadMessages,
    }
})
