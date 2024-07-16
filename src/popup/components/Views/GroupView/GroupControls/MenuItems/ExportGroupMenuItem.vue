<script setup lang="ts">
import { useGroupStore } from '@/stores/group'
import { useTransStore } from '@/stores/trans'
import { usePopupStore } from '@/stores/popup'
import error from '@common/modules/error'
import showToast from '@common/modules/showToast'
import ArrowDownTrayIcon from '@common/components/Icons/ArrowDownTrayIcon.vue'
import MenuItem from '@/components/MenuItem.vue'

const store = useGroupStore()
const { trans } = useTransStore()
const { closePopup } = usePopupStore()

function exportGroup(): void {
    if (!store.selectedGroup) {
        error.err('No group selected to export')
        return
    }

    const json = JSON.stringify(store.selectedGroup)

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'tab-group-export.json'
    a.click()

    URL.revokeObjectURL(url)

    closePopup('groupView')
}
</script>

<template>
    <MenuItem
        @click="exportGroup"
        :label="trans('Export this group')"
        :icon="ArrowDownTrayIcon"
    />
</template>
