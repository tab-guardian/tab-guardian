<script setup lang="ts">
import type { Group } from '@common/types'
import { useTabsStore } from '@/stores/tabs'
import { trans } from '@common/modules/trans'
import { runtime } from '@common/modules/runtime'
import Control from '@/components/Control.vue'

const props = defineProps<{ group: Group }>()
const tabsStore = useTabsStore()

function stashTabs(): void {
    tabsStore.stashTabs(props.group, true)
}
</script>

<template>
    <Control
        v-tippy="trans('move_tabs_into_group')"
        @click="stashTabs"
        class="bg-slate-300 dark:bg-slate-700"
    >
        <img
            :src="runtime.getURL('images/tab-icons/down-remove.png')"
            alt="Stash and close tabs"
            class="dark:invert"
        />
    </Control>
</template>
