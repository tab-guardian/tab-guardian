<script setup lang="ts">
import type { Group } from '@/types'
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { deletePasswordFromStorage } from '@common/modules/storage/password'

const props = defineProps<{ group: Group }>()

const { closePopup, openPopup } = usePopupStore()

function deleteGroup(): void {
    closePopup('groupMenuView')
    openPopup('deleteGroup')

    if (props.group.isPrivate) {
        deletePasswordFromStorage(props.group.id)
    }
}
</script>

<template>
    <MenuItem
        @click="deleteGroup"
        :label="trans('delete_this_group')"
        :icon="TrashIcon"
        :class="[
            'text-red-500 !border-red-500',
            'hover:!text-red-700 hover:border-red-700',
        ]"
    />
</template>
