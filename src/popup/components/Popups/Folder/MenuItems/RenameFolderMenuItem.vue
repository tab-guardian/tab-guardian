<script setup lang="ts">
import type { Folder } from '@common/types'
import { usePopupStore } from '@/stores/popup'
import { getDefaultName, trans } from '@common/modules'
import { folderStorage } from '@common/modules/storage/folder'
import { useFolderStore } from '@/stores/folder'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const popupStore = usePopupStore()
const folderStore = useFolderStore()

const props = defineProps<{ folder: Folder }>()

async function startRenaming(): Promise<void> {
    popupStore.hide('folderMenu', {})

    const res = await popupStore.show('textInput', {
        text: props.folder.name,
        label: trans('folder_name'),
        title: trans('enter_folder_name'),
        submitText: trans('save'),
    })

    if (!res || res.canceled) {
        return
    }

    const folderName = res.name || getDefaultName('Folder')
    await folderStorage.rename(props.folder.id, folderName)

    await folderStore.load()
}
</script>

<template>
    <MenuItem
        @click="startRenaming"
        :label="trans('rename')"
        :icon="PencilSquareIcon"
    />
</template>
