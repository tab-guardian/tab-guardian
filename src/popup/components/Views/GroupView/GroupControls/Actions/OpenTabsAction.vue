<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import upImage from '@/assets/images/tab-icons/up.png'
import { useTabsStore } from '@/stores/tabs'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const tabsStore = useTabsStore()

function openTabs(): void {
    tabsStore.openTabs(props.group)
}
</script>

<template>
    <Control @click="openTabs" class="bg-green-300 dark:bg-green-700">
        <img :src="upImage" alt="Open tabs" class="dark:invert" />
    </Control>
</template>
