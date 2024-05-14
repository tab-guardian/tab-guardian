import type { Popups } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>({
        groupView: false,
        deleteGroup: false,
        groupName: false,
    })

    function closeAllPopups(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups] = false
        }
    }

    function openPopup(key: keyof Popups): void {
        popups.value[key] = true
    }

    function closePopup(key: keyof Popups): void {
        popups.value[key] = false
    }

    function isOpenPopup(key: keyof Popups): boolean {
        return popups.value[key]
    }

    return {
        openPopup,
        closePopup,
        closeAllPopups,
        isOpenPopup,
    }
})
