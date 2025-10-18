<script setup lang="ts">
import type { Group } from '@common/types'
import { trans } from '@common/modules'
import { useTabsStore } from '@/stores/tabs'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { useGroupUnlock } from '@/assets/composables/useGroupUnlock'
import { runtime } from '@common/modules/runtime'

const props = defineProps<{ group: Group }>()

const tabsStore = useTabsStore()
const groupStore = useGroupStore()
const popupStore = usePopupStore()
const { unlockGroup } = useGroupUnlock()

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

    popupStore.show('enterPassword', {
        decrypting: async pass => await unlockGroup(props.group, pass, true),
        text: trans('enter_pass_unlock_content'),
    })
}
</script>

<template>
    <img
        :src="runtime.getURL('images/tab-icons/up.png')"
        alt="Open tabs"
        @click.prevent="openTabs"
        v-tippy="trans('open_tabs')"
        class="w-4 h-4 transition-transform hover:scale-110 dark:invert"
        :class="{
            'cursor-not-allowed opacity-40': group.links.length === 0,
        }"
    />
</template>
