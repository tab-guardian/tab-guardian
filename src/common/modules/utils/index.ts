import { runtime } from '@common/modules/runtime'
import emojiRegex from 'emoji-regex'

export function trans(msg: string, ...args: string[]): string {
    return runtime.trans(msg, ...args)
}

export const GROUP_ICON_START = [
    'http', // http and https images
    'data:image', // base64 images
    'chrome-extension', // images from chrome storage
    'moz-extension', // images from chrome storage
]

export function limitString(str: string, maxLength = 20) {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str
}

export function formatNumber(num: number): string {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export function generateGroupId(): number {
    return Date.now() + Math.floor(Math.random() * 1000)
}

export function isEmoji(emoji: string): boolean {
    const regex = emojiRegex()
    const matches = [...emoji.matchAll(regex)]

    // Ensure exactly one match, and no other characters
    return matches.length === 1 && matches[0][0] === emoji.trim()
}

/**
 * Converts Uint8Array to Base64 string
 * Or: Converts bytes to Base64 encoded string.
 * Use new TextEncoder().encode() to turn a string to a UTF-8
 * array of bytes.
 */
export function toBase64(arr: Uint8Array): string {
    // Latin-1 encoding covers the 0-255 range
    const latin1String = Array.from(arr)
        .map(byte => String.fromCharCode(byte))
        .join('')

    return btoa(latin1String)
}

/**
 * Decodes Base64 string back to bytes.
 * Use new TextDecoder().decode() to turn it to a UTF-8 string
 */
export function fromBase64(str: string): Uint8Array<ArrayBuffer> {
    return Uint8Array.from(atob(str), c => c.charCodeAt(0))
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
