<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import upImage from '@/assets/images/up.png'
import { useTabsStore } from '@/stores/tabs'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const tabsStore = useTabsStore()

function openTabs(): void {
    tabsStore.openTabs(props.group.links)
}
</script>

<template>
    <Control @click="openTabs" class="control">
        <img :src="upImage" alt="Open tabs" />
    </Control>
</template>

<style lang="sass" scoped>
.control
    background-color: var(--tg-color-green)

    img
        width: 100%
        filter: var(--tg-filter-invert)
</style>
