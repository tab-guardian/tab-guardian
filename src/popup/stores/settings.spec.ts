// @vitest-environment happy-dom

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { runtime } from '@common/modules/runtime'
import { DEFAULT_SETTINGS, useSettingsStore } from '@/stores/settings'

describe('settings store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    afterEach(() => {
        runtime.sessionStorage.isAvailable = true
    })

    it('rememberPasswordEnabled is true when setting is on and session storage is available', () => {
        const settingsStore = useSettingsStore()
        settingsStore.settings.rememberPasswordAfterUnlock = true

        expect(settingsStore.rememberPasswordEnabled).toBeTruthy()
    })

    it('rememberPasswordEnabled is false when setting is off', () => {
        const settingsStore = useSettingsStore()
        settingsStore.settings.rememberPasswordAfterUnlock = false

        expect(settingsStore.rememberPasswordEnabled).toBeFalsy()
    })

    it('rememberPasswordEnabled is false when session storage is unavailable', () => {
        const settingsStore = useSettingsStore()
        settingsStore.settings.rememberPasswordAfterUnlock = true
        runtime.sessionStorage.isAvailable = false

        expect(settingsStore.rememberPasswordEnabled).toBeFalsy()
    })

    it('resetToDefaults restores every setting', () => {
        const settingsStore = useSettingsStore()

        settingsStore.settings.encryptAfterRestore = false
        settingsStore.settings.rememberPasswordAfterUnlock = false
        settingsStore.settings.overrideWithSameName = true

        settingsStore.resetToDefaults()

        expect(settingsStore.settings).toEqual(DEFAULT_SETTINGS)
    })
})
