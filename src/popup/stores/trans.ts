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
        trans,
        loadMessages,
    }
})
