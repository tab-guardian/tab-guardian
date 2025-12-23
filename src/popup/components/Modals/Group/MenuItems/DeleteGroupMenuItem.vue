<script setup lang="ts">
import type { Group } from '@common/types'
import MenuItem from '@/components/MenuItem.vue'
import TrashIcon from '@common/components/Icons/TrashIcon.vue'
import { trans } from '@common/modules'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import { useGroupStore } from '@/stores/group'

const props = defineProps<{ group: Group }>()

const router = useRouter()
const modalStore = useModalStore()
const groupStore = useGroupStore()

async function promptToDeleteGroup(): Promise<void> {
    modalStore.hide('groupMenu', {})

    const resp = await modalStore.show('confirm', {
        title: trans('want_delete_group'),
    })

    if (resp && resp.isConfirmed) {
        await deleteGroup()
    }
}

async function deleteGroup(): Promise<void> {
    await groupStore.deleteGroup(props.group.id)
    await router.push({ name: 'main' })
    groupStore.selectedGroup = null
}
</script>

<template>
    <MenuItem
        @click="promptToDeleteGroup"
        :label="trans('delete')"
        :icon="TrashIcon"
        :class="[
            'text-red-500 border-red-500!',
            'hover:text-red-600! hover:border-red-600!',
        ]"
    />
</template>
