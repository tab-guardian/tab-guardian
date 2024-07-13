<script setup lang="ts">
import type { Group } from '@/types'
import { useTabsStore } from '@/stores/tabs'
import { useRouter } from 'vue-router'
import { useTransStore } from '@/stores/trans'
import upRemoveImage from '@/assets/images/tab-icons/up-remove.png'
import Control from '@/components/Control.vue'

const props = defineProps<{
    group: Group
}>()

const router = useRouter()
const tabsStore = useTabsStore()
const { trans } = useTransStore()

async function openAndDeleteTabs(): Promise<void> {
    await tabsStore.openAndDeleteTabs(props.group)
    router.push({ name: 'main' })
}
</script>

<template>
    <Control
        v-tippy="trans('Open tabs and delete this group')"
        @click="openAndDeleteTabs"
        class="bg-orange-300 dark:bg-orange-700"
    >
        <img :src="upRemoveImage" alt="Open and delete tabs" class="dark:invert" />
    </Control>
</template>
