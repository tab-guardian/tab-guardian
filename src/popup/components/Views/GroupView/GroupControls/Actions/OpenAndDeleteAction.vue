<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import upRemoveImage from '@/assets/images/tab-icons/up-remove.png'
import { useTabsStore } from '@/stores/tabs'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const tabsStore = useTabsStore()

function openAndDeleteTabs(): void {
    tabsStore.openAndDeleteTabs(props.group)
}
</script>

<template>
    <Control @click="openAndDeleteTabs" class="control">
        <img :src="upRemoveImage" alt="Open and delete tabs" />
    </Control>
</template>

<style lang="sass" scoped>
.control
    background-color: var(--tg-color-orange)

    img
        width: 100%
        filter: var(--tg-filter-invert)
</style>
