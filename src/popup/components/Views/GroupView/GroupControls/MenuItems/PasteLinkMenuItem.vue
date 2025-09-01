<script setup lang="ts">
import type { Group } from '@/types'
import { computed } from 'vue'
import { trans } from '@common/modules/trans'
import { useAppStore } from '@/stores/app'
import MenuItem from '@/components/MenuItem.vue'
import PasteIcon from '@common/components/Icons/PasteIcon.vue'

const props = defineProps<{ group: Group }>()

const appStore = useAppStore()

const disabled = computed<boolean>(() => {
    if (!appStore.linkBuffer) {
        return true
    }

    return appStore.linkBuffer.groupId === props.group.id
})

const tooltip = computed<string>(() => {
    if (!appStore.linkBuffer) {
        return trans('nothing_to_paste')
    }

    const sameGroup = appStore.linkBuffer.groupId === props.group.id

    return sameGroup ? trans('cant_paste_into_same_group') : ''
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
