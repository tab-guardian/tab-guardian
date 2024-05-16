<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'

const { trans } = useTransStore()
const { closePopup, openPopup } = usePopupStore()

function deleteGroup(): void {
    closePopup('groupView')
    openPopup('deleteGroup')
}
</script>

<template>
    <MenuItem
        @click="deleteGroup"
        :title="trans('Delete this group')"
        class="delete-menu-item"
    >
        <TrashIcon width="22" height="22" />
    </MenuItem>
</template>

<style lang="sass" scoped>
.delete-menu-item
    color: #d02258
    border-color: #d02258

    &:hover
        color: brown
        border-color: brown
</style>
