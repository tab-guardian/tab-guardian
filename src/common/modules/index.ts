import { runtime } from '@common/modules/runtime'
import emojiRegex from 'emoji-regex'

export function trans(msg: string, ...args: string[]): string {
    return runtime.trans(msg, ...args)
}

export function removeTrail(str: string, tail: string): string {
    return str.endsWith(tail) && tail !== '' ? str.slice(0, -tail.length) : str
}

export function limitString(str: string, maxLength = 20) {
    if (str.length <= 3) {
        return str
    }

    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

export function formatNumber(num: number): string {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export function generateGroupId(): number {
    return Date.now() + Math.floor(Math.random() * 1000)
}

export function isEmoji(emoji: string): boolean {
    // Workaround for emojiRegex() treating some emojis as false
    if (['👎️', '👍️'].includes(emoji)) {
        return true
    }

    const regex = emojiRegex()
    const matches = [...emoji.matchAll(regex)]

    // Ensure exactly one match, and no other characters
    return matches.length === 1 && matches[0][0] === emoji.trim()
}

export function downloadFile(text: string, name: string): void {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.bak`
    a.click()

    URL.revokeObjectURL(url)
}

export function logger() {
    if (import.meta.env?.TEST === 'true') {
        return {
            error: () => null,
            info: () => null,
            warn: () => null,
            debug: () => null,
        }
    }

    return {
        error: (...err: any) => console.error('[ERROR]:', ...err),
        info: (...err: any) => console.info('[INFO]:', ...err),
        warn: (...err: any) => console.warn('[WARN]:', ...err),
        debug: (...err: any) => console.debug('[DEBUG]:', ...err),
    }
}
