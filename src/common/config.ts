import type { EncryptionAlgo, Locale } from '@common/types'

// Look into .env and .env.example files in the root of the project

export const config = {
    DEV_LOCALE: toStr('VITE_DEV_LOCALE') as Locale,
    CURR_ENCRYPT_ALGO: toStr('VITE_CURR_ENCRYPT_ALGO') as EncryptionAlgo,
    MIN_PASS_LENGTH: toNum('VITE_MIN_PASS_LENGTH'),
    PASS_MAX_ATTEMPTS: toNum('VITE_PASS_MAX_ATTEMPTS'),
    PASS_LOCK_DURATION: toNum('VITE_PASS_LOCK_DURATION'),
    GROUP_ICON_START: [
        'http', // http and https images
        'data:image', // base64 images
        'chrome-extension', // images from chrome storage
        'moz-extension', // images from chrome storage
    ],
    NEW_TAB_URLS: [
        'about:newtab',
        'about:blank',
        'about:home',
        'about:privatebrowsing',
        'chrome://newtab/',
    ],
}

function toStr(inpKey: string): string {
    const inp = import.meta.env[inpKey]
    throwIfNotExist(inp, inpKey)
    return inp
}

function toNum(inpKey: string): number {
    const inp = import.meta.env[inpKey]
    throwIfNotExist(inp, inpKey)
    return Number(inp)
}

function throwIfNotExist(inp: any, inpKey: string): void {
    if (typeof inp === undefined) {
        throw new Error(`Env variable ${inpKey} is undefined`)
    }

    if (typeof inp === null) {
        throw new Error(`Env variable ${inpKey} is null`)
    }
}
