<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import downRemoveImage from '@/assets/images/down-remove.png'
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
        <img :src="downRemoveImage" alt="Stash and close tabs" />
    </Control>
</template>

<style lang="sass" scoped>
.control
    background-color: var(--tg-color-blue)

    img
        width: 100%
        filter: var(--tg-filter-invert)
</style>
