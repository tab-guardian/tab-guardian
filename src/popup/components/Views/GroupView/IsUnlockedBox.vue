<script setup lang="ts">
import type { Group } from '@/types'
import { ref } from 'vue'
import { trans } from '@common/modules/trans'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { useCryptoStore } from '@/stores/crypto'
import { showToast } from '@common/modules/showToast'
import { getPasswordFromStorage, deletePasswordFromStorage } from '@common/modules/storage/password'
import LockClosedIcon from '@common/components/Icons/LockClosedIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import SmallSpinner from '@common/components/SmallSpinner.vue'
import ProgressBar from '@common/components/ProgressBar.vue'

type Props = {
    group: Group
}

const { group } = defineProps<Props>()
const groupStore = useGroupStore()
const cryptoStore = useCryptoStore()
const { openPopup, onClose } = usePopupStore()

const newPassword = ref<boolean>(false)
const encrypting = ref<boolean>(false)

async function promptEnterPassword(): Promise<void> {
    if (encrypting.value) {
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
    encrypting.value = true

    await groupStore.encryptGroupById(group.id, pass)
    await deletePasswordFromStorage(group.id)

    encrypting.value = false

    showToast(trans('group_locked'))
}
</script>

<template>
    <ProgressBar
        v-if="encrypting"
        :current="cryptoStore.progress.current"
        :max="cryptoStore.progress.max"
    />

    <WarningBox :message="trans('private_group_unlocked')">
        <div class="w-52 flex flex-col items-center gap-1.5">
            <button
                :disabled="encrypting"
                @click="promptEnterPassword"
                :class="[
                    'bg-unsafe px-3 py-2 rounded-md w-32',
                    'text-sm text-bg font-semibold',
                    'flex items-center gap-2 justify-center',
                    encrypting ? 'opacity-70' : 'hover:bg-unsafe-hover',
                ]"
            >
                <SmallSpinner v-if="encrypting" width="18" height="18" />
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
