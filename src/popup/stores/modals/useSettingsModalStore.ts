import type { Settings } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import getFromStorage from '@/modules/getFromStorage'
import saveToStorage from '@/modules/saveToStorage'
import sha256 from 'crypto-js/sha256'

export const useSettingsModalStore = defineStore('settingsModalStore', () => {
    const isOpen = ref<boolean>(false)
    const tempPassword = ref<string>('')
    const settings = ref<Settings>({
        password: '',
    })

    function openSettings(): void {
        loadSettingsFromStorage()
        isOpen.value = true
    }

    function loadSettingsFromStorage(): void {
        getFromStorage<Settings | null>('settings', data => {
            if (data) {
                settings.value = data
            }
        })
    }

    function updateSettings(): void {
        saveToStorage<Settings>('settings', settings.value)
    }

    function updatePassword(): void {
        const password = sha256(tempPassword.value).toString()

        saveToStorage<Settings>('settings', {
            ...settings.value, password,
        })

        tempPassword.value = ''
    }

    return {
        isOpen,
        settings,
        tempPassword,
        openSettings,
        updateSettings,
        updatePassword,
    }
})
