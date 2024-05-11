<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import PlusCircleIcon from '@/components/Icons/PlusCircleIcon.vue'
import { useSelectTabsStore } from '@/stores/useSelectTabsStore'
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'
import { useModalStore } from '@/stores/useModalStore'

const { trans } = useTransStore()
const { closePopup } = usePopupStore()
const { openModal } = useModalStore()
const store = useSelectTabsStore()
const groupModalStore = useGroupStore()

function addLink(): void {
    if (!groupModalStore.selectedGroup) {
        console.warn('[Tab Guardian]: No group selected to add links to')
        return
    }

    const groupId = groupModalStore.selectedGroup.id

    store.selectLinksFor(groupId)

    closePopup('groupModalMenu')
    openModal('selectTabs')
}
</script>

<template>
    <MenuItem @click="addLink" :title="trans('Add more links')">
        <PlusCircleIcon width="22" height="22" />
    </MenuItem>
</template>
