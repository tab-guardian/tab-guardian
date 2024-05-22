<script setup lang="ts">
import type { Group } from '@/types'
import { useTabsStore } from '@/stores/tabs'
import upImage from '@/assets/images/tab-icons/up.png'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const tabsStore = useTabsStore()
</script>

<template>
    <img
        :src="upImage"
        alt="Open tabs"
        @click.prevent="tabsStore.openTabs(props.group)"
        class="w-4 h-4 transition-transform hover:scale-110 dark:invert"
    />
</template>
