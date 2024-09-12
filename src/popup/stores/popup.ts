import type { Popups } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const defaultPopups: Popups = {
    groupView: false,
    deleteGroup: false,
    groupName: false,
    rebindGroup: false,
    chooseEmoji: false,
}

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>(structuredClone(defaultPopups))
    const onSubmit = ref<((data?: any) => void) | null>(null)

    function closeAllPopups(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups] = false
        }
    }

    function openPopup(key: keyof Popups, callback?: (data?: any) => void): void {
        popups.value[key] = true

        if (callback) {
            onSubmit.value = callback
        }
    }

    function resetGroups(): void {
        popups.value = structuredClone(defaultPopups)
    }

    function closePopup(key: keyof Popups): void {
        popups.value[key] = false
    }

    function submitPopup(key: keyof Popups, data?: any): void {
        closePopup(key)

        if (onSubmit.value) {
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
        submitPopup,
        resetGroups,
    }
})
