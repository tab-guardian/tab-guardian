import type { Settings } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { runtime } from '@common/modules/runtime'

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref<Settings>({
        encryptAfterRestore: true,
        showPrivateGroupsOnlyInIncognito: false,
        overrideWithSameName: false,
        showOnlyPrivateGroupsInIncognito: false,
        rememberPasswordAfterUnlock: true,
    })

    const loading = ref<boolean>(false)

    async function load(): Promise<void> {
        loading.value = true

        const results = await runtime.storage.get<Settings>('settings')

        if (results.length === 1) {
            settings.value = {
                ...settings.value,
                ...results[0],
            }
        }

        loading.value = false
    }

    function save(): void {
        runtime.storage.set<Settings>('settings', settings.value)
    }

    return {
        settings,
        loading,
        save,
        load,
    }
})
