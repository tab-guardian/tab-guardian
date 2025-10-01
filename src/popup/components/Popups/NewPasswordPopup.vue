<script setup lang="ts">
import { ref } from 'vue'
import { useGroupStore } from '@/stores/group'
import { trans } from '@common/modules/trans'
import { usePopupStore } from '@/stores/popup'
import { showToast } from '@common/modules/showToast'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import PasswordFields from '@/components/PasswordFields.vue'

const { closePopup } = usePopupStore()
const store = useGroupStore()

const pass = ref<string>('')
const confirmPass = ref<string>('')
const preventSubmit = ref<boolean>(true)

function updatePassword(): void {
    if (preventSubmit.value) {
        console.warn('Cannot submit because password error')
        return
    }

    store.updatePassword(pass.value)
    showToast(trans('pass_updated'))
    closePopup('newPassword', pass.value)
}
</script>

<template>
    <Popup @cancel="closePopup('newPassword')" :content="trans('enter_new_pass')">
        <form @submit.prevent="updatePassword" class="flex flex-col gap-3">
            <PasswordFields
                v-model:pass="pass"
                v-model:confirm="confirmPass"
                @loaded="el => el.focus()"
                @has-error="hasErr => preventSubmit = hasErr"
            />

            <Button
                type="submit"
                :disabled="preventSubmit"
                :icon="ChevronRightIcon"
            >
                {{ trans('save') }}
            </Button>
        </form>
    </Popup>
</template>
