<script setup lang="ts">
import type { Group } from '@/types'
import { useTabsStore } from '@/stores/tabs'
import upImage from '@/assets/images/tab-icons/up.png'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const tabsStore = useTabsStore()

function openTabs(): void {
    tabsStore.openTabs(group.links)
}
</script>

<template>
    <img :src="upImage" alt="Open tabs" @click.prevent="openTabs" />
</template>

<style lang="sass" scoped>
img
    width: 18px
    height: 18px
    filter: var(--tg-filter-invert)
    transition: transform .2s

    &:hover
        transform: scale(1.1)
</style>
