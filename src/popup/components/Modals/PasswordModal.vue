<script setup lang="ts">
import { ref, computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import { useAttemptsStore } from '@/stores/attempts'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import Progress from '@common/components/Progress.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'
import Modal from '@/components/Modals/Modal.vue'

const modalStore = useModalStore()
const attemptsStore = useAttemptsStore()

const pass = ref<string>('')
const processing = ref<boolean>(false)

const sharedData = computed(() => {
    const data = modalStore.getSharedData('password')

    if (!data) {
        showToast({ text: trans('error_occurred'), type: 'error' })
        throw new Error('sharedData must not be nullable in PasswordModal.vue')
    }

    return data
})

async function submitPassword(): Promise<void> {
    if (processing.value) {
        return
    }

    if (!pass.value) {
        showToast({ text: trans('enter_pass'), type: 'error' })
        return
    }

    const attempt = await attemptsStore.makeAttempt()

    if (!attempt.success) {
        showToast({ text: attempt.error, type: 'error' })
        pass.value = ''
        return
    }

    processing.value = true

    const isSuccess = await decryptPassword()
        .catch(showDecryptError)
        .finally(finishProcessing)

    if (isSuccess === null) {
        return
    }

    if (isSuccess) {
        await attemptsStore.unlock()
        modalStore.hide('password', {})
        return
    }

    if (attemptsStore.isLocked) {
        showToast({
            text: attemptsStore.isLockedErrorMessage(),
            type: 'error',
        })
    }
}

async function decryptPassword(): Promise<boolean> {
    return sharedData.value.decrypting(pass.value)
}

function showDecryptError(): null {
    showToast({ text: trans('error_occurred'), type: 'error' })
    return null
}

function finishProcessing(): void {
    processing.value = false
    pass.value = ''
}
</script>

<template>
    <Modal @cancel="modalStore.hide('password', {})" :title="trans('enter_pass')">
        <p class="flex items-center gap-3 mb-2 text-sm leading-4">
            <ShieldCheckIcon width="45" height="45" />
            {{ sharedData.text }}
        </p>

        <form @submit.prevent="submitPassword">
            <PasswordInput
                @loaded="el => el.focus()"
                v-model="pass"
                id="enter-password"
                :label="trans('enter_pass')"
                :with-button="true"
                :loading="processing"
            />
        </form>

        <Progress v-if="processing" class="mt-3" />
    </Modal>
</template>
