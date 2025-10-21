<script setup lang="ts">
import type { Group } from '@common/types'
import { ref } from 'vue'
import { trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import { useGroupStore } from '@/stores/group'
import { useRouter } from 'vue-router'
import LockOpenIcon from '@common/components/Icons/LockOpenIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import Button from '@common/components/Form/Button.vue'

const props = defineProps<{ group: Group }>()
const popupStore = usePopupStore()
const groupStore = useGroupStore()
const router = useRouter()

const encrypting = ref<boolean>(false)

async function promptEnterPassword(): Promise<void> {
    await popupStore.show('password', {
        decrypting: decryptCallback,
        text: trans('enter_pass_unlock_content'),
    })
}

async function decryptCallback(pass: string): Promise<boolean> {
    const isSuccess = await groupStore.unlock(props.group, pass)

    if (isSuccess) {
        await router.push({
            name: 'group',
            params: { id: props.group.id },
        })
    }

    return isSuccess
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
