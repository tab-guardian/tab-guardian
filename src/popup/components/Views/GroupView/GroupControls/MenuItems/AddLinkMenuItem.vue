<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import { trans } from '@common/modules/trans'
import { useNewGroupStore } from '@/stores/newGroup'
import { useGroupStore } from '@/stores/group'
import { error } from '@common/modules/error'

const store = useNewGroupStore()
const groupStore = useGroupStore()

function addLink(): void {
    if (!groupStore.selectedGroup) {
        error.warn('No group selected to add links to')
        return
    }

    store.showView({
        groupId: groupStore.selectedGroup.id,
        operation: 'adding',
    })
}
</script>

<template>
    <MenuItem
        @click="addLink"
        :label="trans('add_more_tabs')"
        :icon="PlusCircleIcon"
    />
</template>
