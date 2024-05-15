<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import DoubleChevronUpIcon from '@/components/Icons/DoubleChevronUpIcon.vue'
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
    <Control @click="stashTabs" class="control">
        <DoubleChevronUpIcon />
    </Control>
</template>

<style lang="sass" scoped>
.control
    background-color: var(--tg-color-blue)
    transform: rotate(-180deg)
</style>
