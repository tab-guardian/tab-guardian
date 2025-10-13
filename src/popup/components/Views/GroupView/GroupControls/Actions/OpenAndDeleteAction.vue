<script setup lang="ts">
import type { Group } from '@common/types'
import { useTabsStore } from '@/stores/tabs'
import { useRouter } from 'vue-router'
import { runtime } from '@common/modules/runtime'
import { trans } from '@common/modules/utils'
import Control from '@/components/Control.vue'

const props = defineProps<{ group: Group }>()

const router = useRouter()
const tabsStore = useTabsStore()

async function openAndDeleteTabs(): Promise<void> {
    if (props.group.links.length === 0) {
        return
    }

    await tabsStore.openAndDeleteTabs(props.group)
    await router.push({ name: 'main' })
}
</script>

<template>
    <Control
        v-tippy="trans('open_tabs_delete_group')"
        @click="openAndDeleteTabs"
        class="bg-orange-300 dark:bg-orange-700"
        :class="{
            'cursor-not-allowed !opacity-40': group.links.length === 0,
        }"
    >
        <img
            :src="runtime.getURL('images/tab-icons/up-remove.png')"
            alt="Open and delete tabs"
            class="dark:invert"
        />
    </Control>
</template>
