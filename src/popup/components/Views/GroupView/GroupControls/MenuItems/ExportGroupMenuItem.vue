<script setup lang="ts">
import type { Group } from '@/types'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { trans } from '@common/modules/trans'
import { error } from '@common/modules/error'
import { encryptGroup } from '@common/modules/encrypt/encryptGroup'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import MenuItem from '@/components/MenuItem.vue'
import { getPasswordFromStorage } from '@common/modules/storage/getPasswordFromStorage'
import { showToast } from '@common/modules/showToast'

const store = useGroupStore()
const { openPopup, closePopup } = usePopupStore()

async function exportGroup(): Promise<void> {
    if (!store.selectedGroup) {
        error.err('No group selected to export')
        return
    }

    let group = Object.assign({}, store.selectedGroup)

    if (group.isPrivate) {
        const encrypted = await encryptPrivateGroup(group)

        if (encrypted) {
            group = encrypted
        }
    }

    const json = JSON.stringify(group)

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tab-group-export.json'
    a.click()

    URL.revokeObjectURL(url)

    closePopup('groupView')
}

async function encryptPrivateGroup(group: Group): Promise<Group | null> {
    const pass = await getPasswordFromStorage(group.id)

    if (!pass) {
        showToast(trans('cant_remember_pass'), 'error', 4000)
        openPopup('newPassword')
        return null
    }

    return encryptGroup(group, pass)
}
</script>

<template>
    <MenuItem
        @click="exportGroup"
        :label="trans('export_this_group')"
        :icon="ArrowDownTrayIcon"
    />
</template>
