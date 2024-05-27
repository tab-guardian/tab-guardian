<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import error from '@common/modules/error'
import PencilSquareIcon from '@common/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

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
        :label="trans('Rename this group')"
        :icon="PencilSquareIcon"
    />
</template>
