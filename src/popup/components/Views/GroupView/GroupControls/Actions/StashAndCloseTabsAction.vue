<script setup lang="ts">
import type { Group } from '@/types'
import { useTabsStore } from '@/stores/tabs'
import { useTransStore } from '@/stores/trans'
import downRemoveImage from '@/assets/images/tab-icons/down-remove.png'
import Control from '@/components/Control.vue'

const props = defineProps<{
    group: Group
}>()

const tabsStore = useTabsStore()
const { trans } = useTransStore()

function stashTabs(): void {
    tabsStore.stashTabs(props.group, true)
}
</script>

<template>
    <Control
        v-tippy="trans('Move tabs into this group')"
        @click="stashTabs"
        class="bg-slate-300 dark:bg-slate-700"
    >
        <img :src="downRemoveImage" alt="Stash and close tabs" class="dark:invert" />
    </Control>
</template>
