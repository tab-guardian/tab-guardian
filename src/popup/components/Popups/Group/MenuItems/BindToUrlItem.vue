<script setup lang="ts">
import type { Group } from '@common/types'
import MenuItem from '@/components/MenuItem.vue'
import LinkIcon from '@common/components/Icons/LinkIcon.vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'

defineProps<{ group: Group }>()

const popupStore = usePopupStore()

async function rebind(): Promise<void> {
    popupStore.hide('groupMenu', {})
    await popupStore.show('bindGroup', {})
}
</script>

<template>
    <MenuItem
        @click="rebind"
        :label="group.bindUrl ? trans('rebind_to_other_url') : trans('bind_to_url')"
        :icon="LinkIcon"
    />
</template>
