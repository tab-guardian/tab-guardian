<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import ChevronRightIcon from '@/components/Icons/ChevronRightIcon.vue'
import { useTabsStore } from '@/stores/tabs'

type Props = {
    group: Group
}

const props = defineProps<Props>()
const tabsStore = useTabsStore()

function openTabs(): void {
    tabsStore.openTabs(props.group.links)
}
</script>

<template>
    <Control @click="openTabs" class="control">
        <ChevronRightIcon />
    </Control>
</template>

<style lang="sass" scoped>
.control
    transform: rotate(-90deg)
    background-color: var(--tg-color-green)
</style>
