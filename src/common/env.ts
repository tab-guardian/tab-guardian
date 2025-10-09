import type { EncryptionAlgo } from '@common/types'

// Look into .env and .env.example files in the root of the project

export const env = {
    DEV_LOCALE: toStr('VITE_DEV_LOCALE') as 'ru' | 'zh_CH' | 'en',
    CURR_ENCRYPT_ALGO: toStr('VITE_CURR_ENCRYPT_ALGO') as EncryptionAlgo,
    MIN_PASS_LENGTH: toNum('VITE_MIN_PASS_LENGTH'),
    PASS_MAX_ATTEMPTS: toNum('VITE_PASS_MAX_ATTEMPTS'),
    PASS_LOCK_DURATION: toNum('VITE_PASS_LOCK_DURATION')
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
