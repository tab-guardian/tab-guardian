<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@/components/Icons/TrashIcon.vue'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'
import { useRouter } from 'vue-router'

const { trans } = useTransStore()
const { closePopup, openPopup } = usePopupStore()
const router = useRouter()

function deleteGroup(): void {
    closePopup('groupView')
    openPopup('deleteGroup')
    router.push({ name: 'main' })
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
