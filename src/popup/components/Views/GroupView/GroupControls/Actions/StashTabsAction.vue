<script setup lang="ts">
import type { Group } from '@common/types'
import Control from '@/components/Control.vue'
import { getImageURL } from '@common/modules/browser/url'
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
        <img
            :src="getImageURL('tab-icons/down.png')"
            alt="Stash tabs"
            class="dark:invert"
        />
    </Control>
</template>
