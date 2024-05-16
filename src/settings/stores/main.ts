import type { Settings } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import getFromStorage from '@common/modules/storage/getFromStorage'
import saveToStorage from '@common/modules/storage/saveToStorage'
import sha256 from 'crypto-js/sha256'

export const useMainStore = defineStore('main', () => {
    const settings = ref<Settings>({
        password: '',
    })

    function loadSettingsFromStorage(): void {
        getFromStorage<Settings | null>('settings', data => {
            if (data) {
                settings.value = {
                    ...settings.value,
                    ...data,
                }
            }
        })
    }

    function updateSettings(): void {
        saveToStorage<Settings>('settings', settings.value)
    }

    function passwordMatches(pass: string): boolean {
        const hashedPass = sha256(pass).toString()

        return hashedPass === settings.value.password
    }

    function updatePassword(pwd: string): void {
        const password = sha256(pwd).toString()

        settings.value.password = password

        saveToStorage<Settings>('settings', {
            ...settings.value,
            password,
        })
    }

    return {
        settings,
        updateSettings,
        passwordMatches,
        updatePassword,
        loadSettingsFromStorage,
    }
})
