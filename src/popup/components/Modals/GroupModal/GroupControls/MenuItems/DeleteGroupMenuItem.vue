<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@/components/Icons/TrashIcon.vue'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'

const { trans } = useTransStore()
const { close, open } = usePopupStore()

function deleteGroup(): void {
    close('groupModalMenu')
    open('deleteGroup')
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
