<script setup lang="ts">
import type { Group } from '@/types'
import { useTabsStore } from '@/stores/tabs'
import { useRouter } from 'vue-router'
import trans from '@common/modules/trans'
import upRemoveImage from '@/assets/images/tab-icons/up-remove.png'
import Control from '@/components/Control.vue'

const props = defineProps<{ group: Group }>()

const router = useRouter()
const tabsStore = useTabsStore()

async function openAndDeleteTabs(): Promise<void> {
    if (props.group.links.length === 0) {
        return
    }

    await tabsStore.openAndDeleteTabs(props.group)
    router.push({ name: 'main' })
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
        <img :src="upRemoveImage" alt="Open and delete tabs" class="dark:invert" />
    </Control>
</template>
