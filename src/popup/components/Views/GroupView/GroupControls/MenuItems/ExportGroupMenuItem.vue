<script setup lang="ts">
import type { Group } from '@common/types'
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { trans } from '@common/modules/utils'
import { useCryptoStore } from '@/stores/crypto'
import { getPasswordFromStorage } from '@common/modules/storage/password'
import { showToast } from '@common/modules/showToast'
import { cloneDeep } from 'lodash'
import slug from 'slug'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const store = useGroupStore()
const cryptoStore = useCryptoStore()
const { openPopup, closePopup } = usePopupStore()

const loading = ref<boolean>(false)

async function exportGroup(): Promise<void> {
    if (loading.value) {
        console.info('Cannot export because export in progress')
        return
    }

    if (!store.selectedGroup) {
        console.error('No group selected to export')
        return
    }

    loading.value = true

    let group = cloneDeep(store.selectedGroup)

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
    a.download = `tg-${slug(group.name)}.json`
    a.click()

    URL.revokeObjectURL(url)

    loading.value = false

    closePopup('groupMenuView')
}

async function encryptPrivateGroup(group: Group): Promise<Group | null> {
    const pass = await getPasswordFromStorage(group.id)

    if (!pass) {
        showToast(trans('cant_remember_pass'), 'error', 4000)
        openPopup('newPassword')
        return null
    }

    return await cryptoStore.encryptGroup(group, pass)
}
</script>

<template>
    <MenuItem
        @click="exportGroup"
        :label="trans('export_this_group')"
        :icon="ArrowDownTrayIcon"
        :loading
    />
</template>
