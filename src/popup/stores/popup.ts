import type { Popups } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const defaultPopups: Popups = {
    groupView: false,
    deleteGroup: false,
    groupName: false,
    rebindGroup: false,
    chooseEmoji: false,
    chooseImageIcon: false,
    newPassword: false,
}

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>(structuredClone(defaultPopups))
    const onSubmit = ref<((data?: any) => void) | null>(null)

    function closeAllPopups(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups] = false
        }
    }

    function openPopup(key: keyof Popups, submitCallback?: (data?: any) => void): void {
        popups.value[key] = true

        if (submitCallback) {
            onSubmit.value = submitCallback
        }
    }

    function resetGroups(): void {
        popups.value = structuredClone(defaultPopups)
    }

    function closePopup(key: keyof Popups, data?: any): void {
        popups.value[key] = false

        if (data && onSubmit.value) {
            onSubmit.value(data)
            onSubmit.value = null
        }
    }

    function isOpenPopup(key: keyof Popups): boolean {
        return popups.value[key]
    }

    return {
        popups,
        openPopup,
        closePopup,
        closeAllPopups,
        isOpenPopup,
        resetGroups,
    }
})
