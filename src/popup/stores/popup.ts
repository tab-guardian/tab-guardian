import type { Popups } from '@/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

type OnCloseCallback = (popups: Popups) => void

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>({
        groupView: { open: false },
        deleteGroup: { open: false },
        groupName: { open: false },
        enterPassword: {
            open: false,
            password: '',
        },
    })

    const onClose = ref<OnCloseCallback | null>(null)

    function closeAllPopups(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups].open = false
        }
    }

    function openPopup(key: keyof Popups, callback?: OnCloseCallback): void {
        popups.value[key].open = true

        if (callback) {
            onClose.value = callback
        }
    }

    function closePopup(key: keyof Popups): void {
        popups.value[key].open = false

        if (onClose.value) {
            onClose.value(popups.value)
            onClose.value = null
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
    }
})
