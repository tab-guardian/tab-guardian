<script setup lang="ts">
import { useGroupStore } from '@/stores/useGroupStore'
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'
import PencilSquareIcon from '@/components/Icons/PencilSquareIcon.vue'
import CheckIcon from '@/components/Icons/CheckIcon.vue'
import Control from '@/components/Modals/GroupModal/GroupControls/Control.vue'

const store = useGroupModalStore()
const groupStore = useGroupStore()
</script>

<template>
    <Control
        v-if="store.isTitleFieldActive"
        @click="groupStore.renameGroup"
    >
        <CheckIcon width="20" height="20" style="stroke: var(--tg-color-secondary)" />
    </Control>

    <Control v-else @click="store.isTitleFieldActive = true">
        <PencilSquareIcon width="20" height="20" />
    </Control>
</template>