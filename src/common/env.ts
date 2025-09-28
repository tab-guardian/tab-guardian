import type { EncryptionAlgo } from '@/types'

// Look into .env and .env.example files in the root of the project

export const env = {
    DEV_LOCALE: import.meta.env.VITE_DEV_LOCALE as 'ru' | 'zh_CH' | 'en',
    CURR_ENCRYPT_ALGO: import.meta.env.VITE_CURR_ENCRYPT_ALGO as EncryptionAlgo,
    MIN_PASS_LENGTH: Number(import.meta.env.VITE_MIN_PASS_LENGTH),
}
