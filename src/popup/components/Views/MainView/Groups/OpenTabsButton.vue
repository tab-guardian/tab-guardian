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
    <img
        :src="upImage"
        alt="Open tabs"
        @click.prevent="openTabs"
        class="w-4 h-4 transition-transform hover:scale-110 dark:invert"
    />
</template>
