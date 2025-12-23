<script setup lang="ts">
import type { SelectTabsOperation } from '@common/types'
import { trans } from '@common/modules'
import { useRouter } from 'vue-router'
import { useModalStore } from '@/stores/modal'
import MenuItem from '@/components/MenuItem.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'

const modalStore = useModalStore()
const router = useRouter()

function switchToSelectTabsView(): void {
    const operation: SelectTabsOperation = 'adding'
    router.push({ name: 'select-tabs', params: { operation } })
    modalStore.hide('groupMenu', {})
}
</script>

<template>
    <MenuItem
        @click="switchToSelectTabsView"
        :label="trans('add_more_tabs')"
        :icon="PlusCircleIcon"
    />
</template>
