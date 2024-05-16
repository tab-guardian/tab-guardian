import type { Messages } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import en from '@settings/locales/en.json'
import ru from '@settings/locales/ru.json'
import translate from '@common/modules/translate'

export const useTransStore = defineStore('trans', () => {
    const lang = ref<string>('en')
    const messages = ref<Messages>({ en, ru })

    function trans(key: string): string {
        return translate(key, messages.value, lang.value)
    }

    return {
        trans,
    }
})
