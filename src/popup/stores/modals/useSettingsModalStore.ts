import type { Settings } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import getFromStorage from '@/modules/getFromStorage'
import saveToStorage from '@/modules/saveToStorage'

export const useSettingsModalStore = defineStore('settingsModalStore', () => {
    const isOpen = ref<boolean>(false)
    const tempPassword = ref<string>('')
    const settings = ref<Settings>({
        password: '',
    })

    // @todo: temporary. Delete in the future
    // openSettings()

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
        saveToStorage<Settings>('settings', {
            ...settings.value,
            password: tempPassword.value,
        })
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
