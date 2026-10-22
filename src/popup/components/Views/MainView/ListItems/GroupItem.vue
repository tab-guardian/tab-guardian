<script setup lang="ts">
import type { Group, ToastMessage } from '@common/types'
import type { PasswordAttemptResult } from '@common/types/modal'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import { useGroupStore } from '@/stores/group'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import OpenTabsButton from '@/components/Views/MainView/ListItems/OpenTabsButton.vue'
import GroupIcon from '@/components/Views/MainView/ListItems/GroupIcon.vue'
import MainItem from '@/components/Views/MainView/ListItems/MainItem.vue'

const props = defineProps<{ group: Group }>()

const router = useRouter()
const modalStore = useModalStore()
const groupStore = useGroupStore()

const className = computed(() => {
    const privateGroup = props.group.isPrivate ? 'bg-safe! hover:bg-safe-hover!' : ''

    const unsafeGroup =
        (props.group.isPrivate && !props.group.isEncrypted) || legacyEncryption.value
            ? 'bg-unsafe! hover:bg-unsafe-hover!'
            : ''

    return [privateGroup, unsafeGroup]
})

const legacyEncryption = computed(
    () =>
        props.group.isPrivate &&
        props.group.isEncrypted &&
        props.group.links.some(link => !!link.iv),
)

const warningMsg = computed(() =>
    legacyEncryption.value ? trans('legacy_encryption_warning') : '',
)

async function navigateToGroupView(): Promise<void> {
    if (props.group.isPrivate && props.group.isEncrypted) {
        await modalStore.show('password', {
            decrypting: unlockCallback,
            text: trans('enter_pass_unlock_content'),
        })

        return
    }

    await router.push({ name: 'group', params: { id: props.group.id } })
}

async function unlockCallback(pass: string): Promise<PasswordAttemptResult> {
    const unlocking = await groupStore.unlock(props.group, pass)

    const toastMsg: ToastMessage = {
        text: unlocking.message,
        type: unlocking.failed ? 'error' : 'info',
    }

    if (unlocking.failed) {
        return { success: false, toastMsg }
    }

    await router.push({
        name: 'group',
        params: { id: props.group.id },
    })

    return { success: true, toastMsg }
}
</script>

<template>
    <MainItem @click="navigateToGroupView" :class="className" :tip="warningMsg">
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
