<script setup lang="ts">
import type { Group } from '@/types'
import { trans } from '@common/modules/trans'
import { useTabsStore } from '@/stores/tabs'
import { useGroupStore } from '@/stores/group'
import { useRouter } from 'vue-router'
import upImage from '@/assets/images/tab-icons/up.png'

const props = defineProps<{ group: Group }>()

const router = useRouter()
const tabsStore = useTabsStore()
const groupStore = useGroupStore()

async function openTabs(): Promise<void> {
    if (props.group.links.length === 0) {
        return
    }

    if (!props.group.isPrivate) {
        await tabsStore.openTabs(props.group)
        return
    }

    if (!props.group.isEncrypted) {
        groupStore.selectedGroup = props.group
        await tabsStore.openTabs(props.group)
        return
    }

    await router.push({
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
        v-tippy="trans('open_tabs')"
        class="w-4 h-4 transition-transform hover:scale-110 dark:invert"
        :class="{
            'cursor-not-allowed opacity-40': group.links.length === 0,
        }"
    />
</template>
