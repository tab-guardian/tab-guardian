<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import downImage from '@/assets/images/tab-icons/down.png'
import { useTabsStore } from '@/stores/tabs'
import { trans } from '@common/modules/trans'

const props = defineProps<{ group: Group }>()
const tabsStore = useTabsStore()

function stashTabs(): void {
    tabsStore.stashTabs(props.group, false)
}
</script>

<template>
    <Control
        v-tippy="trans('copy_tabs_into_group')"
        @click="stashTabs"
        class="bg-slate-300 dark:bg-slate-700"
    >
        <img :src="downImage" alt="Stash tabs" class="dark:invert" />
    </Control>
</template>
