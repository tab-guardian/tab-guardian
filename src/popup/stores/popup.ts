import type { Popups } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

type OnCloseCallback = (popups: Popups) => void

const defaultPopups: Popups = {
    groupView: { open: false },
    deleteGroup: { open: false },
    groupName: { open: false },
    enterPassword: {
        open: false,
        passwords: {},
    },
}

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>(structuredClone(defaultPopups))
    const onSubmit = ref<OnCloseCallback | null>(null)

    function closeAllPopups(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups].open = false
        }
    }

    function openPopup(key: keyof Popups, callback?: OnCloseCallback): void {
        popups.value[key].open = true

        if (callback) {
            onSubmit.value = callback
        }
    }

    function resetGroups(): void {
        popups.value = structuredClone(defaultPopups)
    }

    function closePopup(key: keyof Popups): void {
        popups.value[key].open = false
    }

    function submitPopup(key: keyof Popups): void {
        closePopup(key)

        if (onSubmit.value) {
            onSubmit.value(popups.value)
            onSubmit.value = null
        }
    }

    function isOpenPopup(key: keyof Popups): boolean {
        return popups.value[key].open
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
