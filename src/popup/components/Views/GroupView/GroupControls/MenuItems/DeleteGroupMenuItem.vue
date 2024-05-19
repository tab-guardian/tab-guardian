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
        :class="[
            'text-red-500 !border-red-500',
            'hover:!text-red-700 hover:border-red-700',
        ]"
    >
        <TrashIcon width="22" height="22" />
    </MenuItem>
</template>
