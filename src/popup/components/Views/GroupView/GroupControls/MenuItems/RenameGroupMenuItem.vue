<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { trans } from '@common/modules/utils'
import { showToast } from '@common/modules/showToast'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const groupStore = useGroupStore()
const popupStore = usePopupStore()

function startGroupRenaming(): void {
    if (!groupStore.selectedGroup) {
        console.error('No group selected to rename')
        showToast(trans('error_occurred'), 'error')
        return
    }

    popupStore.closePopup('groupMenuView')
    popupStore.openPopup('editGroupName')
}

</script>

<template>
    <MenuItem
        @click="startGroupRenaming"
        :label="trans('rename_this_group')"
        :icon="PencilSquareIcon"
    />
</template>
