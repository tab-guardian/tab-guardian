<script setup lang="ts">
import type { Group } from '@common/types'
import { ref } from 'vue'
import { trans } from '@common/modules/utils'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { useCryptoStore } from '@/stores/crypto'
import { useSettingsStore } from '@/stores/settings'
import { showToast } from '@common/modules/toast'
import {
    getPasswordFromStorage,
    deletePasswordFromStorage,
} from '@common/modules/storage/password'
import LockClosedIcon from '@common/components/Icons/LockClosedIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import ProgressBar from '@common/components/ProgressBar.vue'
import Button from '@common/components/Form/Button.vue'

const { group } = defineProps<{ group: Group }>()
const groupStore = useGroupStore()
const cryptoStore = useCryptoStore()
const settingsStore = useSettingsStore()
const { openPopup } = usePopupStore()

const useNewPassword = ref<boolean>(false)
const encrypting = ref<boolean>(false)

async function promptEnterPassword(): Promise<void> {
    if (encrypting.value) {
        return
    }

    if (!settingsStore.settings.rememberPasswordAfterUnlock) {
        useNewPassword.value = true
    }

    if (useNewPassword.value) {
        await deletePasswordFromStorage(group.id)
    }

    const pass = await getPasswordFromStorage(group.id)

    if (pass) {
        await lockGroup(pass)
        return
    }

    if (!useNewPassword.value) {
        showToast(trans('cant_remember_pass'), 'error', 4000)
    }

    openPopup('newPassword', {}).onClose(async data => {
        if (!data) {
            throw new Error("data must exist inside onClose hook in 'newPassword'")
        }

        await groupStore.updatePassword(data.newPass)
        await lockGroup(data.newPass)
    })
}

async function lockGroup(pass: string): Promise<void> {
    encrypting.value = true

    const encrypted = await groupStore.encrypt(group, pass)

    if (!encrypted) {
        console.info(`Group ${group.id} wasn't encrypted`)
        return
    }

    await groupStore.saveGroup(encrypted)
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
        <div class="w-52 flex flex-col items-end gap-1.5">
            <Button
                :icon="LockClosedIcon"
                :loading="encrypting"
                @click="promptEnterPassword"
                class-name="bg-unsafe hover:bg-unsafe-hover text-white"
            >
                {{ trans('lock') }}
            </Button>

            <label
                v-if="settingsStore.settings.rememberPasswordAfterUnlock"
                class="flex gap-1.5 align-center opacity-80"
            >
                <input type="checkbox" v-model="useNewPassword" />
                <small>{{ trans('new_password') }}</small>
            </label>
        </div>
    </WarningBox>
</template>
