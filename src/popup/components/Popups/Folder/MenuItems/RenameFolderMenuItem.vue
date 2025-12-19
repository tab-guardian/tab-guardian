<script setup lang="ts">
import { usePopupStore } from '@/stores/popup'
import { trans } from '@common/modules'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const popupStore = usePopupStore()

async function startRenaming(): Promise<void> {
    popupStore.hide('folderMenu', {})

    const res = await popupStore.show('textInput', {
        label: trans('folder_name'),
        title: trans('enter_folder_name'),
        submitText: trans('create'),
    })

    if (!res || res.canceled) {
        return
    }

    // const folderName = res.name || getDefaultName('Folder')
    // await folderStorage.save(folderName)
    //
    // emit('refresh')
    //
    // showToast({ text: trans('folder_created') })
}
</script>

<template>
    <MenuItem
        @click="startRenaming"
        :label="trans('rename')"
        :icon="PencilSquareIcon"
    />
</template>
