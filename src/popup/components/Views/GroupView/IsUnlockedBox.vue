<script setup lang="ts">
import type { Group } from '@/types'
import { ref } from 'vue'
import { trans } from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { showToast } from '@common/modules/showToast'
import { getPasswordFromStorage } from '@common/modules/storage/getPasswordFromStorage'
import { deletePasswordFromStorage } from '@common/modules/storage/deletePasswordFromStorage'
import LockClosedIcon from '@common/components/Icons/LockClosedIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import SmallSpinner from '@common/components/SmallSpinner.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const groupStore = useGroupStore()
const { openPopup, onClose } = usePopupStore()

const newPassword = ref<boolean>(false)
const lockLoading = ref<boolean>(false)

async function promptEnterPassword(): Promise<void> {
    if (lockLoading.value) {
        return
    }

    if (newPassword.value) {
        await deletePasswordFromStorage(group.id)
    }

    const pass = await getPasswordFromStorage(group.id)

    if (pass) {
        await lockGroup(pass)
        return
    }

    if (!newPassword.value) {
        showToast(trans('cant_remember_pass'), 'error', 4000)
    }

    openPopup('newPassword')
    onClose(async (newPass: string) => await lockGroup(newPass))
}

async function lockGroup(pass: string): Promise<void> {
    lockLoading.value = true

    await groupStore.encryptGroupById(group.id, pass)
    await deletePasswordFromStorage(group.id)

    lockLoading.value = false

    showToast(trans('group_locked'))
}
</script>

<template>
    <WarningBox :message="trans('private_group_unlocked')">
        <div class="w-52 flex flex-col items-center gap-1.5">
            <button
                :disabled="lockLoading"
                @click="promptEnterPassword"
                :class="[
                    'bg-unsafe px-3 py-2 rounded-md w-32',
                    'text-sm hover:bg-unsafe-hover text-bg font-semibold',
                    'flex items-center gap-2 justify-center',
                    lockLoading ? 'opacity-60' : '',
                ]"
            >
                <SmallSpinner v-if="lockLoading" width="18" height="18" />
                <LockClosedIcon v-else width="18" height="18" />
                {{ trans('lock') }}
            </button>

            <label class="flex gap-1.5 align-center opacity-80">
                <input type="checkbox" v-model="newPassword" />
                <small>{{ trans('new_password') }}</small>
            </label>
        </div>
    </WarningBox>
</template>
