<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import upImage from '@/assets/images/tab-icons/up.png'
import { useTabsStore } from '@/stores/tabs'
import { useTransStore } from '@/stores/trans'

defineProps<{ group: Group }>()

const tabsStore = useTabsStore()
const { trans } = useTransStore()
</script>

<template>
    <Control
        v-tippy="trans('Open tabs')"
        @click="tabsStore.openTabs(group)"
        class="bg-green-300 dark:bg-green-700"
        :class="{
            'cursor-not-allowed !opacity-40': group.links.length === 0,
        }"
    >
        <img :src="upImage" alt="Open tabs" class="dark:invert" />
    </Control>
</template>
