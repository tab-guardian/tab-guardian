import type { Popups } from '@/types'
import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

const defaultPopups: Popups = {
    groupMenuView: false,
    deleteGroup: false,
    groupName: false,
    rebindGroup: false,
    chooseEmoji: false,
    chooseImageIcon: false,
    newPassword: false,
    tabMenuView: false,
}

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>(structuredClone(defaultPopups))
    const sharedData = ref<any>(null)
    const onCloseCallback = ref<null | ((data?: any) => void)>(null)

    function closeAllPopups(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups] = false
        }
    }

    function openPopup(key: keyof Popups, data?: any): void {
        popups.value[key] = true

        if (data) {
            sharedData.value = data
        }
    }

    function resetGroups(): void {
        popups.value = structuredClone(defaultPopups)
    }

    function onClose(callback: (data?: any) => void): void {
        onCloseCallback.value = callback
    }

    /**
     * @param data Pass data that you want to pass to onClose callback
     */
    function closePopup(key: keyof Popups, data?: any): void {
        popups.value[key] = false
        sharedData.value = null

        if (data && onCloseCallback.value) {
            onCloseCallback.value(data)
        }
    }

    function isOpenPopup(key: keyof Popups): boolean {
        return popups.value[key]
    }

    function getSharedData<T>(): T | null {
        return sharedData.value
    }

    return {
        popups,
        openPopup,
        closePopup,
        onClose,
        closeAllPopups,
        getSharedData,
        isOpenPopup,
        resetGroups,
    }
})
