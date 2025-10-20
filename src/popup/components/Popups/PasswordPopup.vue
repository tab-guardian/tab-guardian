<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePopupStore } from '@/stores/popup'
import { useAttemptsStore } from '@/stores/attempts'
import { trans } from '@common/modules'
import { showToast } from '@common/modules/toast'
import ShieldCheckIcon from '@common/components/Icons/ShieldCheckIcon.vue'
import Progress from '@common/components/Progress.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'
import Popup from '@/components/Popups/Popup.vue'

const popupStore = usePopupStore()
const attemptsStore = useAttemptsStore()

const pass = ref<string>('')
const processing = ref<boolean>(false)

const sharedData = computed(() => {
    const data = popupStore.getSharedData('password')

    if (!data) {
        showToast({ text: trans('error_occurred'), type: 'error' })
        throw new Error('sharedData must not be nullable in PasswordPopup.vue')
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
        showToast({ text: attempt.error, type: 'error', duration: 5000 })
        pass.value = ''
        return
    }

    processing.value = true

    const success = await sharedData.value.decrypting(pass.value)

    if (success) {
        await attemptsStore.unlock()
        popupStore.hide('password', {})
    } else if (attemptsStore.isLocked) {
        showToast({
            text: attemptsStore.isLockedErrorMessage(),
            type: 'error',
            duration: 5000,
        })
    }

    processing.value = false
    pass.value = ''
}
</script>

<template>
    <Popup
        @cancel="popupStore.hide('password', {})"
        :content="trans('enter_pass')"
    >
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
    </Popup>
</template>
