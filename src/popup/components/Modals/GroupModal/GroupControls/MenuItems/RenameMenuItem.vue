<script setup lang="ts">
import { useGroupModalStore } from '@/stores/modals/useGroupModalStore'
import { useTransStore } from '@/stores/useTransStore'
import PencilSquareIcon from '@/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'
import { usePopupStore } from '@/stores/usePopupStore'

const store = useGroupModalStore()
const { trans } = useTransStore()
const { close } = usePopupStore()

function renameGroup(): void {
    store.isTitleFieldActive = true
    close('groupModalMenu')
}
</script>

<template>
    <MenuItem @click="renameGroup" :title="trans('Rename this group')">
        <PencilSquareIcon width="22" height="22" />
    </MenuItem>
</template>
