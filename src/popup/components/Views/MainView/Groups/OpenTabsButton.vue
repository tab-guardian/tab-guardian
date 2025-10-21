<script setup lang="ts">
import type { Group } from '@common/types'
import { trans } from '@common/modules'
import { useTabsStore } from '@/stores/tabs'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { useRouter } from 'vue-router'
import { runtime } from '@common/modules/runtime'

const props = defineProps<{ group: Group }>()

const tabsStore = useTabsStore()
const popupStore = usePopupStore()
const groupStore = useGroupStore()
const router = useRouter()

async function openTabs(): Promise<void> {
    if (props.group.links.length === 0) {
        return
    }

    if (!props.group.isPrivate) {
        await tabsStore.openTabs(props.group)
        return
    }

    if (!props.group.isEncrypted) {
        await tabsStore.openTabs(props.group)
        return
    }

    await popupStore.show('password', {
        decrypting: decryptCallback,
        text: trans('enter_pass_unlock_content'),
    })
}

async function decryptCallback(pass: string): Promise<boolean> {
    const isSuccess = await groupStore.unlock(props.group, pass, true)

    if (isSuccess) {
        await router.push({ name: 'main' })
    }

    return isSuccess
}
</script>

<template>
    <img
        :src="runtime.getUrl('images/tab-icons/up.png')"
        alt="Open tabs"
        @click.prevent="openTabs"
        v-tippy="trans('open_tabs')"
        class="size-4 transition-transform hover:scale-110 dark:invert"
        :class="{
            'cursor-not-allowed opacity-40': group.links.length === 0,
        }"
    />
</template>
