import type { Settings } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsModalStore = defineStore('settingsModalStore', () => {
    const isOpen = ref<boolean>(true)
    const settings = ref<Settings | null>(null)

    function openSettings(): void {
        loadSettingsFromStorage()
        isOpen.value = true
    }

    function loadSettingsFromStorage(): void {
        //
    }

    return {
        isOpen,
        settings,
        openSettings,
    }
})
