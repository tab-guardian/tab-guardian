import type { EncryptionAlgo } from '@/types'

export const env = {
    DEV_LOCALE: import.meta.env.VITE_DEV_LOCALE as 'ru' | 'zh_CH' | 'en',
    CURR_ENCRYPT_ALGO: import.meta.env.VITE_CURR_ENCRYPT_ALGO as EncryptionAlgo,
    MIN_PASS_LENGTH: import.meta.env.VITE_MIN_PASS_LENGTH,
}
