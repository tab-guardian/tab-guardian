<script setup lang="ts">
import type { Group } from '@common/types'
import { ref } from 'vue'
import { usePopupStore } from '@/stores/popup'
import { trans, downloadFile } from '@common/modules'
import { encryptExport } from '@common/modules/webCrypto'
import { getPasswordFromStorage } from '@common/modules/storage/password'
import { showToast } from '@common/modules/toast'
import { toBase64 } from '@common/modules/base64'
import { cloneDeep } from 'lodash'
import slug from 'slug'
import pako from 'pako'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const props = defineProps<{ group: Group }>()

const popupStore = usePopupStore()

const loading = ref<boolean>(false)

async function exportGroup(): Promise<void> {
    if (loading.value) {
        console.info('Cannot export because export in progress')
        return
    }

    loading.value = true

    let group = cloneDeep(props.group)

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

    showToast({ text: trans('enter_your_password'), duration: 4000 })

    const resp = await popupStore.show('newPassword', {})
    const newPass = resp?.newPass

    if (newPass) {
        const encrypted = await encryptExport(compressed, newPass)
        await downloadExportFile(encrypted, group)
    }
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
        :label="trans('export')"
        :icon="ArrowDownTrayIcon"
        :loading
    />
</template>
