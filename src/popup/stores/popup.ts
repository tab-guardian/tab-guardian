import type { Popups } from '@common/types/popup'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'

const defaultEmptyPopup = {
    open: false,
    dataOnOpen: null,
    dataOnClose: null,
}

const defaultPopups: Popups = {
    groupMenuView: cloneDeep(defaultEmptyPopup),
    confirm: cloneDeep(defaultEmptyPopup),
    groupName: cloneDeep(defaultEmptyPopup),
    rebindGroup: cloneDeep(defaultEmptyPopup),
    enterPassword: cloneDeep(defaultEmptyPopup),
    linkMenuView: cloneDeep(defaultEmptyPopup),
    newGroupName: cloneDeep(defaultEmptyPopup),
    editGroupName: cloneDeep(defaultEmptyPopup),
    newPassword: cloneDeep(defaultEmptyPopup),
    chooseEmoji: cloneDeep(defaultEmptyPopup),
    chooseImageIcon: cloneDeep(defaultEmptyPopup),
}

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>(cloneDeep(defaultPopups))
    const onCloseCallback = ref<null | (<T>(data: T) => void)>(null)

    function hideAll(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups].open = false
        }
    }

    function show<K extends keyof Popups>(
        key: K,
        data: Popups[K]['dataOnOpen'],
        onClose?: (data: Popups[K]['dataOnClose']) => void,
    ): void {
        popups.value[key].open = true
        popups.value[key].dataOnOpen = data

        if (onClose) {
            onCloseCallback.value = onClose
        }
    }

    function resetGroups(): void {
        popups.value = cloneDeep(defaultPopups)
    }

    /**
     * @param data Pass data that you want to pass to onClose callback
     */
    function hide<K extends keyof Popups>(
        key: K,
        onCloseData: Popups[K]['dataOnClose'],
    ): void {
        popups.value[key].open = false
        popups.value[key].dataOnOpen = null
        popups.value[key].dataOnClose = null

        if (onCloseData && onCloseCallback.value) {
            onCloseCallback.value(onCloseData)
        }
    }

    function isPopupVisible(key: keyof Popups): boolean {
        return popups.value[key].open
    }

    function getSharedData<K extends keyof Popups>(key: K): Popups[K]['dataOnOpen'] {
        return popups.value[key].dataOnOpen
    }

    return {
        popups,
        show,
        hide,
        hideAll,
        getSharedData,
        isPopupVisible,
        resetGroups,
    }
})
