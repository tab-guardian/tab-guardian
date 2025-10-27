<script setup lang="ts">
import type { Group } from '@common/types'
import { ref } from 'vue'
import { logger, trans } from '@common/modules'
import { useGroupStore } from '@/stores/group'
import { usePopupStore } from '@/stores/popup'
import { useSettingsStore } from '@/stores/settings'
import { showToast } from '@common/modules/toast'
import { passwordStorage } from '@common/modules/storage/password'
import LockClosedIcon from '@common/components/Icons/LockClosedIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import Progress from '@common/components/Progress.vue'
import Button from '@common/components/Form/Button.vue'

const props = defineProps<{ group: Group }>()
const groupStore = useGroupStore()
const settingsStore = useSettingsStore()
const popupStore = usePopupStore()

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
        await passwordStorage.delete(props.group.id)
    }

    const pass = await passwordStorage.get(props.group.id)

    if (pass) {
        await lockGroup(pass)
        return
    }

    if (!useNewPassword.value) {
        showToast({
            text: trans('enter_your_password'),
            duration: 4000,
        })
    }

    const resp = await popupStore.show('newPassword', {})
    const newPass = resp?.newPass

    if (!newPass) {
        encrypting.value = false
        return
    }

    await passwordStorage.save(props.group.id, newPass)
    await lockGroup(newPass)
}

async function lockGroup(pass: string): Promise<void> {
    encrypting.value = true

    const locking = await groupStore.lock(props.group, pass)

    showToast({
        text: locking.message,
        type: locking.failed ? 'error' : 'info',
    })

    if (locking.failed) {
        logger().info(`Group ${props.group.id} wasn't encrypted`)
        return
    }

    await groupStore.save(locking.group)
    await passwordStorage.delete(props.group.id)

    encrypting.value = false
}
</script>

<template>
    <Progress v-if="encrypting" />

    <WarningBox :message="trans('private_group_unlocked')">
        <div class="w-52 flex flex-col items-end gap-1.5">
            <Button
                is="danger"
                :icon="LockClosedIcon"
                :loading="encrypting"
                @click="promptEnterPassword"
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
