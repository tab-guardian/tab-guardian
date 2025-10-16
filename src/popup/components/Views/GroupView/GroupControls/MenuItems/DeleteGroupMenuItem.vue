<script setup lang="ts">
import type { ConfirmData } from '@common/types/popup'
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'
import { trans } from '@common/modules/utils'
import { deletePasswordFromStorage } from '@common/modules/storage/password'
import { useRouter } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'

const router = useRouter()
const popupStore = usePopupStore()
const groupStore = useGroupStore()

async function promptToDeleteGroup(): Promise<void> {
    popupStore.hide('groupMenuView', {})

    const popupData: ConfirmData = {
        text: trans('want_delete_group'),
    }

    popupStore.show('confirm', popupData, async answer => {
        if (answer && answer.isConfirmed) {
            await deleteGroup()
        }
    })
}

async function deleteGroup(): Promise<void> {
    const group = groupStore.selectedGroup

    if (!group) {
        console.warn('No group selected for deletion')
        return
    }

    await groupStore.deleteGroup(group.id)
    await router.push({ name: 'main' })

    if (group.isPrivate) {
        await deletePasswordFromStorage(group.id)
    }

    groupStore.selectedGroup = null
}
</script>

<template>
    <MenuItem
        @click="promptToDeleteGroup"
        :label="trans('delete_this_group')"
        :icon="TrashIcon"
        :class="[
            'text-red-500 !border-red-500',
            'hover:!text-red-700 hover:border-red-700',
        ]"
    />
</template>
