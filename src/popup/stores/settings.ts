import type { Settings } from '@common/types'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { runtime } from '@common/modules/runtime'

// The settings a user gets on a fresh install, and the fallback for any key
// missing from their saved settings (load() merges the saved object over these).
// Changing a value here changes real app behavior for those users, so treat it
// as a deliberate product decision, not a tweak.
//
// These are also the reference values tests reset to: call resetToDefaults()
// before a test, then override only the specific fields that test cares about.
// Never change a default just to make a test pass.
export const DEFAULT_SETTINGS: Settings = {
    encryptAfterRestore: true,
    showPrivateGroupsOnlyInIncognito: false,
    overrideWithSameName: false,
    showOnlyPrivateGroupsInIncognito: false,
    rememberPasswordAfterUnlock: true,
}

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref<Settings>(structuredClone(DEFAULT_SETTINGS))

    const loading = ref<boolean>(false)

    const rememberPasswordEnabled = computed<boolean>(() => {
        return (
            settings.value.rememberPasswordAfterUnlock &&
            runtime.sessionStorage.isAvailable
        )
    })

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

    function resetToDefaults(): void {
        settings.value = structuredClone(DEFAULT_SETTINGS)
    }

    return {
        settings,
        loading,
        rememberPasswordEnabled,
        save,
        load,
        resetToDefaults,
    }
})
