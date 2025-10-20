import type { Popups } from '@common/types/popup'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'

const defaultEmptyPopup = {
    open: false,
    dataOnOpen: null,
    dataOnClose: null,
    onClose: null,
}

const defaultPopups: Popups = {
    groupMenuView: cloneDeep(defaultEmptyPopup),
    confirm: cloneDeep(defaultEmptyPopup),
    groupName: cloneDeep(defaultEmptyPopup),
    bindGroup: cloneDeep(defaultEmptyPopup),
    password: cloneDeep(defaultEmptyPopup),
    linkMenuView: cloneDeep(defaultEmptyPopup),
    editGroupName: cloneDeep(defaultEmptyPopup),
    newPassword: cloneDeep(defaultEmptyPopup),
    chooseEmoji: cloneDeep(defaultEmptyPopup),
    chooseImageIcon: cloneDeep(defaultEmptyPopup),
}

export const usePopupStore = defineStore('popup', () => {
    const popups = ref<Popups>(cloneDeep(defaultPopups))

    function hideAll(): void {
        for (const key in popups.value) {
            popups.value[key as keyof Popups].open = false
        }
    }

    function show<K extends keyof Popups>(
        key: K,
        data: Popups[K]['dataOnOpen'],
    ): Promise<Popups[K]['dataOnClose']> {
        return new Promise(resolve => {
            popups.value[key].open = true
            popups.value[key].dataOnOpen = data

            // Resolve the promise when closed
            popups.value[key].onClose = resolve
        })
    }

    function resetGroups(): void {
        popups.value = cloneDeep(defaultPopups)
    }

    function hide<K extends keyof Popups>(
        key: K,
        onCloseData: Popups[K]['dataOnClose'],
    ): void {
        popups.value[key].open = false
        popups.value[key].dataOnOpen = null
        popups.value[key].dataOnClose = null

        const onClose = popups.value[key].onClose

        if (onCloseData && onClose) {
            onClose(onCloseData)
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
