<script setup lang="ts">
import type { Group } from '@common/types'
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { trans } from '@common/modules/utils'
import { encryptExport } from '@common/modules/webCrypto'
import { getPasswordFromStorage } from '@common/modules/storage/password'
import { showToast } from '@common/modules/toast'
import { toBase64, downloadFile } from '@common/modules/utils'
import { cloneDeep } from 'lodash'
import slug from 'slug'
import pako from 'pako'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const groupStore = useGroupStore()
const popupStore = usePopupStore()

const loading = ref<boolean>(false)

async function exportGroup(): Promise<void> {
    if (loading.value) {
        console.info('Cannot export because export in progress')
        return
    }

    if (!groupStore.selectedGroup) {
        console.error('No group selected to export')
        return
    }

    loading.value = true

    let group = cloneDeep(groupStore.selectedGroup)

    const json = JSON.stringify(group)
    const compressed = toBase64(pako.gzip(json))

    if (!group.isPrivate) {
        await downloadExportFile(compressed, group)
        return
    }

    const pass = await getPasswordFromStorage(group.id)

    if (pass) {
        const encrypted = await encryptExport(compressed, pass)
        await downloadExportFile(encrypted, group)
        return
    }

    showToast(trans('cant_remember_pass'), 'error', 4000)

    popupStore.show('newPassword', {}, async resp => {
        if (resp && resp.newPass) {
            const encrypted = await encryptExport(compressed, resp.newPass)
            await downloadExportFile(encrypted, group)
        }
    })
}

async function downloadExportFile(compressed: string, group: Group): Promise<void> {
    downloadFile(compressed, slug(group.name))

    loading.value = false

    popupStore.hide('groupMenuView', {})
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
