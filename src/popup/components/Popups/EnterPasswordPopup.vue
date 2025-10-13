<script setup lang="ts">
import type { Group } from '@common/types'
import { isWrongPassError, getDecryptionError } from '@/errors'
import { ref, computed } from 'vue'
import { trans } from '@common/modules/utils'
import { useGroupStore } from '@/stores/group'
import { useTabsStore } from '@/stores/tabs'
import { usePopupStore } from '@/stores/popup'
import { useAttemptsStore } from '@/stores/attempts'
import { useCryptoStore } from '@/stores/crypto'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from '@common/modules/toast'
import { savePasswordToStorage } from '@common/modules/storage/password'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import ProgressBar from '@common/components/ProgressBar.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'
import Message from '@common/components/Message.vue'
import Popup from '@/components/Popups/Popup.vue'

const route = useRoute()
const router = useRouter()
const groupStore = useGroupStore()
const { getSharedData, closePopup } = usePopupStore()
const tabsStore = useTabsStore()
const cryptoStore = useCryptoStore()
const attemptsStore = useAttemptsStore()

const password = ref<string>('')
const decrypting = ref<boolean>(false)

const group = computed<Group | null>(() => getSharedData<Group>('enterPassword'))

async function submitPass(): Promise<void> {
    if (decrypting.value) {
        return
    }

    if (!password.value) {
        showToast(trans('enter_pass'), 'error')
        return
    }

    const attempt = await attemptsStore.makeAttempt()

    if (!attempt.success) {
        showToast(attempt.error, 'error', 5000)
        password.value = ''
        return
    }

    try {
        await unlockGroup()
    } catch (err: any) {
        handleUnlockGroupError(err)
    }

    decrypting.value = false
    password.value = ''
}

async function unlockGroup(): Promise<void> {
    if (!group.value) {
        return
    }

    decrypting.value = true

    const decryptedGroup = await cryptoStore.decryptGroup(
        group.value,
        password.value,
    )

    await groupStore.saveGroup(decryptedGroup)
    await attemptsStore.unlock()

    // With this, we don't need to type password to lock the
    // group after just unlocking it
    await savePasswordToStorage(group.value.id, password.value)

    route.params.openTabs === 'true'
        ? openTabsAndEncryptGroup()
        : showToast(trans('group_unlocked'))

    await router.push({ name: 'group', params: { id: group.value.id } })

    closePopup('enterPassword')
}

function handleUnlockGroupError(err: any): void {
    if (!isWrongPassError(err)) {
        showToast(getDecryptionError(err), 'error')
        return
    }

    showToast(getDecryptionError(err), 'error')

    if (attemptsStore.isLocked) {
        showToast(attemptsStore.isLockedErrorMessage(), 'error', 5000)
    }
}

async function openTabsAndEncryptGroup(): Promise<void> {
    if (!group.value) {
        return
    }

    await tabsStore.openTabs(group.value, password.value)
    await router.push({ name: 'main' })

    closePopup('enterPassword')
}
</script>

<template>
    <Popup @cancel="closePopup('enterPassword')" :content="trans('enter_pass')">
        <template v-if="group">
            <p class="flex items-center gap-3 mb-2 text-sm leading-4">
                <ShieldCheckIcon width="45" height="45" />
                {{ trans('enter_pass_unlock_content') }}
            </p>

            <form @submit.prevent="submitPass">
                <PasswordInput
                    @loaded="inp => inp.focus()"
                    v-model="password"
                    id="enter-password"
                    :label="trans('enter_pass')"
                    :with-button="true"
                    :loading="decrypting"
                />
            </form>

            <ProgressBar
                v-if="decrypting"
                :current="cryptoStore.progress.current"
                :max="cryptoStore.progress.max"
                class="mt-3"
            />

            <WarningBox
                v-if="!group.algo"
                class="mt-4"
                :message="trans('uses_old_encrypt_impl')"
            />
        </template>

        <Message v-else>😢 {{ trans('error_no_group_selected') }}</Message>
    </Popup>
</template>
