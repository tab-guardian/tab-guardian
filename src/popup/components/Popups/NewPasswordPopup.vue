<script setup lang="ts">
import { ref } from 'vue'
import { logger, trans } from '@common/modules'
import { usePopupStore } from '@/stores/popup'
import Popup from '@/components/Popups/Popup.vue'
import Button from '@common/components/Form/Button.vue'
import ChevronRightIcon from '@common/components/Icons/ChevronRightIcon.vue'
import PasswordInputs from '@/components/PasswordInputs.vue'

const popupStore = usePopupStore()

const pass = ref<string>('')
const confirmPass = ref<string>('')
const preventSubmit = ref<boolean>(true)

function updatePassword(): void {
    if (preventSubmit.value) {
        logger().info('Cannot submit because password error')
        return
    }

    popupStore.hide('newPassword', { newPass: pass.value })
}

function hidePasswordPopup(): void {
    popupStore.hide('newPassword', { newPass: null })
}
</script>

<template>
    <Popup @cancel="hidePasswordPopup" :content="trans('enter_new_pass')">
        <form @submit.prevent="updatePassword" class="flex flex-col gap-3">
            <PasswordInputs
                v-model:pass="pass"
                v-model:confirm="confirmPass"
                @loaded="el => el.focus()"
                @has-error="preventSubmit = $event"
            />

            <Button type="submit" :disabled="preventSubmit" :icon="ChevronRightIcon">
                {{ trans('confirm') }}
            </Button>
        </form>
    </Popup>
</template>
