<script setup lang="ts">
import Control from '@/components/Modals/GroupModal/GroupControls/Control.vue'
import PlusCircleIcon from '@/components/Icons/PlusCircleIcon.vue'
import { useSelectTabsModalStore } from '@/stores/modals/useSelectTabsModalStore'
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'

const store = useSelectTabsModalStore()
const groupModalStore = useGroupModalStore()

function addLink(): void {
    if (!groupModalStore.selectedGroup) {
        console.warn('[Tab Guardian]: No group selected to add links to')
        return
    }

    const groupId = groupModalStore.selectedGroup.id

    store.selectLinksFor(groupId)
}
</script>

<template>
    <Control @click="addLink">
        <PlusCircleIcon style="width: 100%" />
    </Control>
</template>