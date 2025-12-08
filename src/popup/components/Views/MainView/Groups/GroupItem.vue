<script setup lang="ts">
import type { Group } from '@common/types'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { showToast } from '@common/modules/toast'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import OpenTabsButton from '@/components/Views/MainView/Groups/OpenTabsButton.vue'
import GroupIcon from '@/components/Views/MainView/Groups/GroupIcon.vue'
import MainItem from '@/components/Views/MainView/Groups/MainItem.vue'

const props = defineProps<{ group: Group }>()

const router = useRouter()
const popupStore = usePopupStore()
const groupStore = useGroupStore()

const className = computed(() => {
    const privateGroup = props.group.isPrivate ? 'bg-safe! hover:bg-safe-hover!' : ''

    const unsafeGroup =
        props.group.isPrivate && !props.group.isEncrypted
            ? 'bg-unsafe! hover:bg-unsafe-hover!'
            : ''

    return [privateGroup, unsafeGroup]
})

async function navigateToGroupView(): Promise<void> {
    if (props.group.isPrivate && props.group.isEncrypted) {
        await popupStore.show('password', {
            decrypting: unlockCallback,
            text: trans('enter_pass_unlock_content'),
        })

        return
    }

    await router.push({ name: 'group', params: { id: props.group.id } })
}

async function unlockCallback(pass: string): Promise<boolean> {
    const unlocking = await groupStore.unlock(props.group, pass)

    showToast({
        text: unlocking.message,
        type: unlocking.failed ? 'error' : 'info',
    })

    if (unlocking.failed) {
        return false
    }

    await router.push({
        name: 'group',
        params: { id: props.group.id },
    })

    return true
}
</script>

<template>
    <MainItem @click="navigateToGroupView" :class="className">
        <div class="flex items-center gap-2">
            <GroupIcon :group />
            <h2 class="text-sm">{{ group.name }}</h2>
        </div>

        <div class="flex items-center gap-3">
            <OpenTabsButton @click.stop :group />
            <ChevronRightIcon class="size-4" />
        </div>
    </MainItem>
</template>
