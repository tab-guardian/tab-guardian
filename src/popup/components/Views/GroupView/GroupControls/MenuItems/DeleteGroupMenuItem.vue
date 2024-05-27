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
        :label="trans('Delete this group')"
        :icon="TrashIcon"
        :class="[
            'text-red-500 !border-red-500',
            'hover:!text-red-700 hover:border-red-700',
        ]"
    />
</template>
