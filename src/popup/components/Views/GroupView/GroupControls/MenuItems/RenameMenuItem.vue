<script setup lang="ts">
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import PencilSquareIcon from '@/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'
import { usePopupStore } from '@/stores/usePopupStore'
import error from '@/modules/error'

const store = useGroupStore()
const { trans } = useTransStore()
const { closePopup } = usePopupStore()

function renameGroup(): void {
    if (!store.selectedGroup) {
        error.err('No group selected to rename')
        return
    }

    store.isTitleFieldActive = true
    store.selectedGroup = store.selectedGroup
    store.newGroup.name = store.selectedGroup.name

    closePopup('groupView')
}
</script>

<template>
    <MenuItem
        @click="renameGroup"
        :title="trans('Rename this group')"
    >
        <PencilSquareIcon width="22" height="22" />
    </MenuItem>
</template>
