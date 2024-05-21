<script setup lang="ts">
import type { Group } from '@/types'
import { useTabsStore } from '@/stores/tabs'
import upRemoveImage from '@/assets/images/tab-icons/up-remove.png'
import Control from '@/components/Control.vue'

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
    <Control
        @click="openAndDeleteTabs"
        class="bg-orange-300 dark:bg-orange-700"
    >
        <img
            :src="upRemoveImage"
            alt="Open and delete tabs"
            class="dark:invert"
        />
    </Control>
</template>
