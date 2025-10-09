<script setup lang="ts">
import type { SelectTabsOperation } from '@common/types'
import { trans } from '@common/modules/trans'
import { useRouter } from 'vue-router'
import { usePopupStore } from '@/stores/popup'
import MenuItem from '@/components/MenuItem.vue'
import PlusCircleIcon from '@common/components/Icons/PlusCircleIcon.vue'

const { closePopup } = usePopupStore()
const router = useRouter()

function switchToSelectTabsView(): void {
    const operation: SelectTabsOperation = 'adding'
    router.push({ name: 'select-tabs', params: { operation } })
    closePopup('groupMenuView')
}
</script>

<template>
    <MenuItem
        @click="switchToSelectTabsView"
        :label="trans('add_more_tabs')"
        :icon="PlusCircleIcon"
    />
</template>
