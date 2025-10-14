<script setup lang="ts">
import { ref } from 'vue'
import { trans } from '@common/modules/utils'
import { usePopupStore } from '@/stores/popup'
import { showToast } from '@common/modules/toast'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import PasswordFields from '@/components/PasswordFields.vue'

const popupStore = usePopupStore()

const pass = ref<string>('')
const confirmPass = ref<string>('')
const preventSubmit = ref<boolean>(true)

function updatePassword(): void {
    if (preventSubmit.value) {
        console.info('Cannot submit because password error')
        return
    }

    showToast(trans('pass_updated'))
    closePasswordPopup()
}

function closePasswordPopup(): void {
    popupStore.hide('newPassword', { newPass: pass.value })
}
</script>

<template>
    <Popup @cancel="closePasswordPopup" :content="trans('enter_pass')">
        <form @submit.prevent="updatePassword" class="flex flex-col gap-3">
            <PasswordFields
                v-model:pass="pass"
                v-model:confirm="confirmPass"
                @loaded="el => el.focus()"
                @has-error="hasErr => (preventSubmit = hasErr)"
            />

            <Button type="submit" :disabled="preventSubmit" :icon="ChevronRightIcon">
                {{ trans('confirm') }}
            </Button>
        </form>
    </Popup>
</template>
