<script setup lang="ts">
import type { Folder } from '@common/types'
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'
import { trans } from '@common/modules'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { useFolderStore } from '@/stores/folder'

const props = defineProps<{ folder: Folder }>()

const router = useRouter()
const modalStore = useModalStore()
const folderStore = useFolderStore()

async function promptToDeleteFolder(): Promise<void> {
    modalStore.hide('folderMenu', {})

    const resp = await modalStore.show('confirm', {
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
