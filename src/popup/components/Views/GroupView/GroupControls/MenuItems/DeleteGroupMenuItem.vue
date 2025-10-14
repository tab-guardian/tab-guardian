<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'
import { trans } from '@common/modules/utils'
import { usePopupStore } from '@/stores/popup'

const popupStore = usePopupStore()

async function deleteGroup(): Promise<void> {
    popupStore.hideAll()
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
