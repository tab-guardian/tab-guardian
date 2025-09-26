<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { trans } from '@common/modules/trans'
import { showToast } from '@common/modules/showToast'
import { error } from '@common/modules/error'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const groupStore = useGroupStore()
const popupStore = usePopupStore()

function startGroupRenaming(): void {
    if (!groupStore.selectedGroup) {
        error.err('No group selected to rename')
        showToast(trans('error_occurred'), 'error')
        return
    }

    popupStore.closePopup('groupMenuView')
}

</script>

<template>
    <MenuItem
        @click="startGroupRenaming"
        :label="trans('rename_this_group')"
        :icon="PencilSquareIcon"
    />
</template>
