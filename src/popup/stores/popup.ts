import type { Popups } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

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

    function closeAllPopups(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups].open = false
        }
    }

    function openPopup(key: keyof Popups): void {
        popups.value[key].open = true
    }

    function closePopup(key: keyof Popups): void {
        popups.value[key].open = false
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
