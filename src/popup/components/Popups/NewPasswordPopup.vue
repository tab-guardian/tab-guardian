<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { showToast } from '@common/modules/showToast'
import { env } from '@common/env'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import PasswordInput from '@common/components/Form/PasswordInput.vue'

const { closePopup } = usePopupStore()
const store = useGroupStore()

const pass = ref<string>('')
const confirmPass = ref<string>('')

const passwordErr = computed<string>(() => {
    return confirmPass.value.length > 0 && pass.value !== confirmPass.value
        ? trans('passwords_not_match')
        : ''
})

const preventPasswordSubmit = computed<boolean>(() => {
    return !!passwordErr.value || !pass.value || !confirmPass.value
})

function updatePassword(): void {
    store.updatePassword(pass.value)
    showToast(trans('pass_updated'))
    closePopup('newPassword', pass.value)
}
</script>

<template>
    <Popup @cancel="closePopup('newPassword')" :content="trans('enter_new_pass')">
        <form @submit.prevent="updatePassword" class="flex flex-col gap-3">
            <PasswordInput
                v-model="pass"
                id="group-password"
                :label="trans('enter_pass')"
                :minlength="env.MIN_PASS_LENGTH"
            />

            <PasswordInput
                v-model="confirmPass"
                id="group-confirm-password"
                :label="trans('repeat_pass')"
                :error="passwordErr"
                :minlength="env.MIN_PASS_LENGTH"
            />

            <div class="flex items-end gap-3 justify-between">
                <Button
                    type="submit"
                    :disabled="preventPasswordSubmit"
                    :icon="ChevronRightIcon"
                >
                    {{ trans('save') }}
                </Button>
            </div>
        </form>
    </Popup>
</template>
