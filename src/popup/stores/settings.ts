import type { Settings } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import getFromStorage from '@/modules/getFromStorage'
import sha256 from 'crypto-js/sha256'

export const useSettingsStore = defineStore('settings', () => {
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

    function passwordMatches(pass: string): boolean {
        const hashedPass = sha256(pass).toString()
        return hashedPass === settings.value.password
    }

    return {
        settings,
        passwordMatches,
        loadSettingsFromStorage,
    }
})
