<script setup lang="ts">
import { useGroupStore } from '@/stores/useGroupStore'
import { useTransStore } from '@/stores/useTransStore'
import PencilSquareIcon from '@/components/Icons/PencilSquareIcon.vue'
import MenuItem from '@/components/MenuItem.vue'
import { usePopupStore } from '@/stores/usePopupStore'

const store = useGroupStore()
const { trans } = useTransStore()
const { closePopup } = usePopupStore()

function renameGroup(): void {
    store.isTitleFieldActive = true
    closePopup('groupModalMenu')
}
</script>

<template>
    <MenuItem @click="renameGroup" :title="trans('Rename this group')">
        <PencilSquareIcon width="22" height="22" />
    </MenuItem>
</template>
