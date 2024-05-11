<script setup lang="ts">
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'
import { useTransStore } from '@/stores/useTransStore'
import { useGroupStore } from '@/stores/useGroupStore'
import PencilSquareIcon from '@/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const store = useGroupModalStore()
const groupStore = useGroupStore()
const { trans } = useTransStore()

function renameGroup(): void {
    store.isTitleFieldActive = true
    groupStore.isMenuOpen = false
}
</script>

<template>
    <MenuItem @click="renameGroup" :title="trans('Rename this group')">
        <PencilSquareIcon width="22" height="22" />
    </MenuItem>
</template>
