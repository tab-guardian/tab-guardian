<script setup lang="ts">
import Control from '@/components/Modals/GroupModal/GroupControls/Control.vue'
import PlusCircleIcon from '@/components/Icons/PlusCircleIcon.vue'
import { useSelectTabsModalStore } from '@/stores/modals/useSelectTabsModalStore'

const store = useSelectTabsModalStore()

function addLink(): void {
    store.fetchLinks()
    store.isOpen = true
}
</script>

<template>
    <Control @click="addLink">
        <PlusCircleIcon style="width: 100%" />
    </Control>
</template>