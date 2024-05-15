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

function stashTabs(): void {
    tabsStore.stashTabs(props.group)
}
</script>

<template>
    <Control @click="stashTabs" class="control">
        <ChevronRightIcon />
    </Control>
</template>

<style lang="sass" scoped>
.control
    background-color: var(--tg-color-blue)
    transform: rotate(90deg)
</style>
