import type { Messages } from '@/types'
import error from '@common/modules/error'

export default (key: string, messages: Messages, lang: string): string => {
    const message = messages[lang]

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
