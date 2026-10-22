<script setup lang="ts">
import type { Group, ToastMessage } from '@common/types'
import type { PasswordAttemptResult } from '@common/types/modal'
import { ref } from 'vue'
import { trans } from '@common/modules'
import { useModalStore } from '@/stores/modal'
import { useGroupStore } from '@/stores/group'
import { useRouter } from 'vue-router'
import LockOpenIcon from '@common/components/Icons/LockOpenIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import Button from '@common/components/Form/Button.vue'

const props = defineProps<{ group: Group }>()
const modalStore = useModalStore()
const groupStore = useGroupStore()
const router = useRouter()

const encrypting = ref<boolean>(false)

async function promptEnterPassword(): Promise<void> {
    await modalStore.show('password', {
        decrypting: unlockCallback,
        text: trans('enter_pass_unlock_content'),
    })
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
    <WarningBox :message="trans('group_locked')" :success="true">
        <div class="w-52 flex flex-col items-end gap-1.5">
            <Button
                @click="promptEnterPassword"
                is="success"
                :icon="LockOpenIcon"
                :loading="encrypting"
            >
                {{ trans('unlock') }}
            </Button>
        </div>
    </WarningBox>
</template>
