<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules'
import { useLinkStore } from '@/stores/link'
import MenuItem from '@/components/MenuItem.vue'
import PasteIcon from '@common/components/Icons/PasteIcon.vue'

defineProps<{ group: Group }>()

const linkStore = useLinkStore()

const disabled = computed<boolean>(() => {
    return linkStore.isEmptyBuffer
})

const tip = computed<string>(() => {
    if (linkStore.isEmptyBuffer) {
        return trans('nothing_to_paste')
    }

    return ''
})
</script>

<template>
    <MenuItem
        :label="trans('paste_tabs')"
        :icon="PasteIcon"
        :disabled
        :tip
        @click="linkStore.pasteLink(group.id)"
    />
</template>
