<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import upImage from '@/assets/images/tab-icons/up.png'
import { useTabsStore } from '@/stores/tabs'
import { useTransStore } from '@/stores/trans'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const tabsStore = useTabsStore()
const { trans } = useTransStore()
</script>

<template>
    <Control
        v-tippy="trans('Open tabs')"
        @click="tabsStore.openTabs(props.group)"
        class="bg-green-300 dark:bg-green-700"
    >
        <img :src="upImage" alt="Open tabs" class="dark:invert" />
    </Control>
</template>
