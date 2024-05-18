<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import downRemoveImage from '@/assets/images/tab-icons/down-remove.png'
import { useTabsStore } from '@/stores/tabs'

type Props = {
    group: Group
}

const props = defineProps<Props>()

const tabsStore = useTabsStore()

function stashTabs(): void {
    tabsStore.stashTabs(props.group, true)
}
</script>

<template>
    <Control @click="stashTabs" class="bg-slate-300 dark:bg-slate-700">
        <img
            :src="downRemoveImage"
            alt="Stash and close tabs"
            class="dark:invert"
        />
    </Control>
</template>
