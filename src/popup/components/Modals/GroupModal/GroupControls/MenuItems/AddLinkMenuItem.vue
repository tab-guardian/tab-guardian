<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import PlusCircleIcon from '@/components/Icons/PlusCircleIcon.vue'
import { useSelectTabsModalStore } from '@/stores/modals/useSelectTabsModalStore'
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'

const { trans } = useTransStore()
const { close } = usePopupStore()
const store = useSelectTabsModalStore()
const groupModalStore = useGroupModalStore()

function addLink(): void {
    if (!groupModalStore.selectedGroup) {
        console.warn('[Tab Guardian]: No group selected to add links to')
        return
    }

    const groupId = groupModalStore.selectedGroup.id

    store.selectLinksFor(groupId)
    close('groupModalMenu')
}
</script>

<template>
    <MenuItem @click="addLink" :title="trans('Add more links')">
        <PlusCircleIcon width="22" height="22" />
    </MenuItem>
</template>
