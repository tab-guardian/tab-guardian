<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'
import { useTransStore } from '@/stores/trans'
import { useSelectTabsStore } from '@/stores/selectTabs'
import { useGroupStore } from '@/stores/group'
import error from '@common/modules/error'

const { trans } = useTransStore()
const store = useSelectTabsStore()
const groupStore = useGroupStore()

function addLink(): void {
    if (!groupStore.selectedGroup) {
        error.warn('No group selected to add links to')
        return
    }

    store.showView({
        groupId: groupStore.selectedGroup.id,
    })
}
</script>

<template>
    <MenuItem @click="addLink" :title="trans('Add more links')">
        <PlusCircleIcon width="22" height="22" />
    </MenuItem>
</template>
