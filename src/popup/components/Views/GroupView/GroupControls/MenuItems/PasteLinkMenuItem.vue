<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules/utils'
import { useAppStore } from '@/stores/app'
import MenuItem from '@/components/MenuItem.vue'
import PasteIcon from '@common/components/Icons/PasteIcon.vue'

defineProps<{ group: Group }>()

const appStore = useAppStore()

const disabled = computed<boolean>(() => {
    return !appStore.linkBuffer
})

const tooltip = computed<string>(() => {
    if (appStore.linkBuffer) {
        return ''
    }

    return trans('nothing_to_paste')
})
</script>

<template>
    <MenuItem
        :label="trans('paste_tabs_here')"
        :icon="PasteIcon"
        :disabled
        :tip="tooltip"
        @click="appStore.pasteLink(group.id)"
    />
</template>
