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

function openAndDeleteTabs(): void {
    tabsStore.openAndDeleteTabs(props.group)
}
</script>

<template>
    <Control @click="openAndDeleteTabs" class="control">
        <DoubleChevronUpIcon />
    </Control>
</template>

<style lang="sass" scoped>
.control
    background-color: var(--tg-color-orange)
</style>
