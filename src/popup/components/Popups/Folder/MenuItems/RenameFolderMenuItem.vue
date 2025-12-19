<script setup lang="ts">
import { usePopupStore } from '@/stores/popup'
import { trans } from '@common/modules'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const popupStore = usePopupStore()

async function startRenaming(): Promise<void> {
    popupStore.hide('folderMenu', {})
    await popupStore.show('textInput', {})
}
</script>

<template>
    <MenuItem
        @click="startRenaming"
        :label="trans('rename')"
        :icon="PencilSquareIcon"
    />
</template>
