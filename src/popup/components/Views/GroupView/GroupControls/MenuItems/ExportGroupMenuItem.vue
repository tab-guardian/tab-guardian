<script setup lang="ts">
import type { Group } from '@/types'
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import error from '@common/modules/error'
import encryptGroup from '@common/modules/encrypt/encryptGroup'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const store = useGroupStore()
const { trans } = useTransStore()
const popupsStore = usePopupStore()

function exportGroup(): void {
    if (!store.selectedGroup) {
        error.err('No group selected to export')
        return
    }

    let group = Object.assign({}, store.selectedGroup)

    if (group.isPrivate) {
        group = encryptPrivateGroup(group)
    }

    const json = JSON.stringify(group)

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tab-group-export.json'
    a.click()

    URL.revokeObjectURL(url)

    popupsStore.closePopup('groupView')
}

function encryptPrivateGroup(group: Group): Group {
    const pass = popupsStore.popups.enterPassword.passwords[group.id]

    if (!pass) {
        throw new Error('No password found for group')
    }

    return encryptGroup(group, pass)
}
</script>

<template>
    <MenuItem
        @click="exportGroup"
        :label="trans('Export this group')"
        :icon="ArrowDownTrayIcon"
    />
</template>
