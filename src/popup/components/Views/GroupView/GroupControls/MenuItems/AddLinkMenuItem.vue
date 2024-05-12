<script setup lang="ts">
import MenuItem from '@/components/MenuItem.vue'
import PlusCircleIcon from '@/components/Icons/PlusCircleIcon.vue'
import { useTransStore } from '@/stores/useTransStore'
import { usePopupStore } from '@/stores/usePopupStore'
import { useRouter } from 'vue-router'

const { trans } = useTransStore()
const { closePopup } = usePopupStore()
const router = useRouter()

function addLink(): void {
    closePopup('groupModalMenu')
    router.push({ name: 'select-tabs' })
}
</script>

<template>
    <MenuItem @click="addLink" :title="trans('Add more links')">
        <PlusCircleIcon width="22" height="22" />
    </MenuItem>
</template>
