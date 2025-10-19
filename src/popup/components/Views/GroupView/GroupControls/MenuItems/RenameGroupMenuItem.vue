<script setup lang="ts">
import { usePopupStore } from '@/stores/popup'
import { trans } from '@common/modules'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const popupStore = usePopupStore()

function startGroupRenaming(): void {
    popupStore.hide('groupMenuView', {})
    popupStore.show('editGroupName', {})
}
</script>

<template>
    <MenuItem
        @click="startGroupRenaming"
        :label="trans('rename')"
        :icon="PencilSquareIcon"
    />
</template>
