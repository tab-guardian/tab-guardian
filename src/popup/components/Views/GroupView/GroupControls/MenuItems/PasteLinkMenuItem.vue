<script setup lang="ts">
import type { Group } from '@/types'
import { trans } from '@common/modules/trans'
import { useAppStore } from '@/stores/app'
import MenuItem from '@/components/MenuItem.vue'
import PasteIcon from '@common/components/Icons/PasteIcon.vue'

type Props = {
    group: Group
}

const props = defineProps<Props>()

const appStore = useAppStore()
</script>

<template>
    <MenuItem
        :label="trans('paste_tabs_here')"
        :icon="PasteIcon"
        @click="appStore.pasteLink"
        :disabled="appStore.bufferIsEmpty"
    />  
</template>
