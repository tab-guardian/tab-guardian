<script setup lang="ts">
import { ref } from 'vue'
import { usePopupStore } from '@/stores/popup'
import { useAttemptsStore } from '@/stores/attempts'
import { useCryptoStore } from '@/stores/crypto'
import { trans } from '@common/modules/utils'
import { showToast } from '@common/modules/toast'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import WarningBox from '@common/components/WarningBox.vue'
import ProgressBar from '@common/components/ProgressBar.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'
import Popup from '@/components/Popups/Popup.vue'

const { getSharedData, closePopup } = usePopupStore()
const attemptsStore = useAttemptsStore()
const cryptoStore = useCryptoStore()

const password = ref<string>('')
const processing = ref<boolean>(false)

const sharedData = getSharedData('enterPassword')

async function submitPassword(): Promise<void> {
    if (processing.value) {
        return
    }

    if (!sharedData) {
        showToast(trans('error_occurred'), 'error')
        throw new Error('sharedData is null in EnterPasswordPopup.vue')
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

    processing.value = true

    const success = await sharedData.decrypting(password.value)

    if (success) {
        await attemptsStore.unlock()
        closePopup('enterPassword', {})
    } else if (attemptsStore.isLocked) {
        showToast(attemptsStore.isLockedErrorMessage(), 'error', 5000)
    }

    processing.value = false
    password.value = ''
}
</script>

<template>
    <Popup @cancel="closePopup('enterPassword', {})" :content="trans('enter_pass')">
        <p class="flex items-center gap-3 mb-2 text-sm leading-4">
            <ShieldCheckIcon width="45" height="45" />
            {{ sharedData?.description }}
        </p>

        <form @submit.prevent="submitPassword">
            <PasswordInput
                @loaded="inp => inp.focus()"
                v-model="password"
                id="enter-password"
                :label="trans('enter_pass')"
                :with-button="true"
                :loading="processing"
            />
        </form>

        <ProgressBar
            v-if="processing"
            :current="cryptoStore.progress.current"
            :max="cryptoStore.progress.max"
            class="mt-3"
        />

        <WarningBox
            v-if="sharedData && !sharedData.algo"
            class="mt-4"
            :message="trans('uses_old_encrypt_impl')"
        />
    </Popup>
</template>
