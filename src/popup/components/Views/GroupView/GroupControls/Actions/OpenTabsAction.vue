<script setup lang="ts">
import type { Group } from '@common/types'
import Control from '@/components/Control.vue'
import { runtime } from '@common/modules/runtime'
import { useTabsStore } from '@/stores/tabs'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'

const props = defineProps<{ group: Group }>()

const tabsStore = useTabsStore()

async function openTabs(): Promise<void> {
    const result = await tabsStore.openTabs(props.group)

    for (const toastMsg of result.toastMsgs) {
        showToast(toastMsg)
    }
}
</script>

<template>
    <Control
        v-tippy="trans('open_tabs')"
        @click="openTabs"
        class="bg-green-300 dark:bg-green-700"
        :class="{
            'cursor-not-allowed !opacity-40': group.links.length === 0,
        }"
    >
        <img
            :src="runtime.getUrl('images/tab-icons/up.png')"
            alt="Open tabs"
            class="dark:invert"
        />
    </Control>
</template>
