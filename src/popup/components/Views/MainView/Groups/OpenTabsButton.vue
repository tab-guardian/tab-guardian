<script setup lang="ts">
import type { Group } from '@/types'
import { useTransStore } from '@/stores/trans'
import { useTabsStore } from '@/stores/tabs'
import { useGroupStore } from '@/stores/group'
import { useRouter } from 'vue-router'
import upImage from '@/assets/images/tab-icons/up.png'

const props = defineProps<{
    group: Group
}>()

const router = useRouter()
const tabsStore = useTabsStore()
const groupStore = useGroupStore()
const { trans } = useTransStore()

function openTabs(): void {
    if (!props.group.isPrivate) {
        tabsStore.openTabs(props.group)
        return
    }

    if (!props.group.isEncrypted) {
        groupStore.selectedGroup = props.group
        tabsStore.openTabs(props.group)
        return
    }

    router.push({
        name: 'group',
        params: {
            id: props.group.id,
            openTabs: 'true',
        },
    })
}
</script>

<template>
    <img
        :src="upImage"
        alt="Open tabs"
        @click.prevent="openTabs"
        v-tippy="trans('Open tabs')"
        class="w-4 h-4 transition-transform hover:scale-110 dark:invert"
    />
</template>
