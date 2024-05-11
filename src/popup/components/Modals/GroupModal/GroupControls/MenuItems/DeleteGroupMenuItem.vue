<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@/components/Icons/TrashIcon.vue'
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'
import { useTransStore } from '@/stores/useTransStore'
import { useGroupStore } from '@/stores/useGroupStore'

const { trans } = useTransStore()
const store = useGroupModalStore()
const groupStore = useGroupStore()

function deleteGroup(): void {
    store.askToDelete = true
    groupStore.isMenuOpen = false
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
