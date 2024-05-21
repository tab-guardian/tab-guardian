import type { Settings } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import getFromStorage from '@common/modules/storage/getFromStorage'
import getDefaultSettings from '@common/modules/getDefaultSettings'

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref<Settings>(getDefaultSettings())
    const loading = ref<boolean>(false)

    async function loadSettingsFromStorage(): Promise<void> {
        loading.value = true

        const data = await getFromStorage<Settings | null>('settings')

        if (data) {
            settings.value = {
                ...settings.value,
                ...data,
            }
        }

        loading.value = false
    }

    return {
        settings,
        loading,
        loadSettingsFromStorage,
    }
})
