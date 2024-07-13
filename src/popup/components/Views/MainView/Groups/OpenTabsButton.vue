<script setup lang="ts">
import type { Group } from '@/types'
import { useTransStore } from '@/stores/trans'
import { useTabsStore } from '@/stores/tabs'
import upImage from '@/assets/images/tab-icons/up.png'

defineProps<{
    group: Group
}>()

const tabsStore = useTabsStore()
const { trans } = useTransStore()
</script>

<template>
    <img
        :src="upImage"
        alt="Open tabs"
        @click.prevent="tabsStore.openTabs(group)"
        v-tippy="trans('Open tabs')"
        class="w-4 h-4 transition-transform hover:scale-110 dark:invert"
    />
</template>
