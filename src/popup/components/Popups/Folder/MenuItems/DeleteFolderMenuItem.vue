<script setup lang="ts">
import type { Folder } from '@common/types'
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'
import { trans } from '@common/modules'
import { useRouter } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import { useFolderStore } from '@/stores/folder'

const props = defineProps<{ folder: Folder }>()

const router = useRouter()
const popupStore = usePopupStore()
const folderStore = useFolderStore()

async function promptToDeleteFolder(): Promise<void> {
    popupStore.hide('folderMenu', {})

    const resp = await popupStore.show('confirm', {
        title: trans('want_delete_folder'),
    })

    if (resp && resp.isConfirmed) {
        await deleteFolder()
    }
}

async function deleteFolder(): Promise<void> {
    await folderStore.deleteFolder(props.folder.id)
    await router.push({ name: 'main' })
}
</script>

<template>
    <MenuItem
        @click="promptToDeleteFolder"
        :label="trans('delete')"
        :icon="TrashIcon"
        :class="[
            'text-red-500 border-red-500!',
            'hover:text-red-600! hover:border-red-600!',
        ]"
    />
</template>
