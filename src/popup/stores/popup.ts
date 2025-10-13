import type { Popups } from '@common/types'
import { ref } from 'vue'
import { defineStore } from 'pinia'

const defaultPopups: Popups = {
    groupMenuView: { open: false, data: null },
    deleteGroup: { open: false, data: null },
    groupName: { open: false, data: null },
    rebindGroup: { open: false, data: null },
    chooseEmoji: { open: false, data: null },
    chooseImageIcon: { open: false, data: null },
    newPassword: { open: false, data: null },
    enterPassword: { open: false, data: null },
    linkMenuView: { open: false, data: null },
    newGroupName: { open: false, data: null },
    editGroupName: { open: false, data: null },
}

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>(structuredClone(defaultPopups))
    const onCloseCallback = ref<null | ((data?: any) => void)>(null)

    function closeAllPopups(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups].open = false
        }
    }

    function openPopup(key: keyof Popups, onClose?: (data?: any) => void): void {
        popups.value[key].open = true

        if (onClose) {
            onCloseCallback.value = onClose
        }
    }

    function resetGroups(): void {
        popups.value = structuredClone(defaultPopups)
    }

    /**
     * @param data Pass data that you want to pass to onClose callback
     */
    function closePopup(key: keyof Popups, data?: any): void {
        popups.value[key].open = false
        popups.value[key].data = null

        if (data && onCloseCallback.value) {
            onCloseCallback.value(data)
        }
    }

    function isOpenPopup(key: keyof Popups): boolean {
        return popups.value[key].open
    }

    function getSharedData<T>(key: keyof Popups): T | null {
        return popups.value[key].data
    }

    function setSharedData(key: keyof Popups, data: any): void {
        popups.value[key].data = data
    }

    return {
        popups,
        openPopup,
        closePopup,
        closeAllPopups,
        setSharedData,
        getSharedData,
        isOpenPopup,
        resetGroups,
    }
})
