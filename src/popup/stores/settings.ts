import type { Settings } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getFromStorage, saveToStorage } from '@common/modules/storage'

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref<Settings>({
        encryptAfterRestore: true,
        showPrivateGroupsOnlyInIncognito: false,
        overrideWithSameName: false,
        showOnlyPrivateGroupsInIncognito: false,
        rememberPasswordAfterUnlock: true,
    })

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

    function updateSettings(): void {
        saveToStorage<Settings>('settings', settings.value)
    }

    return {
        settings,
        loading,
        loadSettingsFromStorage,
        updateSettings,
    }
})
