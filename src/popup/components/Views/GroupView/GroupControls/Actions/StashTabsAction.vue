<script setup lang="ts">
import type { Group } from '@/types'
import Control from '@/components/Control.vue'
import downImage from '@/assets/images/tab-icons/down.png'
import { useTabsStore } from '@/stores/tabs'

type Props = {
    group: Group
}

const props = defineProps<Props>()

const tabsStore = useTabsStore()

function stashTabs(): void {
    tabsStore.stashTabs(props.group, false)
}
</script>

<template>
    <Control @click="stashTabs" class="control">
        <img :src="downImage" alt="Stash tabs" />
    </Control>
</template>

<style lang="sass" scoped>
.control
    background-color: var(--tg-color-blue)

    img
        width: 100%
        filter: var(--tg-filter-invert)
</style>
