<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { trans } from '@common/modules'
import { useLinkStore } from '@/stores/link'
import { usePopupStore } from '@/stores/popup'
import { showToast } from '@common/modules/toast'
import MenuItem from '@/components/MenuItem.vue'
import PasteIcon from '@common/components/Icons/PasteIcon.vue'

const props = defineProps<{ group: Group }>()

const linkStore = useLinkStore()
const popupStore = usePopupStore()

const disabled = computed<boolean>(() => {
    return linkStore.isEmptyBuffer
})

const tip = computed<string>(() => {
    if (linkStore.isEmptyBuffer) {
        return trans('nothing_to_paste')
    }

    return ''
})

async function pasteLink(): Promise<void> {
    popupStore.hideAll()
    linkStore.paste(props.group.id)
    showToast({ text: trans('tab_pasted') })
}
</script>

<template>
    <MenuItem
        :label="trans('paste_tabs')"
        :icon="PasteIcon"
        :disabled
        :tip
        @click="pasteLink"
    />
</template>
