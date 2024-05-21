import type { Settings } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useTransStore } from '@settings/stores/trans'
import getFromStorage from '@common/modules/storage/getFromStorage'
import saveToStorage from '@common/modules/storage/saveToStorage'
import sha256 from 'crypto-js/sha256'
import showToast from '@common/modules/showToast'
import getDefaultSettings from '@common/modules/getDefaultSettings'

export const useMainStore = defineStore('main', () => {
    const { trans } = useTransStore()

    const settings = ref<Settings>(getDefaultSettings())
    const loading = ref<boolean>(true)

    async function loadSettingsFromStorage(): Promise<void> {
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
        showToast(trans('Settings have been updated'))
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

    function changePassword(oldPass: string, newPass: string): boolean {
        if (passwordMatches(oldPass)) {
            updatePassword(newPass)
            return true
        }

        return false
    }

    return {
        settings,
        loading,
        updateSettings,
        passwordMatches,
        updatePassword,
        changePassword,
        loadSettingsFromStorage,
    }
})
